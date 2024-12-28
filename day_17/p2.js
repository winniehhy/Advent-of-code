const fs = require('fs');

// Read the content of input.txt and extract numbers
const program = fs.readFileSync('input.txt', 'utf-8')
  .match(/\d+/g)
  .map(Number)
  .slice(3);  // Skip the first three numbers (register values)

// Function to implement the recursive find logic with BigInt
function find(program, ans) {
  if (program.length === 0) {
    return ans;
  }

  const target = BigInt(program[program.length - 1]);

  for (let x = 0n; x < 8n; x++) {
    let a = (ans << 3n) | x;
    let b = a % 8n;
    b = b ^ 2n;
    let c = a >> b;
    b = b ^ c;
    b = b ^ 3n;
    
    if (b % 8n === target) {
      const sub = find(program.slice(0, -1), a);
      if (sub === null) {
        continue;
      }
      return sub;
    }
  }

  return null;
}

// Start with 0n (BigInt zero) as initial value
const result = find(program, 0n);
console.log(result.toString());  // Convert BigInt to string for display