

// Engine options object, and engine instantiation:
import { Engine } from 'noa-engine'


//import from "@babylonjs/controls/resizer"; //var base64Img = require('base64-img');
//import {util} from "util"
import {init_texture, materials} from './texture_generation'
import {initWorldGen} from './world'
import {initPlayerMesh} from './player'
//explain      
var opts = {
    debug: true,
    showFPS: true,
    chunkSize: 32,
    chunkAddDistance: 2.5,
    chunkRemoveDistance: 3.5,
    texturePath: 'textures/',
    gravity: [0, -10, 0],
    airDrag: 0.1,
    fluidDrag: 0.4,
    fluidDensity: 2.0,
    minBounceImpulse: .5
  
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
initWorldGen(noa, materials);




/*
 * 
 *      Create a mesh to represent the player:
 * 
*/
 
// get the player entity's ID and other info (position, size, ..)
initPlayerMesh(noa);


