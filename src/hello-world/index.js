

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

//import from "@babylonjs/controls/resizer"; //var base64Img = require('base64-img');
//import {util} from "util"
import {init_texture} from './texture_generation'


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

init_texture(noa);


     
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



