/*
 *
 *      Registering voxel types
 * 
 *  Two step process. First you register a material, specifying the 
 *  color/texture/etc. of a given block face, then you register a 
 *  block, which specifies the materials for a given block type.
 * 
*/
//const OPENAI_API_KEY = "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"
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { createNoise2D } from 'simplex-noise'
import{createGrass} from './flora'
const axios = require('axios');
const prompt = "Your task is to generate two JavaScript arrays of unique materials and blocks for a voxel-based game world.\n\nStart with the 'materials' array, which should include 11 unique materials. Each material object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the material.\n'id': This is a string that serves as a unique identifier for the material. Typically, it matches the material's name.\n'opaque': This is a boolean that indicates whether the material is opaque or not.\n'color': This is an array of three numerical values between 0 and 1. They represent the Red, Green, and Blue color values of the material.\n'texture': This string describes the material's texture in a visually detailed manner.\nHere is a template for a 'materials' array:\n\n[\n  {\n    \"name\": \"<material_name>\",\n    \"id\": \"<material_id>\",\n    \"opaque\": <true_or_false>,\n    \"color\": [\"<red_value_0_to_1>\", \"<green_value_0_to_1>\", \"<blue_value_0_to_1>\"],\n    \"texture\": \"<detailed_texture_description>\"\n  },\n  // add more material objects as needed\n]\nNext, create the 'blocks' array, which should include various blocks of these materials. Each block object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the block.\n'id': This is a string that serves as a unique identifier for the block. Typically, it matches the block's name.\n'min_height' and 'max_height': These are numerical values that represent the minimum and maximum depths at which the block can be found in the game world. The values range from -64 (deepest) to 0 (surface). You should assign these values based on real geological layers.\n'materials': This is an array of material identifiers which represents the different sides of the block. The order is: front, back, top, bottom, left, right.\n'probability': This is a numerical value between 0 and 1 that represents the chance of finding the block within its height range in the world.\n'properties': This is an object that includes the block's characteristics, such as if it's solid, its opacity, shine, if it's a fluid, and its durability.\nHere is a template for a 'blocks' array:\n\n[\n  {\n    \"name\": \"<block_name>\",\n    \"id\": \"<block_id>\",\n    \"min_height\": \"<min_height>\",\n    \"max_height\": \"<max_height>\",\n    \"materials\": [\"<material_id_front>\", \"<material_id_back>\", \"<material_id_top>\", \"<material_id_bottom>\", \"<material_id_left>\", \"<material_id_right>\"],\n    \"probability\": \"<probability_value>\",\n    \"properties\": { \n      \"solid\": <true_or_false>, \n      \"opaque\": <true_or_false>, \n      \"shining\": \"<shining_value_0_to_1>\", \n      \"fluid\": <true_or_false>, \n      \"durability\": \"<durability_value_1_to_100>\" \n    }\n  },\n  // add more block objects as needed\n]\nFill in these templates with appropriate values for each of these properties. Ensure that you follow a logical order for the geological layers and provide a range of different materials and blocks to create a rich and diverse game world.\n";

// block materials (just colors for this demo)
var textureURL = null;
// Material colors

const OLLAMA_CONFIG = {
  endpoint: 'https://341f48ced197.ngrok-free.app',
  completionPath: '/v1/completions',
  model: 'deepseek-r1:1.5b',
  timeoutMs: 120 * 1000,
};

