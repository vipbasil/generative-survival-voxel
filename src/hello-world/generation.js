/*
 *
 *      Registering voxel types
 * 
 *  Two step process. First you register a material, specifying the 
 *  color/texture/etc. of a given block face, then you register a 
 *  block, which specifies the materials for a given block type.
 * 
*/
const OPENAI_API_KEY = "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"
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import{createGrass} from './flora'
import {response} from './lllm_generation'
const axios = require('axios');
const prompt = "Your task is to generate two JavaScript arrays of unique materials and blocks for a voxel-based game world.\n\nStart with the 'materials' array, which should include 11 unique materials. Each material object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the material.\n'id': This is a string that serves as a unique identifier for the material. Typically, it matches the material's name.\n'opaque': This is a boolean that indicates whether the material is opaque or not.\n'color': This is an array of three numerical values between 0 and 1. They represent the Red, Green, and Blue color values of the material.\n'texture': This string describes the material's texture in a visually detailed manner.\nHere is a template for a 'materials' array:\n\n[\n  {\n    \"name\": \"<material_name>\",\n    \"id\": \"<material_id>\",\n    \"opaque\": <true_or_false>,\n    \"color\": [\"<red_value_0_to_1>\", \"<green_value_0_to_1>\", \"<blue_value_0_to_1>\"],\n    \"texture\": \"<detailed_texture_description>\"\n  },\n  // add more material objects as needed\n]\nNext, create the 'blocks' array, which should include various blocks of these materials. Each block object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the block.\n'id': This is a string that serves as a unique identifier for the block. Typically, it matches the block's name.\n'min_height' and 'max_height': These are numerical values that represent the minimum and maximum depths at which the block can be found in the game world. The values range from -64 (deepest) to 0 (surface). You should assign these values based on real geological layers.\n'materials': This is an array of material identifiers which represents the different sides of the block. The order is: front, back, top, bottom, left, right.\n'probability': This is a numerical value between 0 and 1 that represents the chance of finding the block within its height range in the world.\n'properties': This is an object that includes the block's characteristics, such as if it's solid, its opacity, shine, if it's a fluid, and its durability.\nHere is a template for a 'blocks' array:\n\n[\n  {\n    \"name\": \"<block_name>\",\n    \"id\": \"<block_id>\",\n    \"min_height\": \"<min_height>\",\n    \"max_height\": \"<max_height>\",\n    \"materials\": [\"<material_id_front>\", \"<material_id_back>\", \"<material_id_top>\", \"<material_id_bottom>\", \"<material_id_left>\", \"<material_id_right>\"],\n    \"probability\": \"<probability_value>\",\n    \"properties\": { \n      \"solid\": <true_or_false>, \n      \"opaque\": <true_or_false>, \n      \"shining\": \"<shining_value_0_to_1>\", \n      \"fluid\": <true_or_false>, \n      \"durability\": \"<durability_value_1_to_100>\" \n    }\n  },\n  // add more block objects as needed\n]\nFill in these templates with appropriate values for each of these properties. Ensure that you follow a logical order for the geological layers and provide a range of different materials and blocks to create a rich and diverse game world.\n";

// block materials (just colors for this demo)
var textureURL = null;
// Material colors

console.log(response);


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

    export function create_material_list( ){

      const client = axios.create({
        headers: {
          Authorization: "Bearer " + OPENAI_API_KEY
        },
      });
      const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
      const headers= {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
       
      };
      const payload = {
        prompt: "Your task is to generate two JavaScript arrays of unique materials and blocks for a voxel-based game world.\n\nStart with the 'materials' array, which should include 11 unique materials. Each material object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the material.\n'id': This is a string that serves as a unique identifier for the material. Typically, it matches the material's name.\n'opaque': This is a boolean that indicates whether the material is opaque or not.\n'color': This is an array of three numerical values between 0 and 1. They represent the Red, Green, and Blue color values of the material.\n'texture': This string describes the material's texture in a visually detailed manner.\nHere is a template for a 'materials' array:\n\n[\n  {\n    \"name\": \"<material_name>\",\n    \"id\": \"<material_id>\",\n    \"opaque\": <true_or_false>,\n    \"color\": [\"<red_value_0_to_1>\", \"<green_value_0_to_1>\", \"<blue_value_0_to_1>\"],\n    \"texture\": \"<detailed_texture_description>\"\n  },\n  // add more material objects as needed\n]\nNext, create the 'blocks' array, which should include various blocks of these materials. Each block object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the block.\n'id': This is a string that serves as a unique identifier for the block. Typically, it matches the block's name.\n'min_height' and 'max_height': These are numerical values that represent the minimum and maximum depths at which the block can be found in the game world. The values range from -64 (deepest) to 0 (surface). You should assign these values based on real geological layers.\n'materials': This is an array of material identifiers which represents the different sides of the block. The order is: front, back, top, bottom, left, right.\n'probability': This is a numerical value between 0 and 1 that represents the chance of finding the block within its height range in the world.\n'properties': This is an object that includes the block's characteristics, such as if it's solid, its opacity, shine, if it's a fluid, and its durability.\nHere is a template for a 'blocks' array:\n\n[\n  {\n    \"name\": \"<block_name>\",\n    \"id\": \"<block_id>\",\n    \"min_height\": \"<min_height>\",\n    \"max_height\": \"<max_height>\",\n    \"materials\": [\"<material_id_front>\", \"<material_id_back>\", \"<material_id_top>\", \"<material_id_bottom>\", \"<material_id_left>\", \"<material_id_right>\"],\n    \"probability\": \"<probability_value>\",\n    \"properties\": { \n      \"solid\": <true_or_false>, \n      \"opaque\": <true_or_false>, \n      \"shining\": \"<shining_value_0_to_1>\", \n      \"fluid\": <true_or_false>, \n      \"durability\": \"<durability_value_1_to_100>\" \n    }\n  },\n  // add more block objects as needed\n]\nFill in these templates with appropriate values for each of these properties. Ensure that you follow a logical order for the geological layers and provide a range of different materials and blocks to create a rich and diverse game world.\n",
        temperature: 0.7,
        max_tokens:100, //3104,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
        
      }
          //payload.prompt = prompt; 
          console.log(payload);
  
        client.post(url, payload)
        .then(response => {
         console.log(response);
        })
        .catch(error => {
          console.error(error.message);
        });
  
      }
     