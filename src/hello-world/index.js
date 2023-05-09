

// Engine options object, and engine instantiation:
import { Engine } from 'noa-engine'
import {blocks, init_texture} from './generation'
import {initWorldGen} from './world'
import {initPlayerMesh} from './player'
import {generateLSystemString,create_voxel,parseLSystem, lSystemRules,createGrass} from './flora'
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

var generatedTreeString = generateLSystemString(lSystemRules, 4);
  //console.log(generatedTreeString);
  setTimeout(function () {
    parseLSystem([-15,5,0],generatedTreeString, create_voxel, noa);
    generatedTreeString = generateLSystemString(lSystemRules, 4);
    parseLSystem([15,5,0],generatedTreeString, create_voxel, noa);
    generatedTreeString = generateLSystemString(lSystemRules, 4);
    parseLSystem([0,5,15],generatedTreeString, create_voxel, noa);
    
 
create_voxel([7,7,7], 8, noa);
}, 1000)
 
// Generate grass clumps





