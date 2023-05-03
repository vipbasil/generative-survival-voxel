export var lSystemRules = {
    axiom: 'X',
    productions: {
      'X': 'FFF[+>L][-<L][^L]F[+>L][-<L][^L]F[+>L][-<L][^L]F[+>L][-<L][^L]F[+>L][-<L][^L]F-X',
      'F': 'FF+[+L[-L]FL][-L[+L]FL][&L[&L]FL][^L[^L]FL]',
      '+': '+',
      '-': '-',
      '<': '<',
      '>': '>',
      '&': '&',
      '^': '^',
      '[': '[',
      ']': ']',
      'L': 'L', // Leaves
    },
  };
  
  
export function generateLSystemString(rules, iterations) {
    let lSystemString = rules.axiom;
  
    for (let i = 0; i < iterations; i++) {
      lSystemString = lSystemString
        .split('')
        .map((char) => rules.productions[char] || char)
        .join('');
    }
  
    return lSystemString;
  }
  
  
  //export var generatedTreeString = generateLSystemString(lSystemRules, 5);

  export function create_voxel(x, y, z, type, noa) {
    noa.setBlock(type, x, y, z)
    console.log(`Creating voxel at (${x}, ${y}, ${z}) with type: ${type}`);
  }
  
 
  
  export function parseLSystem(position,treeString, createVoxelFn,noa) {
    let currentPosition = { x: position[0], y: position[1], z: position[2] };
    
    var end=Math.random() * 10;
    for(var i=0;i<end;i++){
        createVoxelFn(currentPosition.x, currentPosition.y, currentPosition.z, 6,noa);
        currentPosition.y ++;
    }

    let currentAngles = { yaw: 0, pitch: 0 }; // Use an object to store yaw and pitch angles
    const stack = [];
  
    function radians(angle) {
      return (angle * Math.PI) / 180;
    }
    function randomOffset() {
        const range = 0.5;
        return (Math.random() * 2 * range) - range;
      }

    for (const char of treeString) {
      switch (char) {
        case 'F':
          const nextPosition = {
            y: currentPosition.y + 1 * Math.cos(radians(currentAngles.yaw)) * Math.cos(radians(currentAngles.pitch)),
            x: currentPosition.x + 1 * Math.sin(radians(currentAngles.yaw)) * Math.cos(radians(currentAngles.pitch)),
            z: currentPosition.z + 1 * Math.sin(radians(currentAngles.pitch)),
          };
          createVoxelFn(currentPosition.x, currentPosition.y, currentPosition.z, 6,noa);
          currentPosition = nextPosition;
          break;
        case '-':
          currentAngles.yaw += 45;
          break;
        case '+':
          currentAngles.yaw -= 45;
          break;
        case '&':
          currentAngles.pitch += 45;
          break;
        case '^':
          currentAngles.pitch -= 45;
          break;
        case '[':
          stack.push({ pos: { ...currentPosition }, angles: { ...currentAngles } });
          break;
        case ']':
          const poppedState = stack.pop();
          currentPosition = poppedState.pos;
          currentAngles = poppedState.angles;
          break;
        case 'L':
          createVoxelFn(currentPosition.x+ randomOffset(), currentPosition.y + randomOffset(), currentPosition.z+ randomOffset(), 7,noa);
          break;
        case 'X':
        default:
          // Ignore 'X' and any other unrecognized characters
          break;
      }
    }
  }
  
  

  

  