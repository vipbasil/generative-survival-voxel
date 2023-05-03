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