/*
 *
 *      Registering voxel types
 * 
 *  Two step process. First you register a material, specifying the 
 *  color/texture/etc. of a given block face, then you register a 
 *  block, which specifies the materials for a given block type.
 * 
*/
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import{createGrass} from './flora'
const axios = require('axios');
// block materials (just colors for this demo)
var textureURL = null;
// Material colors




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
  materials =
[
  {
    "name": "Dirt",
    "id": "Dirt",
    "opaque": true,
    "color": [0.51, 0.39, 0.24],
    "texture": "Granular, earthy, sandy"
  },
  {
    "name": "Grass",
    "id": "Grass",
    "opaque": true,
    "color": [0.25, 0.62, 0.30],
    "texture": "Coarse, spiky, lush"
  },
  {
    "name": "Stone",
    "id": "Stone",
    "opaque": true,
    "color": [0.55, 0.55, 0.55],
    "texture": "Smooth, solid, hard"
  },
  {
    "name": "Sand",
    "id": "Sand",
    "opaque": true,
    "color": [0.95, 0.87, 0.71],
    "texture": "Soft, grainy, loose"
  },
  {
    "name": "Coal",
    "id": "Coal",
    "opaque": true,
    "color": [0.16, 0.16, 0.16],
    "texture": "Hard, brittle, dark"
  },
  {
    "name": "Iron",
    "id": "Iron",
    "opaque": true,
    "color": [0.56, 0.56, 0.56],
    "texture": "Heavy, dense, metallic"
  },
  {
    "name": "Gold",
    "id": "Gold",
    "opaque": true,
    "color": [1.00, 0.84, 0.00],
    "texture": "Heavy, dense, metallic"
  },
  {
    "name": "Diamond",
    "id": "Diamond",
    "opaque": true,
    "color": [0.61, 0.76, 0.87],
    "texture": "Hard, shiny, crystalline"
  },
  {
    "name": "Lava",
    "id": "Lava",
    "opaque": false,
    "color": [1.00, 0.21, 0.03],
    "texture": "Glowing, bubbling, molten"
  },
  {
    "name": "Water",
    "id": "Water",
    "opaque": false,
    "color": [0.00, 0.39, 0.91],
    "texture": "Transparent, flowing, liquid"
  },
  {
    "name": "Snow",
    "id": "Snow",
    "opaque": true,
    "color": [1.00, 1.00, 1.00],
    "texture": "Light, powdery, fluffy"
  }
]

blocks =
[
  {
    "name": "Dirt Block",
    "id": 1,
    "min_height": -32,
    "max_height": -45,
    "materials": ["Dirt", "Dirt", "Dirt", "Dirt", "Dirt", "Dirt"],
    "probability": 1.0,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.0, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Grass Block",
    "id": 2,
    "min_height": -32,
    "max_height": 3,
    "materials": ["Dirt", "Dirt", "Grass", "Dirt", "Dirt", "Dirt"],
    "probability": 1.0,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.0, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Stone Block",
    "id": 3,
    "min_height": -64,
    "max_height": 3,
    "materials": ["Stone", "Stone", "Stone", "Stone", "Stone", "Stone"],
    "probability": 0.75,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.2, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Sand Block",
    "id": 4,
    "min_height": -48,
    "max_height": -32,
    "materials": ["Sand", "Sand", "Sand", "Sand", "Sand", "Sand"],
    "probability": 0.75,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.0, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Coal Block",
    "id": 5,
    "min_height": -64,
    "max_height": -48,
    "materials": ["Coal", "Coal", "Coal", "Coal", "Coal", "Coal"],
    "probability": 0.25,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.0, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Iron Block",
    "id": 6,
    "min_height": -48,
    "max_height": -32,
    "materials": ["Iron", "Iron", "Iron", "Iron", "Iron", "Iron"],
    "probability": 0.25,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.5, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Gold Block",
    "id": 7,
    "min_height": -64,
    "max_height": -48,
    "materials": ["Gold", "Gold", "Gold", "Gold", "Gold", "Gold"],
    "probability": 0.1,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.8, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Diamond Block",
    "id": 8,
    "min_height": -48,
    "max_height": -32,
    "materials": ["Diamond", "Diamond", "Diamond", "Diamond", "Diamond", "Diamond"],
    "probability": 0.1,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.9, 
      "fluid": false, 
      "durability": 100 
    }
  },
  {
    "name": "Lava Block",
    "id": 8,
    "min_height": -64,
    "max_height": -32,
    "materials": ["Lava", "Lava", "Lava", "Lava", "Lava", "Lava"],
    "probability": 0.1,
    "properties": { 
      "solid": false, 
      "opaque": false, 
      "shining": 0.0, 
      "fluid": true, 
      "durability": 10 
    }
  },
  {
    "name": "Water Block",
    "id": 9,
    "min_height": -32,
    "max_height": 0,
    "materials": ["Water", "Water", "Water", "Water", "Water", "Water"],
    "probability": 0.5,
    "properties": { 
      "solid": false, 
      "opaque": false, 
      "shining": 0.0, 
      "fluid": true, 
      "durability": 10 
    }
  },
  {
    "name": "Snow Block",
    "id": 10,
    "min_height": 0,
    "max_height": 3,
    "materials": ["Snow", "Snow", "Snow", "Snow", "Snow", "Snow"],
    "probability": 0.2,
    "properties": { 
      "solid": true, 
      "opaque": true, 
      "shining": 0.2, 
      "fluid": false, 
      "durability": 100 
    }
  }
]
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
        luid: block.properties.fluid,
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
    //const url = 'http://192.168.10.124:7860/sdapi/v1/txt2img';
    const url = 'http://93.113.114.107:7862/sdapi/v1/txt2img';
     const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const payload = {
      
        "enable_hr": "true",
        "denoising_strength": 0,
        "firstphase_width": 0,
        "firstphase_height": 0,
        "hr_scale": 2,
        "hr_upscaler": "Nearest",
        "hr_second_pass_steps": 0,
        "hr_resize_x": 32,
        "hr_resize_y": 32,
        "prompt": "grass",
        "seed": -1,
        "subseed": -1,
        "subseed_strength": 0,
        "seed_resize_from_h": -1,
        "seed_resize_from_w": -1,
        "sampler_name": "Euler a",
        "batch_size": 1,
        "n_iter": 1,
        "steps": 50,
        "cfg_scale": 7,
        "width": 512,
        "height": 512,
        "restore_faces": false,
        "tiling": true,
        "negative_prompt": "",
        "eta": 0,
        "s_churn": 0,
        "s_tmax": 0,
        "s_tmin": 0,
        "s_noise": 1,
        "override_settings": {},
        "override_settings_restore_afterwards": true,
        "sampler_index": "Euler"
      
      
    };
        payload.prompt = material.name+", "+material.texture;
        //console.log(prompt);

      axios.post(url, payload, { headers })
      .then(response => {
        const images = response.data.images;
        
        images.forEach(
          (imgStr) => {
          var scene = noa.rendering.getScene()

         console.log(material);   
        var tmat = noa.rendering.makeStandardMaterial('')
        tmat.diffuseTexture = new Texture("data:image/png;base64,"+imgStr, scene)
        if(material.opaque == false){
          tmat.opacityTexture = tmat.diffuseTexture;
          tmat.color = material.color;
        } else{
        tmat.bumpTexture  = tmat.diffuseTexture;}
        noa.registry.registerMaterial(material.id, null, null, false, tmat);
 
     
    }
    );
      })
      .catch(error => {
        console.error(error.message);
      });

    }