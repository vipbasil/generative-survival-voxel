export function initWorldGen(noa, blocks) {

    const { createNoise3D } = require('simplex-noise');
    const noise3D = createNoise3D();
    
    function getVoxelID( x, y, z) {
        // var noise = new Noise(seed); // Initialize Perlin Noise with a seed value
         var frequency = 0.005; // Adjust frequency for terrain smoothness
         var heightScale = 4; // Scale the height values of the terrain
         var heightOffset = 10; // Shift the terrain up or down
       
         //var height = heightScale * noise3D(x * frequency,y * frequency,z * frequency) + heightOffset;
         var height =  heightScale * noise3D(x * frequency,y * frequency,z * frequency) + heightOffset;
       
         if (y < height) {
           return getBlockByHeight(y);
         } else {
           return 0; // empty space
         }
       }

       function getBlockByHeight(y) {
        let availableBlocks = [];
       //console.log(blocks)
        for (const block of blocks) {
         
            if (y >= block.min_height && y <= block.max_height) {
            availableBlocks.push(block);
          }
        }
      
        if (availableBlocks.length === 0) {
          return 0; // empty space
        }
      
        let totalProbability = availableBlocks.reduce((sum, block) => sum + block.probability, 0);
        let randomValue = Math.random() * totalProbability;
      
        for (const block of availableBlocks) {
          if (randomValue < block.probability) {
            //console.log(block.id )
            return block.id ;
          }
          randomValue -= block.probability;
        }
      
        return 0; // empty space
      }

      

  
// register for world events
noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
    // `id` - a unique string id for the chunk
    // `data` - an `ndarray` of voxel ID data (see: https://github.com/scijs/ndarray)
    // `x, y, z` - world coords of the corner of the chunk
    for (var i = 0; i < data.shape[0]; i++) {
        for (var j = 0; j < data.shape[1]; j++) {
            for (var k = 0; k < data.shape[2]; k++) {
                var voxelID = getVoxelID( x + i, y + j, z + k)
                data.set(i, j, k, voxelID)
            }
        }
    }
    // tell noa the chunk's terrain data is now set
    noa.world.setChunkData(id, data)
})
}


