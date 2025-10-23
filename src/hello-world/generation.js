/*
 *
 *      Registering voxel types
 * 
 *  Two step process. First you register a material, specifying the 
 *  color/texture/etc. of a given block face, then you register a 
 *  block, which specifies the materials for a given block type.
 * 
*/
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { createNoise2D } from 'simplex-noise'
import { logHud } from './hud'
const axios = require('axios');

const OLLAMA_CONFIG = {
  endpoint: 'https://341f48ced197.ngrok-free.app',
  completionPath: '/v1/completions',
  model: 'deepseek-r1:1.5b',
  timeoutMs: 30 * 1000,
  maxTokens: 2048,
};

const ollamaClient = axios.create({
  baseURL: OLLAMA_CONFIG.endpoint,
  timeout: OLLAMA_CONFIG.timeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

ollamaClient.interceptors.request.use((config) => {
  if (config && typeof config.data === 'object' && config.data !== null) {
    if (config.data.max_tokens == null) {
      config.data.max_tokens = OLLAMA_CONFIG.maxTokens;
    }
  }
  return config;
});

export let materials = [];
export let blocks = [];
export let materialIds = {};
export let lastBiome = null;
let contentPrepared = false;
let lastSeed = null;

function reportWorldgen(message, level = 'info') {
  if (!message) return;
  const prefixed = `[worldgen] ${message}`;
  if (level === 'warn') console.warn(prefixed);
  else if (level === 'error') console.error(prefixed);
  else console.log(prefixed);
  logHud(prefixed, level);
}

export async function prepareWorldContent() {
  if (contentPrepared) {
    reportWorldgen('World content already prepared, reusing cached data.');
    return;
  }
  const seed = Math.floor(Math.random() * 1e9);
  lastSeed = seed;
  reportWorldgen(`preparing procedural content (seed ${seed})`);
  try {
    const content = await generateProceduralContent(seed);
    materials = content.materials;
    blocks = content.blocks;
    lastBiome = content.biome || null;
    reportWorldgen(`Biome: ${lastBiome?.name || 'Unnamed'}`);
  } catch (error) {
    reportWorldgen(`primary content generation failed: ${error.message || error}. Using fallback set.`, 'warn');
    const fallback = generateFallbackContent(seed);
    materials = sanitizeMaterials(fallback.materials);
    blocks = sanitizeBlocks(fallback.blocks, materials);
    lastBiome = fallback.biome || null;
  }
  contentPrepared = true;
}

export async function init_texture(noa) {
  if (!contentPrepared || !materials.length || !blocks.length) {
    await prepareWorldContent();
  }
  materialIds = {};
  reportWorldgen('Registering materials with engine.');
  for (const material of materials) {
    const numericId = await create_material(material, noa);
    materialIds[material.id] = numericId;
  }
  reportWorldgen(`Registering ${blocks.length} block definitions.`);
  for (const block of blocks) {
    registerBlock(noa, block);
  }

  const biomeName = lastBiome && lastBiome.name ? lastBiome.name : 'unknown biome';
  reportWorldgen(`ready: ${biomeName} (${materials.length} materials / ${blocks.length} blocks)`);
}

async function generateProceduralContent(seed) {
  const biomeDraft = await generateBiomeConcept(seed);
  const biomeCritique = await critiqueBiomeConcept(biomeDraft).catch(() => null);
  const biomeFinal = biomeCritique
    ? await refineBiomeConcept(biomeDraft, biomeCritique).catch(() => biomeDraft)
    : biomeDraft;

  reportWorldgen('Requesting block type lineup...');
  const blockTypes = await generateBlockTypeList(biomeFinal, seed);
  if (!blockTypes.length) {
    throw new Error('No block types generated');
  }
  reportWorldgen(`Block types (${blockTypes.length}): ${blockTypes.map((t) => t.name).join(', ')}`);

  const collectedBlocks = [];
  const materialMap = new Map();

  for (let i = 0; i < blockTypes.length; i++) {
    const blockType = blockTypes[i];
    reportWorldgen(`Detailing block ${i + 1}/${blockTypes.length}: ${blockType.name}`);
    try {
      const detail = await generateBlockDetail(blockType, biomeFinal, seed, i);
      if (detail.block) {
        collectedBlocks.push(detail.block);
        reportWorldgen(`→ ${detail.block.name}: faces ${detail.block.materials.join(', ')}`);
      }
      (detail.materials || []).forEach((mat) => {
        if (!mat || !mat.id) return;
        const existed = materialMap.has(mat.id);
        if (materialMap.has(mat.id)) return;
        materialMap.set(mat.id, mat);
        if (!existed) {
          reportWorldgen(`   ↳ new material ${mat.id} (${mat.name})`);
        }
      });
    } catch (error) {
      reportWorldgen(`Failed to build block ${blockType.name}: ${error.message || error}`, 'warn');
    }
  }

  let materialList = Array.from(materialMap.values());
  collectedBlocks.forEach((block) => {
    block.materials.forEach((matId) => {
      if (!materialMap.has(matId)) {
        const placeholder = {
          id: matId,
          name: matId.replace(/_/g, ' '),
          opaque: true,
          color: [0.5, 0.5, 0.5],
          texture: `${matId} fallback texture`,
        };
        materialMap.set(matId, placeholder);
        reportWorldgen(`   ↳ added fallback material ${matId}`, 'warn');
      }
    });
  });
  materialList = Array.from(materialMap.values());
  if (!collectedBlocks.length || !materialList.length) {
    throw new Error('Block/material generation failed');
  }

  const materialsSanitized = sanitizeMaterials(materialList);
  const blocksSanitized = sanitizeBlocks(collectedBlocks, materialsSanitized);

  reportWorldgen(`Generated ${blocksSanitized.length} blocks with ${materialsSanitized.length} materials`);

  return {
    biome: biomeFinal.biome,
    blocks: blocksSanitized,
    materials: materialsSanitized,
  };
}

async function generateBiomeConcept(seed) {
  const prompt = [
    'You are ARCHITECT-1, a visionary biome imagineer for a voxel survival game.',
    `Random seed: ${seed}`,
    'Invent a fresh biome concept. Reply as plain text with one key:value per line.',
    'Use these keys: biome_name, biome_theme, biome_climate, world_summary, surface_layer, subsurface_layer, deep_layer, primary_tree, other_plants, fluids.',
    'Provide exactly two feature lines formatted as feature: description.',
    'Values must be single-line, no code fences, no extra commentary.',
    'Example:',
    'biome_name: Ember Tundra',
    'feature: geothermal crevasses',
    'feature: aurora skies',
    '...continue with remaining keys...',
  ].join('\n');

  const text = await callOllamaPlain(prompt, { temperature: 0.65 });
  return parseBiomeConceptText(text);
}

async function critiqueBiomeConcept(concept) {
  const context = JSON.stringify(concept, null, 2);
  const prompt = [
    'You are CRITIC-ARCH, a seasoned worldbuilding consultant.',
    'Review the biome concept below for coherence, originality, and gameplay viability.',
    'Return plain text lines:',
    'revise: yes/no',
    'strength: ... (repeatable)',
    'issue: ... (repeatable, optional)',
    'revision_focus: ... (short summary)',
    'Keep strings single-line, no extra commentary.',
    '---',
    context,
  ].join('\n');
  const text = await callOllamaPlain(prompt, { temperature: 0.4, silence: true });
  return parseCritiqueText(text);
}

async function refineBiomeConcept(concept, critique) {
  if (!critique || critique.revise === false) {
    return concept;
  }
  const prompt = [
    'You are ARCHITECT-1R, tasked with refining a biome concept based on critique.',
    'Return key:value lines using the same format as the original biome response.',
    'Focus on addressing the listed issues while preserving strengths.',
    '--- Current Concept ---',
    JSON.stringify(concept, null, 2),
    '--- Critique ---',
    JSON.stringify(critique, null, 2),
  ].join('\n');
  const text = await callOllamaPlain(prompt, { temperature: 0.6 });
  return parseBiomeConceptText(text);
}

async function generateBlockTypeList(biome, seed) {
  const prompts = [
    [
      'You are BLOCK-PLANNER, outlining block types for a voxel biome.',
      `Random seed: ${seed}`,
      'Produce 8-12 block concepts separated by lines containing only ---.',
      'For each concept output plain key:value lines in this exact order:',
      'block_type: Name',
      'id_hint: identifier (optional, lowercase, no spaces)',
      'role: short description (optional)',
      'Do NOT output JSON, braces { }, brackets, quotation marks, or commentary.',
      'Example block entry:',
      'block_type: Basalt Shelf',
      'id_hint: basalt_shelf',
      'role: Rugged volcanic stone layer',
      '---',
      'Follow this pattern for every block.',
      '--- Biome ---',
      JSON.stringify(biome, null, 2),
    ].join('\n'),
    [
      'You are BLOCK-PLANNER, outlining block types for a voxel biome.',
      `Random seed: ${seed}`,
      'Output ONLY blocks in this format with NO extra text:',
      'block_type: ...',
      'id_hint: ...',
      'role: ...',
      '---',
      'Repeat 8-12 times. Absolutely no explanations, JSON, or descriptive prose.',
      '--- Biome ---',
      JSON.stringify(biome, null, 2),
    ].join('\n'),
    [
      'List 8-12 block types for this voxel biome using the exact structure:',
      'block_type: ...',
      'id_hint: ...',
      'role: ...',
      '---',
      'Never include other text.',
      '--- Biome ---',
      JSON.stringify(biome, null, 2),
    ].join('\n'),
  ];

  for (let attempt = 0; attempt < prompts.length; attempt++) {
    const prompt = prompts[attempt];
    const text = await callOllamaPlain(prompt, { temperature: attempt === 0 ? 0.5 : 0.35 });
    const list = parseBlockTypeList(text);
    if (list.length) {
      reportWorldgen(`Block planner attempt ${attempt + 1} produced ${list.length} types.`);
      return list;
    }
    reportWorldgen(`Block planner attempt ${attempt + 1} failed. Snippet: "${text.slice(0, 140)}"`, 'warn');
  }
  return [];
}

async function generateBlockDetail(blockType, biome, seed, index) {
  const prompt = [
    'You are BLOCK-SMITH, defining the exact properties of a voxel block.',
    `Random seed: ${seed + index}`,
    'Provide key:value lines describing the block:',
    'block_name, id_hint (optional), min_height, max_height, probability, materials (comma list of 6 ids), solid, opaque, shining, fluid, durability.',
    'After block lines, add one line per material used in the form:',
    'material material_id: name=...; opaque=...; color=r,g,b; texture=short description',
    'Separate materials with ";" attributes as shown. No extra commentary.',
    'Do NOT output JSON, braces, brackets, or quoted strings.',
    '--- Block Type ---',
    JSON.stringify(blockType, null, 2),
    '--- Biome ---',
    JSON.stringify(biome, null, 2),
  ].join('\n');
  const text = await callOllamaPlain(prompt, { temperature: 0.55 });
  return parseBlockDetailText(text, blockType, index);
}

async function callOllamaPlain(prompt, { temperature = 0.7, silence = false } = {}) {
  if (!silence) {
    reportWorldgen('↳ ' + prompt.split('\n')[0]);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_CONFIG.timeoutMs);
  try {
    const response = await ollamaClient.post(OLLAMA_CONFIG.completionPath, {
      model: OLLAMA_CONFIG.model,
      prompt,
      temperature,
      stream: false,
      signal: controller.signal,
    });
    const rawText = extractTextFromCompletion(response.data);
    const cleaned = normalizePlainText(rawText);
    if (!cleaned.length) {
      throw new Error('Empty response from Ollama');
    }
    return cleaned;
  } catch (error) {
    throw new Error(error.name === 'AbortError' ? 'LLM request timed out' : error.message || error);
  } finally {
    clearTimeout(timeout);
  }
}

function normalizePlainText(text) {
  if (typeof text !== 'string') return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, ' ');
  cleaned = cleaned.replace(/<\/*think>/gi, ' ');
  return cleaned
    .replace(/\u0000/g, '')
    .split('\n')
    .map((line) => line.replace(/[\u0001-\u001F]/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

function splitLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
}

function parseKeyValue(line) {
  const idx = line.indexOf(':');
  if (idx === -1) return null;
  const key = line.slice(0, idx).trim().toLowerCase();
  const value = line.slice(idx + 1).trim();
  return { key, value };
}

function sanitizeIdentifier(value, fallback) {
  const base = (value || fallback || '').toString().trim();
  const sanitized = base.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (!sanitized.length) return fallback || 'id';
  return sanitized;
}

function parseBooleanValue(value, defaultValue = false) {
  if (typeof value !== 'string') return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (['true', 'yes', 'y', '1'].includes(normalized)) return true;
  if (['false', 'no', 'n', '0'].includes(normalized)) return false;
  return defaultValue;
}

function parseNumberValue(value, defaultValue = 0) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : defaultValue;
}

function parseIntegerValue(value, defaultValue = 0) {
  const num = Number.parseInt(value, 10);
  return Number.isFinite(num) ? num : defaultValue;
}

function parseCommaList(value) {
  if (typeof value !== 'string') return [];
  return value
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseBiomeConceptText(text) {
  const lines = splitLines(text);
  const data = {};
  const features = [];
  lines.forEach((line) => {
    const kv = parseKeyValue(line);
    if (!kv) return;
    const { key, value } = kv;
    if (key === 'feature') {
      features.push(value);
    } else {
      data[key] = value;
    }
  });
  if (!features.length) features.push('mysterious ambience');
  const fluids = parseCommaList(data.fluids || '');
  const otherPlants = parseCommaList(data.other_plants || '');
  return {
    biome: {
      name: data.biome_name || 'Unnamed Biome',
      theme: data.biome_theme || '',
      climate: data.biome_climate || '',
      notable_features: features,
    },
    world_summary: data.world_summary || '',
    geology: {
      surface: data.surface_layer || '',
      subsurface: data.subsurface_layer || '',
      deep: data.deep_layer || '',
    },
    flora: {
      primary_tree: data.primary_tree || '',
      other_plants: otherPlants,
    },
    fluids,
  };
}

function parseCritiqueText(text) {
  const lines = splitLines(text);
  const critique = {
    strengths: [],
    issues: [],
    revise: false,
    revision_focus: '',
  };
  lines.forEach((line) => {
    const kv = parseKeyValue(line);
    if (!kv) return;
    const { key, value } = kv;
    if (key === 'strength') critique.strengths.push(value);
    else if (key === 'issue') critique.issues.push(value);
    else if (key === 'revise') critique.revise = parseBooleanValue(value, false);
    else if (key === 'revision_focus') critique.revision_focus = value;
  });
  return critique;
}

function parseBlockTypeList(text) {
  const results = [];
  const lines = splitLines(text);
  let current = null;
  let blockIndex = 0;
  const flushCurrent = () => {
    if (current && current.name) {
      const sanitizedId = sanitizeIdentifier(current.id || current.name, `block_${blockIndex + 1}`);
      results.push({
        name: current.name.trim(),
        role: current.role || '',
        id: sanitizedId,
      });
      blockIndex += 1;
    }
    current = null;
  };

  lines.forEach((line) => {
    const dashWithName = line.match(/^---\s*(.+)$/);
    if (dashWithName) {
      flushCurrent();
      current = {
        name: dashWithName[1].trim(),
        role: '',
        id: dashWithName[1].trim(),
      };
      return;
    }
    if (/^---+$/.test(line)) {
      flushCurrent();
      return;
    }
    if (/^[\{\}]/.test(line) || /^["']/.test(line)) {
      return;
    }
    const kv = parseKeyValue(line);
    if (!kv) return;
    const { key, value } = kv;
    if (key === 'block_type' || key === 'name') {
      flushCurrent();
      current = { name: value, role: '', id: value };
    } else {
      if (!current) current = { name: '', role: '', id: '' };
      if (key === 'role') current.role = value;
      else if (key === 'id_hint' || key === 'id') current.id = value;
      else if (key === 'description' && !current.role) current.role = value;
    }
  });
  // handle lines without colon treated as names
  if (lines.length && !results.length && (!current || !current.name)) {
    const nameOnlyMatch = lines.find((ln) => !ln.includes(':') && ln.length > 0 && !/^---/.test(ln));
    if (nameOnlyMatch) {
      current = { name: nameOnlyMatch, role: '', id: nameOnlyMatch };
    }
  }
  flushCurrent();
  return results;
}

function parseMaterialLine(line) {
  const match = line.match(/^material\s+([^:]+):\s*(.*)$/i);
  if (!match) return null;
  const rawId = match[1].trim();
  const body = match[2] || '';
  const attributes = body.split(';').map((part) => part.trim()).filter(Boolean);
  const material = {
    id: sanitizeIdentifier(rawId, rawId || 'material'),
    name: rawId,
    opaque: true,
    color: [0.5, 0.5, 0.5],
    texture: '',
  };
  attributes.forEach((attr) => {
    const eqIdx = attr.indexOf('=');
    if (eqIdx === -1) return;
    const key = attr.slice(0, eqIdx).trim().toLowerCase();
    const value = attr.slice(eqIdx + 1).trim();
    if (key === 'name') material.name = value;
    else if (key === 'opaque') material.opaque = parseBooleanValue(value, true);
    else if (key === 'color') {
      const list = parseCommaList(value);
      while (list.length < 3) list.push('0.5');
      material.color = list.slice(0, 3).map((c) => clamp01(parseNumberValue(c, 0.5)));
    } else if (key === 'texture') material.texture = value;
  });
  return material;
}

function parseBlockDetailText(text, blockType, index) {
  const lines = splitLines(text);
  const map = {};
  const materialDefs = [];
  lines.forEach((line) => {
    if (line.toLowerCase().startsWith('material ')) {
      const mat = parseMaterialLine(line);
      if (mat) materialDefs.push(mat);
      return;
    }
    const kv = parseKeyValue(line);
    if (!kv) return;
    map[kv.key] = kv.value;
  });

  const name = map.block_name || map.name || blockType.name || `Block ${index + 1}`;
  const numericId = parseIntegerValue(map.id || map.index, index + 1);
  const materialIds = parseCommaList(map.materials || '').map((id, idx) => sanitizeIdentifier(id, `mat_${numericId}_${idx}`));
  while (materialIds.length < 6) {
    materialIds.push(materialIds.length ? materialIds[materialIds.length - 1] : 'stone');
  }

  const block = {
    id: numericId,
    name,
    min_height: parseNumberValue(map.min_height, -64),
    max_height: parseNumberValue(map.max_height, 32),
    materials: materialIds.slice(0, 6),
    probability: clampNumber(parseNumberValue(map.probability, 0.3), 0, 1),
    properties: {
      solid: parseBooleanValue(map.solid, true),
      opaque: parseBooleanValue(map.opaque, true),
      shining: clampNumber(parseNumberValue(map.shining, 0), 0, 1),
      fluid: parseBooleanValue(map.fluid, false),
      durability: Math.round(clampNumber(parseIntegerValue(map.durability, 30), 0, 100)),
    },
  };

  return {
    block,
    materials: materialDefs,
  };
}

function parseMaterialRecipeText(text) {
  const lines = splitLines(text);
  const map = {};
  lines.forEach((line) => {
    const kv = parseKeyValue(line);
    if (!kv) return;
    map[kv.key] = kv.value;
  });
  const paletteList = parseCommaList(map.palette || '').map((entry) => {
    let hex = entry.trim().toLowerCase();
    if (!hex.startsWith('#')) hex = `#${hex}`;
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  });
  while (paletteList.length < 3) {
    paletteList.push('#888888');
  }
  return {
    description: (map.description || '').trim(),
    pattern: (map.pattern || '').trim().toLowerCase() || 'speckled',
    accentProbability: clampNumber(parseNumberValue(map.accent_probability ?? map.accentprobability ?? 0.25, 0.25), 0, 0.8),
    scale: Math.round(clampNumber(parseNumberValue(map.scale ?? 8, 8), 2, 32)),
    palette: paletteList.slice(0, 5),
  };
}

function generateFallbackContent(seed) {
  reportWorldgen(`using deterministic fallback content for seed ${seed}`, 'warn');
  return {
    biome: {
      name: 'Fallback Plains',
      theme: 'Temperate grassland with shallow water pools',
      climate: 'mild',
      notable_features: ['rolling hills', 'patchy ponds'],
    },
    materials: [
      { id: 'bedrock', name: 'Bedrock', opaque: true, color: [0.18, 0.18, 0.2], texture: 'Dark fractured stone with subtle blue glints' },
      { id: 'stone', name: 'Stone', opaque: true, color: [0.5, 0.5, 0.5], texture: 'Gray granite speckled with lighter flecks' },
      { id: 'dirt', name: 'Dirt', opaque: true, color: [0.45, 0.3, 0.18], texture: 'Packed brown loam with pebbles' },
      { id: 'grass', name: 'Grass', opaque: true, color: [0.2, 0.72, 0.25], texture: 'Vibrant turf dotted with wild sprouts' },
      { id: 'water', name: 'Water', opaque: false, color: [0.1, 0.35, 0.8], texture: 'Clear reflective surface with gentle ripples' },
      { id: 'log_side', name: 'Oak Bark', opaque: true, color: [0.42, 0.28, 0.19], texture: 'Rough vertical bark ridges' },
      { id: 'log_top', name: 'Oak Heartwood', opaque: true, color: [0.55, 0.36, 0.23], texture: 'Tree rings with amber sheen' },
      { id: 'oak_leaves', name: 'Oak Leaves', opaque: false, color: [0.18, 0.6, 0.26], texture: 'Translucent leaf clusters in layered greens' },
      { id: 'clay', name: 'Clay', opaque: true, color: [0.62, 0.38, 0.27], texture: 'Moist clay streaked with reddish veins' },
      { id: 'gravel', name: 'Gravel', opaque: true, color: [0.45, 0.44, 0.42], texture: 'Packed pebbles in mixed grays' },
    ],
    blocks: [
      { id: 1, name: 'Bedrock', min_height: -64, max_height: -48, materials: ['bedrock','bedrock','bedrock','bedrock','bedrock','bedrock'], probability: 1.0, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 100 } },
      { id: 2, name: 'Stone', min_height: -48, max_height: -12, materials: ['stone','stone','stone','stone','stone','stone'], probability: 0.9, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 70 } },
      { id: 3, name: 'Gravel Vein', min_height: -32, max_height: -8, materials: ['gravel','gravel','gravel','gravel','gravel','gravel'], probability: 0.25, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 35 } },
      { id: 4, name: 'Clay Pocket', min_height: -20, max_height: -4, materials: ['clay','clay','clay','clay','clay','clay'], probability: 0.2, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 30 } },
      { id: 5, name: 'Dirt', min_height: -6, max_height: 0, materials: ['dirt','dirt','dirt','dirt','dirt','dirt'], probability: 0.85, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 20 } },
      { id: 6, name: 'Grass', min_height: 0, max_height: 4, materials: ['dirt','dirt','grass','dirt','dirt','dirt'], probability: 0.95, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 15 } },
      { id: 7, name: 'Water', min_height: -4, max_height: 2, materials: ['water','water','water','water','water','water'], probability: 0.08, properties: { solid: false, opaque: false, shining: 0, fluid: true, durability: 0 } },
      { id: 8, name: 'Oak Log', min_height: 1, max_height: 16, materials: ['log_side','log_side','log_top','log_top','log_side','log_side'], probability: 0.02, properties: { solid: true, opaque: true, shining: 0, fluid: false, durability: 45 } },
      { id: 9, name: 'Oak Leaves', min_height: 3, max_height: 20, materials: ['oak_leaves','oak_leaves','oak_leaves','oak_leaves','oak_leaves','oak_leaves'], probability: 0.03, properties: { solid: true, opaque: false, shining: 0, fluid: false, durability: 10 } },
    ],
  };
}

function sanitizeMaterials(rawMaterials = []) {
  const results = [];
  const seen = new Set();
  let fallbackIndex = 1;
  for (const entry of rawMaterials) {
    if (!entry) continue;
    const rawId = (entry.id || entry.name || `mat_${fallbackIndex}`).toString().trim();
    let id = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!id.length) {
      id = `mat_${fallbackIndex}`;
    }
    while (seen.has(id)) {
      id = `${id}_${fallbackIndex++}`;
    }
    seen.add(id);
    const name = entry.name ? entry.name.toString().trim() : id;
    const color = sanitizeColor(entry.color);
    const opaque = typeof entry.opaque === 'boolean' ? entry.opaque : !(id.includes('water') || id.includes('glass') || id.includes('ice'));
    const texture = entry.texture && typeof entry.texture === 'string'
      ? entry.texture.trim()
      : `${name} texture`;
    results.push({
      id,
      name,
      opaque,
      color,
      texture,
    });
    fallbackIndex += 1;
  }
  if (!results.length) {
    return sanitizeMaterials(generateFallbackContent(0).materials);
  }
  return results;
}

function sanitizeColor(value) {
  if (Array.isArray(value) && value.length >= 3) {
    const rgb = value.slice(0, 3).map((component) => clampNumber(Number(component), 0, 1));
    if (rgb.every((component) => Number.isFinite(component))) {
      return rgb;
    }
  }
  return [0.5, 0.5, 0.5];
}

function sanitizeBlocks(rawBlocks = [], materialList = []) {
  const materialIdsSet = new Set(materialList.map((mat) => mat.id));
  const safeMaterialId = materialList.length ? materialList[0].id : 'bedrock';
  const results = [];
  const usedBlockIds = new Set();
  let nextId = 1;

  for (const entry of rawBlocks) {
    if (!entry) continue;
    let id = Number.parseInt(entry.id, 10);
    if (!Number.isFinite(id) || id <= 0 || usedBlockIds.has(id)) {
      while (usedBlockIds.has(nextId)) {
        nextId += 1;
      }
      id = nextId++;
    }
    usedBlockIds.add(id);

    const name = entry.name ? entry.name.toString().trim() : `Block ${id}`;
    const minHeight = clampNumber(Number(entry.min_height ?? entry.minHeight ?? -64), -128, 64);
    const maxHeight = clampNumber(Number(entry.max_height ?? entry.maxHeight ?? minHeight + 4), -128, 64);
    const probability = clampNumber(Number(entry.probability ?? 0.3), 0, 1);

    const faceMaterials = Array.isArray(entry.materials) ? entry.materials.slice(0, 6) : [];
    while (faceMaterials.length < 6) {
      faceMaterials.push(faceMaterials.length ? faceMaterials[faceMaterials.length - 1] : safeMaterialId);
    }
    const sanitizedFaces = faceMaterials.map((faceId) => (materialIdsSet.has(faceId) ? faceId : safeMaterialId));

    const props = entry.properties || {};
    const solid = typeof props.solid === 'boolean' ? props.solid : true;
    const opaque = typeof props.opaque === 'boolean' ? props.opaque : solid;
    const fluid = typeof props.fluid === 'boolean' ? props.fluid : false;
    const shining = clampNumber(Number(props.shining ?? 0), 0, 1);
    const durability = Math.round(clampNumber(Number(props.durability ?? 25), 0, 100));

    results.push({
      id,
      name,
      min_height: Math.min(minHeight, maxHeight),
      max_height: Math.max(minHeight, maxHeight),
      materials: sanitizedFaces,
      probability,
      properties: {
        solid,
        opaque,
        fluid,
        shining,
        durability,
      },
    });
  }

  if (!results.length) {
    return sanitizeBlocks(generateFallbackContent(0).blocks, materialList);
  }

  results.sort((a, b) => a.min_height - b.min_height || a.id - b.id);

  return results;
}

function registerBlock(noa, block) {
  const faceMaterialIds = block.materials.map((matId) => {
    const resolved = materialIds[matId];
    if (typeof resolved === 'number') return resolved;
    const fallbackKey = materials.length ? materials[0].id : null;
    return fallbackKey && typeof materialIds[fallbackKey] === 'number'
      ? materialIds[fallbackKey]
      : 1;
  });

  const options = {
    material: faceMaterialIds,
    solid: block.properties.solid,
    opaque: block.properties.opaque,
    fluid: block.properties.fluid,
  };

  if (block.properties.fluid) {
    options.fluidDensity = 1.0;
    options.viscosity = 0.5;
  }

  noa.registry.registerBlock(block.id, options);
  reportWorldgen(`Registered block ${block.name} (#${block.id})`);
}
  async function create_material(material, noa ){
    try {
      const recipe = await fetchMaterialRecipe(material);
      const resolvedRecipe = applyMaterialHeuristics(
        material,
        recipe || createFallbackRecipe(material)
      );
      material.generatedRecipe = resolvedRecipe;
      reportWorldgen(`Material recipe ready for ${material.id}`);
      const tmat = buildProceduralMaterial(noa, material, resolvedRecipe);
      return noa.registry.registerMaterial(material.id, null, null, false, tmat);
    } catch (error) {
      console.warn(`Falling back to flat color for material ${material.id}: ${error.message || error}`);
      const fallbackRecipe = applyMaterialHeuristics(
        material,
        createFallbackRecipe(material)
      );
      const fallbackMaterial = buildProceduralMaterial(noa, material, fallbackRecipe);
      return noa.registry.registerMaterial(material.id, null, null, false, fallbackMaterial);
    }
    }

    async function fetchMaterialRecipe(material) {
      const baseHex = rgbFloatsToHex(material.color);
      const promptParts = [
        'You are designing procedural voxel textures for a survival crafting game.',
        `Material name: ${material.name}`,
        `Base color hint (hex): ${baseHex}`,
        'Respond using simple key:value lines:',
        'description: short texture description (≤16 words)',
        'pattern: speckled | strata | veins | mottled | wood | foliage | water',
        'palette: #hex,#hex,#hex (comma separated, at least 3)',
        'accent_probability: number between 0 and 0.6',
        'scale: integer between 3 and 20',
        'No braces, no JSON, no commentary.',
      ];
      try {
        const response = await callOllamaPlain(promptParts.join('\n'), { temperature: 0.4, silence: true });
        return parseMaterialRecipeText(response);
      } catch (err) {
        console.warn(`Unable to fetch procedural recipe for ${material.name}: ${err.message || err}`);
        return null;
      }
    }

    function extractTextFromCompletion(data) {
      if (!data) return '';
      if (Array.isArray(data.choices) && data.choices.length > 0) {
        const choice = data.choices[0];
        if (typeof choice.text === 'string') return choice.text;
        if (choice.message && typeof choice.message.content === 'string') {
          return choice.message.content;
        }
      }
      if (typeof data.completion === 'string') return data.completion;
      return '';
    }

    function buildProceduralMaterial(noa, material, recipe) {
      const scene = noa.rendering.getScene();
      const palette = getPaletteFromRecipe(recipe, material);
      const seedRng = createRng(`${material.id}-${material.name}`);
      const pattern = recipe.pattern || 'speckled';
      const accentProbability = clampNumber(recipe.accentProbability ?? 0.25, 0, 0.9);
      const scale = clampNumber(recipe.scale ?? 6, 2, 48);
      const textureSize = 64;
      const patternNoise = createNoise2D(createRng(`${material.id}-${material.name}-pattern`));
      const accentNoise = createNoise2D(createRng(`${material.id}-${material.name}-accent`));
      const dynamicTexture = new DynamicTexture(
        `proc-${material.id}`,
        { width: textureSize, height: textureSize },
        scene,
        false
      );
      const context = dynamicTexture.getContext();
      const imageData = context.createImageData(textureSize, textureSize);
      const accentColors = palette.slice(1);
      const baseColor = palette[0];
      const offsets = {
        x: seedRng() * 512,
        y: seedRng() * 512,
      };
      const baseFreq = 1 / Math.max(scale, 1);
      for (let y = 0; y < textureSize; y++) {
        for (let x = 0; x < textureSize; x++) {
          const idx = (y * textureSize + x) * 4;
          const shadeSample = patternSample(
            x,
            y,
            pattern,
            baseFreq,
            offsets,
            patternNoise
          );
          let rgb = applyBaseShading(baseColor, shadeSample);
          if (accentColors.length > 0) {
            const accentMask = noiseToUnit(
              accentNoise(
                (x + offsets.x) * baseFreq * 1.8,
                (y + offsets.y) * baseFreq * 1.8
              )
            );
            if (accentMask < accentProbability) {
              const selector = noiseToUnit(
                accentNoise(
                  (x + offsets.x) * baseFreq * 3.1 + 5.37,
                  (y + offsets.y) * baseFreq * 3.1 - 3.18
                )
              );
              const accentIndex = Math.floor(selector * accentColors.length);
              const accentColor =
                accentColors[accentIndex % accentColors.length] || baseColor;
              rgb = blendColors(rgb, accentColor, 0.4);
            }
          }
          imageData.data[idx] = rgb[0];
          imageData.data[idx + 1] = rgb[1];
          imageData.data[idx + 2] = rgb[2];
          imageData.data[idx + 3] = 255;
        }
      }
      context.putImageData(imageData, 0, 0);
      dynamicTexture.update(false);
      dynamicTexture.wrapU = Texture.WRAP_ADDRESSMODE;
      dynamicTexture.wrapV = Texture.WRAP_ADDRESSMODE;
      const tmat = noa.rendering.makeStandardMaterial('');
      tmat.diffuseTexture = dynamicTexture;
      if (material.opaque === false) {
        tmat.diffuseTexture.hasAlpha = true;
        tmat.opacityTexture = tmat.diffuseTexture;
        tmat.transparencyMode = 2;
      } else {
        tmat.bumpTexture = dynamicTexture;
      }
      tmat.metadata = {
        description: recipe.description,
        palette: palette.map(rgbToHex),
      };
      return tmat;
    }

    function createFallbackRecipe(material) {
      return {
        description: `${material.name} fallback procedural recipe`,
        palette: [rgbFloatsToHex(material.color)],
        pattern: 'speckled',
        accentProbability: 0.2,
        scale: 6,
      };
    }

    function getPaletteFromRecipe(recipe, material) {
      const palette = [];
      if (recipe && Array.isArray(recipe.palette)) {
        for (const entry of recipe.palette) {
          const rgb = hexToRgb(entry);
          if (rgb) {
            palette.push(rgb);
          }
        }
      }
      if (!palette.length) {
        palette.push(floatsToRgb(material.color));
      }
      const rng = createRng(`${material.id}-palette`);
      while (palette.length < 3) {
        const base = palette[0];
        const delta = (rng() - 0.5) * 0.25;
        palette.push(adjustColor(base, delta));
      }
      return palette;
    }

    function applyMaterialHeuristics(material, recipe) {
      const adjusted = {
        description: recipe.description,
        pattern: recipe.pattern || 'speckled',
        accentProbability: clampNumber(recipe.accentProbability ?? 0.2, 0, 0.6),
        scale: clampNumber(recipe.scale ?? 8, 3, 24),
        palette: normalizePalette(recipe.palette, material),
      };
      const name = (material.name || material.id || '').toLowerCase();
      if (name.includes('water')) {
        adjusted.pattern = 'water';
        adjusted.accentProbability = 0.05;
        adjusted.scale = 10;
      } else if (name.includes('grass')) {
        adjusted.pattern = 'mottled';
        adjusted.accentProbability = Math.min(adjusted.accentProbability, 0.15);
        adjusted.scale = Math.max(adjusted.scale, 10);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.28,
          darken: -0.25,
        });
      } else if (name.includes('leaf')) {
        adjusted.pattern = 'foliage';
        adjusted.accentProbability = Math.min(adjusted.accentProbability, 0.22);
        adjusted.scale = Math.max(adjusted.scale, 12);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.35,
          darken: -0.2,
        });
      } else if (name.includes('log') || name.includes('bark')) {
        adjusted.pattern = 'wood';
        adjusted.accentProbability = Math.max(adjusted.accentProbability, 0.25);
        adjusted.scale = Math.min(adjusted.scale, 8);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.2,
          darken: -0.35,
        });
      } else if (name.includes('stone') || name.includes('granite') || name.includes('rock')) {
        adjusted.pattern = 'veins';
        adjusted.accentProbability = Math.min(adjusted.accentProbability, 0.25);
        adjusted.scale = clampNumber(adjusted.scale, 6, 18);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.18,
          darken: -0.22,
        });
      } else if (name.includes('dirt') || name.includes('soil') || name.includes('clay') || name.includes('peat')) {
        adjusted.pattern = 'mottled';
        adjusted.accentProbability = clampNumber(adjusted.accentProbability, 0.2, 0.35);
        adjusted.scale = clampNumber(adjusted.scale, 6, 14);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.18,
          darken: -0.3,
        });
      } else if (name.includes('sand')) {
        adjusted.pattern = 'strata';
        adjusted.accentProbability = Math.min(adjusted.accentProbability, 0.18);
        adjusted.scale = Math.max(adjusted.scale, 14);
        adjusted.palette = buildThreeTonePalette(floatsToRgb(material.color), {
          lighten: 0.15,
          darken: -0.12,
        });
      }
      adjusted.palette = adjusted.palette.map(rgbToHex);
      return adjusted;
    }

    function normalizePalette(palette, material) {
      const normalized = [];
      if (Array.isArray(palette)) {
        for (const entry of palette) {
          const rgb = hexToRgb(entry);
          if (rgb) normalized.push(rgb);
        }
      }
      if (!normalized.length) {
        normalized.push(floatsToRgb(material.color));
      }
      const base = normalized[0];
      while (normalized.length < 3) {
        const offset = (normalized.length % 2 === 0) ? 0.2 : -0.25;
        normalized.push(adjustColor(base, offset));
      }
      return normalized;
    }

    function buildThreeTonePalette(baseRgb, { lighten, darken }) {
      const center = baseRgb;
      const lighter = adjustColor(baseRgb, lighten);
      const darker = adjustColor(baseRgb, darken);
      return [center, lighter, darker];
    }

    function adjustColor(rgb, delta) {
      const factor = 1 + delta;
      return [
        Math.round(clampNumber(rgb[0] * factor, 0, 255)),
        Math.round(clampNumber(rgb[1] * factor, 0, 255)),
        Math.round(clampNumber(rgb[2] * factor, 0, 255)),
      ];
    }

    function patternSample(x, y, pattern, baseFreq, offsets, noiseFn) {
      const fx = x + offsets.x;
      const fy = y + offsets.y;
      const base = fractalNoise(noiseFn, fx, fy, baseFreq, 4, 2.2, 0.55);
      switch (pattern) {
        case 'strata': {
          const layer = smoothStep(0.25, 0.75, frac(fy * baseFreq * 1.8));
          const variation = fractalNoise(noiseFn, fx, fy + base * 6.0, baseFreq * 0.5, 3, 2.1, 0.6);
          return clamp01(layer * 0.65 + variation * 0.35);
        }
        case 'veins': {
          const primary = fractalNoise(noiseFn, fx, fy, baseFreq * 1.2, 4, 1.9, 0.5);
          const detail = Math.pow(
            1 - Math.abs(noiseFn(fx * baseFreq * 3, fy * baseFreq * 3)),
            3
          );
          return clamp01(primary * 0.4 + detail * 0.6);
        }
        case 'mottled': {
          const broad = fractalNoise(noiseFn, fx, fy, baseFreq * 0.7, 3, 1.9, 0.55);
          const detail = fractalNoise(noiseFn, fx + 13.5, fy - 7.2, baseFreq * 2.6, 2, 2.4, 0.5);
          return clamp01(broad * 0.7 + detail * 0.3);
        }
        case 'wood': {
          const radial = frac(fx * baseFreq * 0.6 + base * 0.2);
          const rings = smoothStep(0.2, 0.8, radial);
          const grain = fractalNoise(noiseFn, fx, fy * 1.7, baseFreq * 2.8, 3, 2.6, 0.45);
          return clamp01(rings * 0.65 + grain * 0.35);
        }
        case 'foliage': {
          const canopy = fractalNoise(noiseFn, fx, fy, baseFreq * 0.9, 3, 2.3, 0.55);
          const gaps = Math.pow(fractalNoise(noiseFn, fx, fy, baseFreq * 2.6, 2, 2.0, 0.5), 2);
          return clamp01(canopy * 0.75 + gaps * 0.25);
        }
        case 'water': {
          const ripple = fractalNoise(noiseFn, fx, fy, baseFreq * 1.4, 4, 2.1, 0.6);
          return clamp01(0.5 + (ripple - 0.5) * 0.4);
        }
        case 'speckled':
        default: {
          const specks = fractalNoise(noiseFn, fx, fy, baseFreq * 3.2, 2, 2.8, 0.45);
          return clamp01(base * 0.6 + specks * 0.4);
        }
      }
    }

    function createRng(seedString) {
      let seed = 0;
      for (let i = 0; i < seedString.length; i++) {
        seed = (seed << 5) - seed + seedString.charCodeAt(i);
        seed |= 0;
      }
      return function rng() {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0xffffffff;
      };
    }

    function clampNumber(value, min, max) {
      const num = Number.isFinite(value) ? value : min;
      return Math.max(min, Math.min(max, num));
    }

    function clamp01(value) {
      return clampNumber(value, 0, 1);
    }

    function floatsToRgb(color) {
      if (Array.isArray(color) && color.length === 3) {
        return [
          Math.round(clamp01(color[0]) * 255),
          Math.round(clamp01(color[1]) * 255),
          Math.round(clamp01(color[2]) * 255),
        ];
      }
      return [127, 127, 127];
    }

    function rgbFloatsToHex(color) {
      const [r, g, b] = floatsToRgb(color);
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function rgbToHex(rgb) {
      return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
    }

    function toHex(component) {
      const hex = clampNumber(component, 0, 255).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }

    function hexToRgb(hex) {
      if (typeof hex !== 'string') return null;
      const sanitized = hex.trim().replace(/^#/, '');
      if (sanitized.length !== 6) return null;
      const num = parseInt(sanitized, 16);
      if (Number.isNaN(num)) return null;
      return [
        (num >> 16) & 0xff,
        (num >> 8) & 0xff,
        num & 0xff,
      ];
    }

    function applyBaseShading(baseColor, shadeSample) {
      const minFactor = 0.7;
      const maxFactor = 1.15;
      const factor = minFactor + shadeSample * (maxFactor - minFactor);
      return [
        Math.round(clampNumber(baseColor[0] * factor, 0, 255)),
        Math.round(clampNumber(baseColor[1] * factor, 0, 255)),
        Math.round(clampNumber(baseColor[2] * factor, 0, 255)),
      ];
    }

    function blendColors(source, target, amount) {
      const t = clampNumber(amount, 0, 1);
      return [
        Math.round(source[0] + (target[0] - source[0]) * t),
        Math.round(source[1] + (target[1] - source[1]) * t),
        Math.round(source[2] + (target[2] - source[2]) * t),
      ];
    }

    function noiseToUnit(value) {
      const safe = Number.isFinite(value) ? value : 0;
      return clamp01(0.5 + safe * 0.5);
    }

    function fractalNoise(noiseFn, x, y, baseFreq, octaves = 4, lacunarity = 2, gain = 0.5) {
      let amplitude = 1;
      let freq = baseFreq;
      let total = 0;
      let maxAmp = 0;
      for (let i = 0; i < octaves; i++) {
        total += noiseFn(x * freq, y * freq) * amplitude;
        maxAmp += amplitude;
        amplitude *= gain;
        freq *= lacunarity;
      }
      if (maxAmp === 0) return 0.5;
      const normalized = total / maxAmp;
      return clamp01(0.5 + normalized * 0.5);
    }

    function smoothStep(edge0, edge1, x) {
      const t = clampNumber((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    }

    function frac(value) {
      return value - Math.floor(value);
    }
