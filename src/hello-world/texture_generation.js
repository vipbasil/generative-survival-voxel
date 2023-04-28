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

/*var shinyMat = noa.rendering.makeStandardMaterial('dirt');
    shinyMat.specularColor.copyFromFloats(1, 1, 1);
    shinyMat.specularPower = 32;
    shinyMat.bumpTexture = new Texture('textures/stone.png', scene);
    noa.registry.registerMaterial('dirt', brownish, null, false, shinyMat);
*/
// Register materials
var imggrass = generate_texture("grass");
//var imggrass = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAzXRFWHRwYXJhbWV0ZXJzAGdyYXNzClN0ZXBzOiA1MCwgU2FtcGxlcjogRXVsZXIgYSwgQ0ZHIHNjYWxlOiA";
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
  