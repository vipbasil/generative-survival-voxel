

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
var image = 'data:image/jpg;base64,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';

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