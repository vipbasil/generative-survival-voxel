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


var bedrockColor = [0.2, 0.2, 0.2];
var stoneColor = [0.5, 0.5, 0.5];
var dirtColor = [0.45, 0.36, 0.22];
var grassColor = [0.1, 0.8, 0.2];
var sandColor = [0.9, 0.8, 0.6];
var waterColor = [0.1, 0.5, 0.8];
var clayColor = [0.7, 0.4, 0.3];
var gravelColor = [0.6, 0.6, 0.6];
var coalOreColor = [0.3, 0.3, 0.3];
var ironOreColor = [0.6, 0.3, 0.1];

export var materials = [];

// Register materials

//var imggrass = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAzXRFWHRwYXJhbWV0ZXJzAGdyYXNzClN0ZXBzOiA1MCwgU2FtcGxlcjogRXVsZXIgYSwgQ0ZHIHNjYWxlOiA";
// do some Babylon.js stuff with the scene, materials, etc.
export function init_texture(noa) {

  generate_texture("grass", noa);
noa.registry.registerMaterial("bedrock", bedrockColor, null);
noa.registry.registerMaterial("stone", stoneColor, textureURL);
noa.registry.registerMaterial("dirt", dirtColor, textureURL);
noa.registry.registerMaterial("grass", grassColor, null);
noa.registry.registerMaterial("sand", sandColor, textureURL);
noa.registry.registerMaterial("water", waterColor, null);
noa.registry.registerMaterial("clay", clayColor, textureURL);
noa.registry.registerMaterial("gravel", gravelColor, null);
noa.registry.registerMaterial("coalOre", coalOreColor, textureURL);
noa.registry.registerMaterial("ironOre", ironOreColor, textureURL);

// Block types and their material names
var bedrockID = noa.registry.registerBlock(1, { material: "bedrock" });
var stoneID = noa.registry.registerBlock(2, { material: "stone" });
var dirtID = noa.registry.registerBlock(3, { material: "dirt" });
var grassID = noa.registry.registerBlock(4, { material: "grass" });
var sandID = noa.registry.registerBlock(5, { material: "sand" });
var waterID = noa.registry.registerBlock(6, { material: "water" });
var clayID = noa.registry.registerBlock(7, { material: "clay" });
var gravelID = noa.registry.registerBlock(8, { material: "gravel" });
var coalOreID = noa.registry.registerBlock(9, { material: "coalOre" });
var ironOreID = noa.registry.registerBlock(10, { material: "ironOre" });
materials = [
  { min_height: -Infinity, max_height: -30, material: bedrockID, probability: 1 },
  { min_height: -30, max_height: -5, material: stoneID, probability: 0.9 },
  { min_height: -30, max_height: -5, material: coalOreID, probability: 0.1 },
  { min_height: -5, max_height: -2, material: stoneID, probability: 0.9 },
  { min_height: -5, max_height: -2, material: ironOreID, probability: 0.1 },
  { min_height: -2, max_height: 0, material: dirtID, probability: 1 },
  { min_height: -2, max_height: 0, material: clayID, probability: 1 },
  { min_height: 0, max_height: 1, material: grassID, probability: 1 },
  /*{ min_height: 0, max_height: 3, material: sandID, probability: 0.4 },
  { min_height: 3, max_height: 6, material: waterID, probability: 1 },
  { min_height: 6, max_height: 12, material: gravelID, probability: 1 },*/
];

}
  function generate_texture(prompt, noa ){
    const url = 'http://192.168.10.124:7860/sdapi/v1/txt2img';
    console.log(url);
    //https://cb42ea6f-6dc9-4409.gradio.live/sdapi/v1/txt2img http://192.168.10.124:7860/sdapi/v1/txt2img
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
        payload.prompt = prompt;
        console.log(prompt);
    
    
    
      axios.post(url, payload, { headers })
      .then(response => {
        const images = response.data.images;
        
        images.forEach(
          (imgStr) => {
           
          //const imgData = imgStr.split(",")[0];
          const imgData = imgStr;
          const imgBuffer = Buffer.from(imgData, 'base64');
          console.log(imgData);
          var scene = noa.rendering.getScene()


        var tmat = noa.rendering.makeStandardMaterial('')
        tmat.diffuseTexture = new Texture("data:image/png;base64,"+imgStr, scene)
        tmat.opacityTexture = tmat.diffuseTexture;

        noa.registry.registerMaterial('grass', null, null, false, tmat)
          return imgStr;
          
          
          
    }
    );
      })
      .catch(error => {
        console.error(error.message);
      });
    
      
    
    }