const ollamaClient = axios.create({
  baseURL: OLLAMA_CONFIG.endpoint,
  timeout: OLLAMA_CONFIG.timeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

export var materials = [];
export var blocks = [];
export var materialIds = [];
// Register materials

// do some Babylon.js stuff with the scene, materials, etc.

export function init_texture(noa) {
  
  
  materials = [
    { name: "Bedrock", id: "bedrock", opaque : true, color: [0.196, 0.196, 0.196], texture: "Dark gray, rough and jagged surface" },
    { name: "Stone", id: "stone", opaque : true, color: [0.471, 0.471, 0.471], texture: "Smooth gray surface with occasional darker flecks" },
    { name: "Dirt", id: "dirt", opaque : true, color: [0.545, 0.271, 0.075], texture: "Brown, compacted soil with small pebbles" },
    { name: "Grass", id: "grass",opaque : true, color: [0.196, 0.804, 0.196], texture: "Green grass blades covering a layer of soil" },
    { name: "Water", id: "water", opaque : false, color: [0, 0, 1], texture: "Transparent, flowing liquid with a reflective surface" },
    { name: "Oak Log", id: "log_top", opaque : true, color: [0.627, 0.322, 0.176], texture: " with tree rings" },
    { name: "Oak Bark", id: "log_side", opaque : true, color: [0.627, 0.322, 0.176], texture: " vertical" },
    { name: "Pumpkin Top", id: "pumpkin_top", opaque : true, color: [0.980, 0.627, 0.098], texture: "Orange surface with rough ridges and a stem" },
    { name: "Pumpkin Bottom", id: "pumpkin_bottom", opaque : true, color: [0.980, 0.627, 0.098], texture: "Flat, smooth, and circular orange surface" },
    { name: "Pumpkin Side", id: "pumpkin_side", opaque : true, color: [0.980, 0.627, 0.098], texture: "Rough, ridged, and segmented orange surface with vertical lines" },
    { name: "Oak Leaves", id: "oak_leaves", opaque: false, color: [0.392, 0.706, 0.235], texture: "Cluster of green leaves with small branches and varying shades of green" }
  ];
 
  blocks = [
    { name: "Bedrock",id:1, min_height: -Infinity, max_height: -50, materials: ["bedrock","bedrock","bedrock","bedrock","bedrock","bedrock"], probability: 1, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 100} },
    { name: "Stone",id: 2,  min_height: -50, max_height: 0, materials:[ "stone","stone","stone","stone","stone","stone"], probability: 0.9, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 50 } },
    { name: "Dirt", id: 3, min_height: -5, max_height: 0, materials: ["dirt","dirt","dirt","dirt","dirt","dirt"], probability: 0.7, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 10 } },
    { name: "Grass",id: 4, min_height: 0, max_height: 5, materials: ["dirt","dirt","grass","dirt","dirt","dirt"], probability: 0.9, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 5} },
    { name: "Water",id: 5, min_height: -50, max_height: 5, materials:["water","water","water","water","water","water"], probability: 0.005, properties: { solid : false, opaque: false, shining: 0.2, fluid: true, durability: 0} },
    { name: "Log",  id: 6, min_height: 0, max_height: -1, materials:["log_side","log_side","log_top","log_top","log_side","log_side"], probability: 0.005, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 5} },
    { name: "Oak Leaves", id: 7, min_height: 0, max_height: -1, materials: ["oak_leaves", "oak_leaves", "oak_leaves", "oak_leaves", "oak_leaves", "oak_leaves"], probability: 0.005, properties: { solid: true, opaque: false, shining: 0, fluid: false, durability: 1 } },
  ];

 /*blocks = [
    {"name": "Bedrock", "min_height": -64, "max_height": -32, "materialIds": "bedrock", "probability": 0.8, "properties": { "transparency": 0, "shining": 0, "liquid": 0, "durability": 100, "color": [0.15, 0.15, 0.15], "texture": "Rough, gray stone with a few black speckles" }},
    {"name": "Granite", "min_height": -32, "max_height": -16, "materialIds": "granite", "probability": 0.8, "properties": { "transparency": 0, "shining": 0.5, "liquid": 0, "durability": 95, "color": [0.5, 0.5, 0.5], "texture": "Rough, dark gray texture interspersed with glints of shiny black speckles" }},
    {"name": "Sandstone", "min_height": -16, "max_height": -8, "materialIds": "sandstone", "probability": 0.8, "properties": { "transparency": 0, "shining": 0.3, "liquid": 0, "durability": 85, "color": [0.9, 0.8, 0.45], "texture": "Smooth, light yellow-orange with occasional brown patches" }},
    {"name": "Limestone", "min_height": -8, "max_height": -4, "materialIds": "limestone", "probability": 0.8, "properties": { "transparency": 0, "shining": 0.3, "liquid": 0, "durability": 80, "color": [0.75, 0.75, 0.75], "texture": "Light gray with occasional white and black striations" }},
    {"name": "Clay", "min_height": -4, "max_height": 0, "materialIds": "clay", "probability": 0.8, "properties": { "transparency": 0, "shining": 0.1, "liquid": 0, "durability": 65, "color": [0.4, 0.4, 0.3], "texture": "Smooth, dark brown with occasional lighter brown patches" }},
    {"name": "Silt", "min_height": -4, "max_height": 0, "materialIds": "silt", "probability": 0.6, "properties": { "transparency": 0, "shining": 0.2, "liquid": 0, "durability": 55, "color": [0.75, 0.7, 0.5], "texture": "Smooth, light grayish-brown with occasional yellow patches" }},
    {"name": "Peat", "min_height": -4, "max_height": 0, "materialIds": "peat", "probability": 0.5, "properties": { "transparency": 0, "shining": 0.1, "liquid": 0, "durability": 40, "color": [0.2, 0.15, 0.1], "texture": "Dry, dark brown with occasional light brown patches" }},
    {"name": "Sand", "min_height": -4, "max_height": 0, "materialIds": "sand", "probability": 0.6, "properties": { "transparency": 0, "shining": 0.4, "liquid": 0, "durability": 70, "color": [0.8, 0.75, 0.6], "texture": "Grainy, light beige with occasional dark brown patches" }},
    {"name": "Gravel", "min_height": -4, "max_height": 0, "materialIds": "gravel", "probability": 0.5, "properties": { "transparency": 0, "shining": 0.3, "liquid": 0, "durability": 75, "color": [0.45, 0.4, 0.35], "texture": "Rough, dark brown with occasional lighter brown patches" }},
    {"name": "Soil", "min_height": -4, "max_height": 0, "materialIds": "soil", "probability": 0.7, "properties": { "transparency": 0, "shining": 0.2, "liquid": 0, "durability": 50, "color": [0.6, 0.5, 0.4], "texture": "Light brown with occasional dark patches" }},
    {"name": "Grass", "min_height": 0, "max_height": 0, "materialIds": "grass", "probability": 0.8, "properties": { "transparency": 0, "shining": 0.1, "liquid": 0, "durability": 30, "color": [0.3, 0.5, 0.2], "texture": "Lush, light green with occasional yellow patches" }}
  ]
 */
  for (var material of materials) {
    noa.registry.registerMaterial(material.id, material.color, null);
    create_material(material, noa); 
}



