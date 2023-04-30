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
import { each } from 'utill';
const axios = require('axios');
// block materials (just colors for this demo)
var textureURL = null;
// Material colors




export var materials = [];
export var materialIds = [];
// Register materials

// do some Babylon.js stuff with the scene, materials, etc.
export function init_texture(noa) {

 
/*materials = [
  { min_height: -Infinity, max_height: -30, material: materialIds["bedrock"] , probability: 1 },
  { min_height: -30, max_height: -5, material: materialIds["stone"], probability: 0.9 },
  { min_height: -30, max_height: -5, material: materialIds["coalOre"], probability: 0.1 },
  { min_height: -5, max_height: -2, material: materialIds["stone"], probability: 0.9 },
  { min_height: -5, max_height: -2, material: materialIds["ironOre"], probability: 0.1 },
  { min_height: -2, max_height: -1, material: materialIds["dirt"], probability: 0.7 },
  { min_height: -2, max_height: -1, material: materialIds["clay"], probability: 0.3 },
  { min_height: 0, max_height: 3, material: materialIds["grass"], probability: 0.98 },
  //{ min_height: 0, max_height: 3, material: materialIds["sand"], probability: 0.2 },
  { min_height: -30, max_height: 3, material: materialIds["water"], probability: 0.01 },
  { min_height: -30, max_height: 3, material: materialIds["gravel"], probability: 0.01 }
]; */
materials = [
  { name: "Bedrock", min_height: -Infinity, max_height: -50, materialIds: "bedrock", probability: 1, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 100, color: [0.196, 0.196, 0.196], texture: "Dark gray, rough and jagged surface" } },
  { name: "Stone", min_height: -50, max_height: 0, materialIds: "stone", probability: 0.9, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 50, color: [0.471, 0.471, 0.471], texture: "Smooth gray surface with occasional darker flecks" } },
  { name: "Dirt", min_height: -5, max_height: 0, materialIds: "dirt", probability: 0.7, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 10, color: [0.545, 0.271, 0.075], texture: "Brown, compacted soil with small pebbles" } },
  { name: "Grass", min_height: 0, max_height: 5, materialIds: "grass", probability: 0.9, properties: { solid : true, opaque: true, shining: 0, fluid: false, durability: 5, color: [0.196, 0.804, 0.196], texture: "Green grass blades covering a layer of soil" } },
  { name: "Water", min_height: -50, max_height: 5, materialIds: "water", probability: 0.005, properties: { solid : false, opaque: false, shining: 0.2, fluid: true, durability: 0, color: [0, 0, 1], texture: "Transparent, flowing liquid with a reflective surface" } }
];
for (var i in materials) {
   
    
    noa.registry.registerMaterial(materials[i].materialIds, materials[i].properties.color, null);
    //materials[i].material = noa.registry.registerBlock(1.0+Number(i), { material: materials[i].materialIds, });
    
    materials[i].material = noa.registry.registerBlock( 
      1.0 + Number(i), { 
        solid : materials[i].properties.solid,
        material: materials[i].materialIds,
        opaque:  materials[i].properties.opaque,
        fluid: materials[i].properties.fluid,
        fluidDensity: 0.1 ,
        viscosity: 0.5 
      });
    materialIds[materials[i].materialIds]= materials[i].material;
    create_material(materials[i], noa); 
  }
}
  function create_material(material, noa ){
    const url = 'http://192.168.10.124:7860/sdapi/v1/txt2img';
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
        payload.prompt = material.name+", "+material.properties.texture;
        //console.log(prompt);

      axios.post(url, payload, { headers })
      .then(response => {
        const images = response.data.images;
        
        images.forEach(
          (imgStr) => {
          const imgData = imgStr;
          
          var scene = noa.rendering.getScene()


        var tmat = noa.rendering.makeStandardMaterial('')
        tmat.diffuseTexture = new Texture("data:image/png;base64,"+imgStr, scene)
        if(material.properties.opaque == false){
          tmat.opacityTexture = tmat.diffuseTexture;
          tmat.color = material.color;
        } else{
        tmat.bumpTexture  = tmat.diffuseTexture;}
        noa.registry.registerMaterial(material.materialIds, null, null, false, tmat);
 
     
    }
    );
      })
      .catch(error => {
        console.error(error.message);
      });

    }