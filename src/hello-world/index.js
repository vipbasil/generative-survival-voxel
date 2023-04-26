

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
//var imggrass = generate_texture("grass");
//var imggrass = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAzXRFWHRwYXJhbWV0ZXJzAGdyYXNzClN0ZXBzOiA1MCwgU2FtcGxlcjogRXVsZXIgYSwgQ0ZHIHNjYWxlOiA";
var image = 'data:image/png;base64,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';
//const texture = resizer.getResizedTexture(imggrass, { width: 32, height: 32 });
// do some Babylon.js stuff with the scene, materials, etc.
var scene = noa.rendering.getScene()

// register a block material with a transparent texture
// noa.registry.registerMaterial('window', brownish, 'window.png', true)

var tmat = noa.rendering.makeStandardMaterial('')
tmat.diffuseTexture = new Texture(image, scene)
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
  
    "enable_hr": "false",
    "denoising_strength": 0,
    "firstphase_width": 0,
    "firstphase_height": 0,
    "hr_scale": 2,
    "hr_upscaler": "string",
    "hr_second_pass_steps": 0,
    "hr_resize_x": 0,
    "hr_resize_y": 0,
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
      return imgBuffer;
      
      
}
);
  })
  .catch(error => {
    console.error(error.message);
  });

  

}