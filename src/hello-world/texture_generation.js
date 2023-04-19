const axios = require('axios');
const fs = require('fs');
const path = require('path');
const base64Img = require('base64-img');

const url = 'http://localhost:7860/sdapi/v1/txt2img';
const headers = {
  'accept': 'application/json',
  'Content-Type': 'application/json'
};
const payload = {
  enable_hr: false,
  denoising_strength: 0,
  firstphase_width: 0,
  firstphase_height: 0,
  hr_scale: 2,
  hr_upscaler: "",
  hr_second_pass_steps: 0,
  hr_resize_x: 0,
  hr_resize_y: 0,
  prompt: "grass",
  styles: [""],
  seed: -1,
  subseed: -1,
  subseed_strength: 0,
  seed_resize_from_h: -1,
  seed_resize_from_w: -1,
  sampler_name: "Euler a",
  batch_size: 1,
  n_iter: 1,
  steps: 50,
  cfg_scale: 7,
  width: 512,
  height: 512,
  restore_faces: false,
  tiling: true,
  negative_prompt: "",
  eta: 0,
  s_churn: 0,
  s_tmax: 0,
  s_tmin: 0,
  s_noise: 1,
  override_settings: {},
  override_settings_restore_afterwards: true,
  script_args: [],
  sampler_index: "Euler"
};

axios.post(url, payload, { headers })
  .then(response => {
    const images = response.data.images;
    images.forEach((imgStr, index) => {
      const imgData = imgStr.split(",")[1];
      const imgBuffer = Buffer.from(imgData, 'base64');
      const imgPath = path.join(__dirname, `output${index}.png`);
      base64Img.imgSync(imgBuffer, imgPath);
      console.log(`Image ${index} saved to ${imgPath}`);
    });
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
  });



