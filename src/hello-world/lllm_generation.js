const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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"


export const response = null;
const prompt = "Your task is to generate two JavaScript arrays of unique materials and blocks for a voxel-based game world.\n\nStart with the 'materials' array, which should include 11 unique materials. Each material object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the material.\n'id': This is a string that serves as a unique identifier for the material. Typically, it matches the material's name.\n'opaque': This is a boolean that indicates whether the material is opaque or not.\n'color': This is an array of three numerical values between 0 and 1. They represent the Red, Green, and Blue color values of the material.\n'texture': This string describes the material's texture in a visually detailed manner.\nHere is a template for a 'materials' array:\n\n[\n  {\n    \"name\": \"<material_name>\",\n    \"id\": \"<material_id>\",\n    \"opaque\": <true_or_false>,\n    \"color\": [\"<red_value_0_to_1>\", \"<green_value_0_to_1>\", \"<blue_value_0_to_1>\"],\n    \"texture\": \"<detailed_texture_description>\"\n  },\n  // add more material objects as needed\n]\nNext, create the 'blocks' array, which should include various blocks of these materials. Each block object in the array will have the following properties:\n\n'name': This is a string that represents the common name of the block.\n'id': This is a string that serves as a unique identifier for the block. Typically, it matches the block's name.\n'min_height' and 'max_height': These are numerical values that represent the minimum and maximum depths at which the block can be found in the game world. The values range from -64 (deepest) to 0 (surface). You should assign these values based on real geological layers.\n'materials': This is an array of material identifiers which represents the different sides of the block. The order is: front, back, top, bottom, left, right.\n'probability': This is a numerical value between 0 and 1 that represents the chance of finding the block within its height range in the world.\n'properties': This is an object that includes the block's characteristics, such as if it's solid, its opacity, shine, if it's a fluid, and its durability.\nHere is a template for a 'blocks' array:\n\n[\n  {\n    \"name\": \"<block_name>\",\n    \"id\": \"<block_id>\",\n    \"min_height\": \"<min_height>\",\n    \"max_height\": \"<max_height>\",\n    \"materials\": [\"<material_id_front>\", \"<material_id_back>\", \"<material_id_top>\", \"<material_id_bottom>\", \"<material_id_left>\", \"<material_id_right>\"],\n    \"probability\": \"<probability_value>\",\n    \"properties\": { \n      \"solid\": <true_or_false>, \n      \"opaque\": <true_or_false>, \n      \"shining\": \"<shining_value_0_to_1>\", \n      \"fluid\": <true_or_false>, \n      \"durability\": \"<durability_value_1_to_100>\" \n    }\n  },\n  // add more block objects as needed\n]\nFill in these templates with appropriate values for each of these properties. Ensure that you follow a logical order for the geological layers and provide a range of different materials and blocks to create a rich and diverse game world.\n";
 
const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + String(OPENAI_API_KEY)
    },
    body: JSON.stringify({
      'prompt': prompt,
      'temperature': 0.7,
      'max_tokens': 3104,
      'top_p': 1,
      'frequency_penalty': 0,
      'presence_penalty': 0,
      'stop': ["\"\"\""],
    })
  };
  fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        document.getElementById("output").innerHTML = data.choices[0].text;
    }).catch(err => {
      console.log("Ran out of tokens for today! Try tomorrow!");
    });
//}