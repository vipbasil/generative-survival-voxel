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
  { name: "Bedrock", min_height: -Infinity, max_height: -50,  materialIds:"bedrock", probability: 1, properties: { transparency: 0, shining: 0, liquid: 0, durability: 100, color: [50, 50, 50], texture: "Dark gray, rough and jagged surface" } },
  { name: "Stone", min_height: -50, max_height: -10,materialIds:"stone", probability: 0.8, properties: { transparency: 0, shining: 0, liquid: 0, durability: 50, color: [120, 120, 120], texture: "Smooth gray surface with occasional darker flecks" } },
  { name: "Coal Ore", min_height: -50, max_height: -10,  materialIds:"coalOre", probability: 0.15, properties: { transparency: 0, shining: 0, liquid: 0, durability: 30, color: [80, 80, 80], texture: "Gray surface with black coal veins" } },
  { name: "Copper Ore", min_height: -50, max_height: -10,  materialIds:"copperOre", probability: 0.05, properties: { transparency: 0, shining: 0.2, liquid: 0, durability: 35, color: [184, 115, 51], texture: "Gray surface with small orange-brown copper specks" } },
  { name: "Stone", min_height: -10, max_height: -3,  materialIds:"stone", probability: 0.85, properties: { transparency: 0, shining: 0, liquid: 0, durability: 50, color: [120, 120, 120], texture: "Smooth gray surface with occasional darker flecks" } },
  { name: "Iron Ore", min_height: -10, max_height: -3,  materialIds:"ironOre", probability: 0.1, properties: { transparency: 0, shining: 0.4, liquid: 0, durability: 45, color: [191, 191, 191], texture: "Gray surface with light gray iron veins" } },
  { name: "Gold Ore", min_height: -10, max_height: -3,  materialIds:"goldOre", probability: 0.05, properties: { transparency: 0, shining: 0.8, liquid: 0, durability: 25, color: [255, 215, 0], texture: "Gray surface with shiny gold veins" } },
  { name: "Dirt", min_height: -3, max_height: 0, materialIds:"dirt", probability: 0.7, properties: { transparency: 0, shining: 0, liquid: 0, durability: 10, color: [139, 69, 19], texture: "Brown, compacted soil with small pebbles" } },
  { name: "Clay", min_height: -3, max_height: 0,  materialIds:"clay", probability: 0.25, properties: { transparency: 0, shining: 0, liquid: 0, durability: 20, color: [210, 180, 140], texture: "Smooth, light brown surface with a slightly sticky feel" } },
  { name: "Peat", min_height: -3, max_height: 0,  materialIds:"peat", probability: 0.05, properties: { transparency: 0, shining: 0, liquid: 0, durability: 15, color: [105, 84, 50], texture: "Dark brown, fibrous organic material with dampness" } },
  { name: "Grass", min_height: 1, max_height: 5,  materialIds:"grass", probability: 0.9, properties: { transparency: 0, shining: 0, liquid: 0, durability: 5, color: [50, 205, 50], texture: "Green grass blades covering a layer of soil" } },
  { name: "Sand", min_height: 1, max_height: 5, materialIds:"sand", probability: 0.1, properties: { transparency: 0, shining: 0, liquid: 0, durability: 10, color: [255, 255, 224], texture: "Loose, fine light-colored grains" } },
  { name: "Water", min_height: -50, max_height: 5, materialIds:"water", probability: 0.02, properties: { transparency: 0.9, shining: 0.2, liquid: 1, durability: 0, color: [0, 0, 255], texture: "Transparent, flowing liquid with a reflective surface" } },
  { name: "Gravel", min_height: -50, max_height: 5,  materialIds:"gravel", probability: 0.02, properties: { transparency: 0, shining: 0, liquid: 0, durability: 15, color: [112, 128, 144], texture: "Small, gray rounded rocks of various sizes" } },
  { name: "Lava", min_height: -50, max_height: 5,  materialIds:"lava", probability: 0.005, properties: { transparency: 0.6, shining: 0.8, liquid: 1, durability: 0, color: [255, 69, 0], texture: "Fiery red-orange molten rock with visible heat waves" } }
];

for (var i in materials) {
    create_material(materials[i].materialIds,materials[i].properties.texture, noa); 
    console.log(materials[i].properties.color);
    noa.registry.registerMaterial(materials[i].materialIds, materials[i].properties.color, null);
    materials[i].material = noa.registry.registerBlock(1+i, { material: materials[i].materialIds });
    //console.log(i+":"+materials[i].material);
    materialIds[materials[i].materialIds]= materials[i].material;
  }
}
  function create_material(prompt, texture, noa ){
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
        payload.prompt = prompt+", "+texture;
        //console.log(prompt);

      axios.post(url, payload, { headers })
      .then(response => {
        const images = response.data.images;
        
        images.forEach(
          (imgStr) => {
          const imgData = imgStr;
          const imgBuffer = Buffer.from(imgData, 'base64');

          var scene = noa.rendering.getScene()


        var tmat = noa.rendering.makeStandardMaterial('')
        tmat.diffuseTexture = new Texture("data:image/png;base64,"+imgStr, scene)
        tmat.bumpTexture  = tmat.diffuseTexture;
        noa.registry.registerMaterial(prompt, null, null, false, tmat)
     
    }
    );
      })
      .catch(error => {
        console.error(error.message);
      });

    }