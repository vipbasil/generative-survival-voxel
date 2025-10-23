

// Engine options object, and engine instantiation:
import { Engine } from 'noa-engine'
import {blocks, init_texture, prepareWorldContent} from './generation'
import {initWorldGen} from './world'
import {initPlayerMesh} from './player'
import { initHud } from './hud'
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
await prepareWorldContent();

var noa = new Engine(opts)

initHud();

await init_texture(noa);

initWorldGen(noa, blocks);

initPlayerMesh(noa);

noa.entities.setPosition(noa.playerEntity, [0, 24, 0]);

