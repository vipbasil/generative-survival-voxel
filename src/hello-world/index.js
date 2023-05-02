

// Engine options object, and engine instantiation:
import { Engine } from 'noa-engine'
import {blocks, init_texture} from './generation'
import {initWorldGen} from './world'
import {initPlayerMesh} from './player'
import {generateTree,create_voxel,parseLSystem} from './flora'
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


initWorldGen(noa, blocks);


initPlayerMesh(noa);

var tree = generateTree(3);
  console.log(tree);
  tree = generateTree(3);
  console.log(tree);
  setTimeout(function () {
    parseLSystem(tree.lSystem, 25, 1, create_voxel, noa);
}, 1000)
 
