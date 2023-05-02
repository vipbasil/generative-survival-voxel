function applyRules(axiom, rules) {
    return axiom.split('').map(char => rules[char] || char).join('');
  }
  
  function generateLSystem(iterations, axiom, rules) {
    let system = axiom;
    for (let i = 0; i < iterations; i++) {
      system = applyRules(system, rules);
    }
    return system;
  }
  
  function getRandomType() {
    const rand = Math.random();
    if (rand < 0.6) {
      return 'L';
    } else if (rand < 0.8) {
      return 'R';
    } else {
      return 'O';
    }
  }
  
  export function generateTree(seed, iterations = 4) {
    // Set the random seed, if provided
    if (seed) {
      //Math.seedrandom(seed);
    }
  
    const axiom = 'X';
    const rules = {
      X: () => {
        const numChildren = Math.floor(Math.random() * 3) + 1;
        const type = getRandomType();
        return `F[-${numChildren}X][+${numChildren}X]${numChildren > 1 ? `/${numChildren}X` : ''}F${type}X`;
      },
      F: 'FF',
      L: 'L',
      R: 'R',
      O: 'O',
    };
  
    const lSystem = generateLSystem(iterations, axiom, {
      X: rules.X(),
    });
  
    const tree = {
      type: 'log',
      lSystem: lSystem,
    };
  
    return tree;
  }
  export function create_voxel(x, y, z, type, noa) {
    noa.setBlock(type, x, y, z)
    console.log(`Creating voxel at (${x}, ${y}, ${z}) with type: ${type}`);
  }
  
 export function parseLSystem(lSystem, angle, length, create_voxel_fn, noa) {
    const stack = [];
    let currentPos = { x: 0, y: 10, z: 0 };
    let currentAngle = 0;
    const radians = (angle) => (angle * Math.PI) / 180;
  
    for (let i = 0; i < lSystem.length; i++) {
      const char = lSystem[i];
  
      switch (char) {
        case 'F':
          const nextPos = {
            x: currentPos.x + length * Math.cos(radians(currentAngle)),
            y: currentPos.y + length * Math.sin(radians(currentAngle)),
            z: currentPos.z,
          };
  
          create_voxel_fn(currentPos.x, currentPos.y, currentPos.z,6, noa);
          currentPos = nextPos;
          break;
        case '[':
          stack.push({ pos: { ...currentPos }, angle: currentAngle });
          break;
        case ']':
          const poppedState = stack.pop();
          currentPos = poppedState.pos;
          currentAngle = poppedState.angle;
          break;
        case '+':
          currentAngle += angle;
          break;
        case '-':
          currentAngle -= angle;
          break;
        case '/':
          currentAngle *= 2;
          break;
        case 'L':
          create_voxel_fn(currentPos.x, currentPos.y, currentPos.z, 7, noa);
          break;
        case 'R':
          create_voxel_fn(currentPos.x, currentPos.y, currentPos.z, 7, noa);
          break;
        case 'O':
          create_voxel_fn(currentPos.x, currentPos.y, currentPos.z, 7, noa);
          break;
      }
    }
  }
  

  

  

  