for (var block of blocks) {
   
    
    //materials[i].material = noa.registry.registerBlock(1.0+Number(i), { material: materials[i].materialIds, });
    
     noa.registry.registerBlock( 
      block.id, { 
        solid : block.properties.solid,
        material: block.materials,
        opaque:  block.properties.opaque,
        fluid: block.properties.fluid,
        fluidDensity: 0.1 ,
        viscosity: 0.5 
      });
      console.log(block.materials);

    //create_material(materials[i], noa); 
  }
  /*var scene = noa.rendering.getScene();
  var mesh = createGrass([0,0,0], 10, 0.5, 0.7, 0.05, 0.07, scene);
  console.log(mesh );
  noa.registry.registerBlock(8, {
  blockMesh: mesh,
  opaque: true
  
});*/

}
  function create_material(material, noa ){
    fetchMaterialRecipe(material)
      .then((recipe) => {
        const resolvedRecipe = applyMaterialHeuristics(
          material,
          recipe || createFallbackRecipe(material)
        );
        material.generatedRecipe = resolvedRecipe;
        console.log('Material recipe', material.id, resolvedRecipe);
        const tmat = buildProceduralMaterial(noa, material, resolvedRecipe);
        noa.registry.registerMaterial(material.id, null, null, false, tmat);
      })
      .catch((error) => {
        console.warn(`Falling back to flat color for material ${material.id}: ${error.message || error}`);
        const fallbackRecipe = applyMaterialHeuristics(
          material,
          createFallbackRecipe(material)
        );
        const fallbackMaterial = buildProceduralMaterial(noa, material, fallbackRecipe);
        noa.registry.registerMaterial(material.id, null, null, false, fallbackMaterial);
      });
    }

    async function fetchMaterialRecipe(material) {
      const baseHex = rgbFloatsToHex(material.color);
      const promptParts = [
        'You are designing procedural voxel textures for a survival crafting game.',
        `Material name: ${material.name}`,
        `Base color hint (hex): ${baseHex}`,
        'Respond with compact JSON using this schema:',
        '{',
        '  "description": string,',
        '  "palette": array of 3 hex colors (e.g. ["#a1b2c3","..."]),',
        '  "pattern": one of ["speckled","strata","veins","mottled"],',
        '  "accentProbability": number between 0 and 0.6,',
        '  "scale": integer between 3 and 20',
        '}',
        'Return JSON only without code fences or extra commentary.',
      ];
      try {
        const response = await ollamaClient.post(
          OLLAMA_CONFIG.completionPath,
          {
            model: OLLAMA_CONFIG.model,
            prompt: promptParts.join('\n'),
            stream: false,
            temperature: 0.35,
          }
        );
        const rawText = extractTextFromCompletion(response.data);
        const parsed = extractJsonObject(rawText);
        return parsed ? sanitizeRecipe(parsed) : null;
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

    function extractJsonObject(text) {
      if (typeof text !== 'string' || text.trim().length === 0) return null;
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      try {
        return JSON.parse(match[0]);
      } catch (error) {
        console.warn(`Failed to parse recipe JSON: ${error.message || error}`);
        return null;
      }
    }

    function sanitizeRecipe(raw) {
      const recipe = {};
      recipe.description = typeof raw.description === 'string' ? raw.description.trim() : '';
      recipe.pattern = typeof raw.pattern === 'string' ? raw.pattern.toLowerCase() : 'speckled';
      recipe.accentProbability = clampNumber(Number(raw.accentProbability ?? 0.25), 0, 0.8);
      recipe.scale = Math.round(clampNumber(Number(raw.scale ?? 6), 2, 32));
      recipe.palette = Array.isArray(raw.palette) ? raw.palette.slice(0, 5) : [];
      return recipe;
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

    /*
    const axios = require("axios");

require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const client = axios.create({
  headers: {
    Authorization: "Bearer " + apiKey,
  },
});

const params = {
  prompt: "How are you?",
  model: "text-davinci-003",
  max_tokens: 10,
  temperature: 0,
};

client
  .post("https://api.openai.com/v1/completions", params)
  .then((result) => {
    console.log(result.data.choices[0].text);
  })
  .catch((err) => {
    console.log(err);
  });
    */
  import { OpenAI } from "langchain/llms/openai";
  import { BufferMemory } from "langchain/memory";
  import { ConversationChain } from "langchain/chains";
  import { SimpleSequentialChain, LLMChain } from "langchain/chains";
  import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
  } from "langchain/prompts";
  import {  PipelinePromptTemplate } from "langchain/prompts";
  
  //export const run = async () => {
 

    export async function create_material_list( ){

      
const llm = new OpenAI({ openAIApiKey: "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",maxTokens:-1, modelName: "gpt-4"});
const memory = new BufferMemory();
// This is an LLMChain to write a synopsis given a title of a play.

const template = `You are a game designer. Given the title of the voxel game world, it is your job to write a detailed description of that game world.

Title: {title}
Game Designer: This is a description of the above voxel game world:`;

const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});

const descriptionChain = new LLMChain({ llm, prompt: promptTemplate });
const descriptionText = await descriptionChain.call({ title: "Post-apocalyptic Earth with mostly barren landscape" });

console.log(descriptionText);

const blocklistLLM = new OpenAI({ openAIApiKey: "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", maxTokens:-1});

const blockListTemplate = `You are a voxel game block designer. Given the description of the voxel game world, it is your job to generate a complete list of geological based building blocks (like stone, lava, granit, etc) for that game world. Each block is an basic element of this world, based on geological proceses, just consider that it is a Minecraft like game. No complex structures.

Voxel Game World Description:
{description}
Please format the response using a simple list of comma separated building blocks, like this: grass, stone, dirt

Building blocks for the above voxel game world by a voxel game block designer:`;

const blockListPromptTemplate = new PromptTemplate({
  template: blockListTemplate,
  inputVariables: ["description"],
});

const blockListChain = new LLMChain({
  llm: blocklistLLM,
  prompt: blockListPromptTemplate,
});
const BlockListResult = await blockListChain.call({description: descriptionText.text});
console.log(BlockListResult);

// Now that we have the building blocks, we generate the materials.
const materialsLLM = new OpenAI({ openAIApiKey: "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",maxTokens:-1,modelName: "gpt-4"});
    
const materialsTemplate = `You are a voxel game material designer. Given the list of building blocks, it is your job to generate a list of materials for each block from the list.

The complete List of Building Blocks:
{buildingblocks}
Please format the response using the following template for the materials.
This JSON format represents a complete list of materials for the previous blocks, each expressed as a dictionary with five keys:

name (string): This field represents the common name of the material.
id (string): This field acts as a unique identifier for the material in the game.
opaque (boolean): This field indicates if the material is opaque (true) or not (false).
color (array of 3 numbers): This field represents the color of the material, described as RGB values, where each value is a decimal between 0 and 1.
texture (string): This field is a 10 words description of the appearance and feel of the material's surface.
Materials for the above building blocks by a voxel game material designer:`;

const materialsPromptTemplate = new PromptTemplate({
  template: materialsTemplate,
  inputVariables: ["buildingblocks"],
});

console.log(materialsPromptTemplate);
const materialsChain = new LLMChain({
  llm: materialsLLM,
  prompt: materialsPromptTemplate,
});
const MaterialsResult = await materialsChain.call({buildingblocks: BlockListResult.text});
console.log(MaterialsResult);
// An LLMChain to generate a list of building blocks (materials like grass, stone, etc.) based on the game world description.
const blocksLLM = new OpenAI({ openAIApiKey: "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", maxTokens:-1,modelName: "gpt-4"});

const blocksTemplate = PromptTemplate.fromTemplate(`You are a voxel game block designer. Given the description of the voxel game world, it is your job to generate a JSON with the blocks (like grass, stone, etc.) using the material list for that game world.

Voxel Game World Description:
{description}
Game Block List for the above voxel game world by a voxel game block designer:
{blocklist}
Material list for the above blocks:
{materialist}
Please format the response using the following template for the building blocks,This JSON format defines blocks for a voxel-based game:
name: Block's name, like Bedrock.
id: Unique identifier for the block.
min_height & max_height: The vertical range where the block can occur in the range -Infinity to 0, based on geological and worldbuilding logic.
materials: Array containing the material ids for each side of the block like materials:["log_side","log_side","log_top","log_top","log_side","log_side"], the materials need to be from the material list from above.
probability: The chance for this block to naturally appear within its height range in the range 0 to 1.
properties: Further attributes of the block, including:
solid: Indicates if the block is solid.
opaque: Indicates if the block is see-through.
shining: Describes how much light the block emits.
fluid: Shows if the block is fluid-like.
durability: Describes the block's resistance to damage in a 0-100 range.

Building blocks for the above voxel game world by a voxel game block designer:`);




/*const blocksPromptTemplate = new PromptTemplate({
  template: formattedPrompt,
  
});*/

const blocksChain = new LLMChain({
  llm: blocksLLM,
  prompt: blocksTemplate ,
});
const blocksresult = await blocksChain .call({description : descriptionText.text, blocklist: BlockListResult.text, materialist: MaterialsResult.text });
console.log(blocksresult.text);





/*const res1 = await chain.call({ 
  input:formattedPrompt});
  console.log(res1);
      /*const res1 = await chain.call({ 
        input: "Generate please two JavaScript arrays of unique materials and blocks for a voxel-based game world. Start with the 'materials' array, which should include 11 unique materials. Each material object in the array will have the following properties:'name': This is a string that represents the common name of the material.'id': This is a string that serves as a unique identifier for the material. Typically, it matches the material's name. 'opaque': This is a boolean that indicates whether the material is opaque or not. 'color': This is an array of three numerical values between 0 and 1. They represent the Red, Green, and Blue color values of the material.\n'texture': This string describes the material's texture in a visually detailed manner.\nHere is a template for a 'materials' array:\n\n[\n  {\n    \"name\": \"<material_name>\",\n    \"id\": \"<material_id>\",\n    \"opaque\": <true_or_false>,\n    \"color\": [\"<red_value_0_to_1>\", \"<green_value_0_to_1>\", \"<blue_value_0_to_1>\"],\n    \"texture\": \"<detailed_texture_description>\"\n  },\n  // add more material objects as needed\n]\nNext, create the 'blocks' array, which should include various blocks of these materials. Each block object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the block.\n'id': This is a string that serves as a unique identifier for the block. Typically, it matches the block's name.\n'min_height' and 'max_height': These are numerical values that represent the minimum and maximum depths at which the block can be found in the game world. The values range from -64 (deepest) to 0 (surface). You should assign these values based on real geological layers.\n'materials': This is an array of material identifiers which represents the different sides of the block. The order is: front, back, top, bottom, left, right.\n'probability': This is a numerical value between 0 and 1 that represents the chance of finding the block within its height range in the world.\n'properties': This is an object that includes the block's characteristics, such as if it's solid, its opacity, shine, if it's a fluid, and its durability.\nHere is a template for a 'blocks' array:\n\n[\n  {\n    \"name\": \"<block_name>\",\n    \"id\": \"<block_id>\",\n    \"min_height\": \"<min_height>\",\n    \"max_height\": \"<max_height>\",\n    \"materials\": [\"<material_id_front>\", \"<material_id_back>\", \"<material_id_top>\", \"<material_id_bottom>\", \"<material_id_left>\", \"<material_id_right>\"],\n    \"probability\": \"<probability_value>\",\n    \"properties\": { \n      \"solid\": <true_or_false>, \n      \"opaque\": <true_or_false>, \n      \"shining\": \"<shining_value_0_to_1>\", \n      \"fluid\": <true_or_false>, \n      \"durability\": \"<durability_value_1_to_100>\" \n    }\n  },\n  // add more block objects as needed\n]\nFill in these templates with appropriate values for each of these properties. Ensure that you follow a logical order for the geological layers and provide a range of different materials and blocks to create a rich and diverse game world.\n Do not add anything." });
      console.log(res1);
      const template = "What is a good name for a company that makes {product}?";
      const promptA = new PromptTemplate({ template, inputVariables: ["product"] });
    
      // We can use the `format` method to format the template with the given input values.
      const responseA = await promptA.format({ product: "colorful socks" });
      console.log({ responseA });
      const promptB = PromptTemplate.fromTemplate(
        "What is a good name for a company that makes {product}?"
      );
      const responseB = await promptB.format({ product: "colorful socks" });
      console.log({ responseB });*/
     
  
      }
     
