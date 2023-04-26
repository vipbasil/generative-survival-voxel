

/* 
 * 
 *          noa hello-world example
 * 
 *  This is a bare-minimum example world, intended to be a 
 *  starting point for hacking on noa game world content.
 * 
*/


// Engine options object, and engine instantiation:
import { Engine } from 'noa-engine'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'

////import { Resizer } from "@babylonjs/controls/resizer"; //var base64Img = require('base64-img');
//import {util} from "util"
//import {generate_texture} from './texture_generation.js'
const axios = require('axios');

var opts = {
    debug: true,
    showFPS: true,
    chunkSize: 32,
    chunkAddDistance: 2.5,
    chunkRemoveDistance: 3.5,
    texturePath: 'textures/'
  
}
var noa = new Engine(opts)
//const resizer = new Resizer();


/*
 *
 *      Registering voxel types
 * 
 *  Two step process. First you register a material, specifying the 
 *  color/texture/etc. of a given block face, then you register a 
 *  block, which specifies the materials for a given block type.
 * 
*/

// block materials (just colors for this demo)
var textureURL = null;//null "./textures/dirt.png" // replace that with a filename to specify textures
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

/*var shinyMat = noa.rendering.makeStandardMaterial('dirt');
    shinyMat.specularColor.copyFromFloats(1, 1, 1);
    shinyMat.specularPower = 32;
    shinyMat.bumpTexture = new Texture('textures/stone.png', scene);
    noa.registry.registerMaterial('dirt', brownish, null, false, shinyMat);
*/
// Register materials
var imggrass = generate_texture("grass");
//var imggrass = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAzXRFWHRwYXJhbWV0ZXJzAGdyYXNzClN0ZXBzOiA1MCwgU2FtcGxlcjogRXVsZXIgYSwgQ0ZHIHNjYWxlOiA";
//var image = 'data:image/png;base64,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';
//const texture = resizer.getResizedTexture(imggrass, { width: 32, height: 32 });
// do some Babylon.js stuff with the scene, materials, etc.
var scene = noa.rendering.getScene()

// register a block material with a transparent texture
// noa.registry.registerMaterial('window', brownish, 'window.png', true)

var tmat = noa.rendering.makeStandardMaterial('')
tmat.diffuseTexture = new Texture(imggrass, scene)
tmat.opacityTexture = tmat.diffuseTexture;
//
noa.registry.registerMaterial('grass', null, null, false, tmat)

noa.registry.registerMaterial("bedrock", bedrockColor, null);
noa.registry.registerMaterial("stone", stoneColor, textureURL);
noa.registry.registerMaterial("dirt", dirtColor, textureURL);
//noa.registry.registerMaterial("grass", grassColor, "grass5.png");
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

const materials = [
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
  

     
/*
 * 
 *      World generation
 * 
 *  The world is divided into chunks, and `noa` will emit an 
 *  `worldDataNeeded` event for each chunk of data it needs.
 *  The game client should catch this, and call 
 *  `noa.world.setChunkData` whenever the world data is ready.
 *  (The latter can be done asynchronously.)
 * 
*/
const { createNoise3D } = require('simplex-noise');
    const noise3D = createNoise3D();

function getMaterialByHeight(y) {
        let availableMaterials = [];
      
        for (const material of materials) {
          if (y >= material.min_height && y <= material.max_height) {
            availableMaterials.push(material);
          }
        }
      
        if (availableMaterials.length === 0) {
          return 0; // empty space
        }
      
        let totalProbability = availableMaterials.reduce((sum, material) => sum + material.probability, 0);
        let randomValue = Math.random() * totalProbability;
      
        for (const material of availableMaterials) {
          if (randomValue < material.probability) {
            return material.material;
          }
          randomValue -= material.probability;
        }
      
        return 0; // empty space
      }
      

      function getVoxelID(x, y, z) {
       // var noise = new Noise(seed); // Initialize Perlin Noise with a seed value
        var frequency = 0.1; // Adjust frequency for terrain smoothness
        var heightScale = 20; // Scale the height values of the terrain
        var heightOffset = 5; // Shift the terrain up or down
      
        var height = heightScale * noise3D(x * frequency,y * frequency,z * frequency) + heightOffset;
      
        if (y < height) {
          return getMaterialByHeight(y);
        } else {
          return 0; // empty space
        }
      }
      
/*// simple height map worldgen function
function getVoxelID(x, y, z) {
    //var height = 2 * Math.sin(x / 10) + 3 * Math.cos(z / 20);
    
    //console.log(noise3D(1,2,1));
    var rez = 0;
    if (y <  8) 
     rez = ((1 + noise3D(x,y,z))/2*10).toFixed(0);
    //else rez = 0;
    return rez; 
   
  } */
  
  
// register for world events
noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
    // `id` - a unique string id for the chunk
    // `data` - an `ndarray` of voxel ID data (see: https://github.com/scijs/ndarray)
    // `x, y, z` - world coords of the corner of the chunk
    for (var i = 0; i < data.shape[0]; i++) {
        for (var j = 0; j < data.shape[1]; j++) {
            for (var k = 0; k < data.shape[2]; k++) {
                var voxelID = getVoxelID(x + i, y + j, z + k)
                data.set(i, j, k, voxelID)
            }
        }
    }
    // tell noa the chunk's terrain data is now set
    noa.world.setChunkData(id, data)
})




/*
 * 
 *      Create a mesh to represent the player:
 * 
*/
 
// get the player entity's ID and other info (position, size, ..)
var player = noa.playerEntity
var dat = noa.entities.getPositionData(player)
var w = dat.width
var h = dat.height

// add a mesh to represent the player, and scale it, etc.
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import '@babylonjs/core/Meshes/Builders/boxBuilder'

var scene = noa.rendering.getScene()
var mesh = Mesh.CreateBox('player-mesh', 1, scene)
mesh.scaling.x = w
mesh.scaling.z = w
mesh.scaling.y = h


// add "mesh" component to the player entity
// this causes the mesh to move around in sync with the player entity
noa.entities.addComponent(player, noa.entities.names.mesh, {
    mesh: mesh,
    // offset vector is needed because noa positions are always the 
    // bottom-center of the entity, and Babylon's CreateBox gives a 
    // mesh registered at the center of the box
    offset: [0, h / 2, 0],
})
 


/*
 * 
 *      Minimal interactivity 
 * 
*/

// clear targeted block on on left click
noa.inputs.down.on('fire', function () {
    if (noa.targetedBlock) {
        var pos = noa.targetedBlock.position
        noa.setBlock(0, pos[0], pos[1], pos[2])
    }
})

// place some grass on right click
noa.inputs.down.on('alt-fire', function () {
    if (noa.targetedBlock) {
        var pos = noa.targetedBlock.adjacent
        noa.setBlock(grassID, pos[0], pos[1], pos[2])
    }
})

// add a key binding for "E" to do the same as alt-fire
noa.inputs.bind('alt-fire', 'E')


// each tick, consume any scroll events and use them to zoom camera
noa.on('tick', function (dt) {
    var scroll = noa.inputs.state.scrolly
    if (scroll !== 0) {
        noa.camera.zoomDistance += (scroll > 0) ? 1 : -1
        if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0
        if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10
    }
})



function generate_texture(prompt){
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
      return imgStr;
      
      
      
}
);
  })
  .catch(error => {
    console.error(error.message);
  });

  

}