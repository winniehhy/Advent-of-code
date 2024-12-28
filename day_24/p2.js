//ans : cbd,gmh,jmq,qrh,rqf,z06,z13,z38

const fs = require('fs');

let formulas = {};

// Parse input file
function parseInput() {
    const content = fs.readFileSync('input.txt', 'utf-8').split('\n');
    let pastEmptyLine = false;
    
    for (const line of content) {
        if (!line.trim()) {
            pastEmptyLine = true;
            continue;
        }
        if (!pastEmptyLine) continue;
        
        const [x, op, y, z] = line.replace(' -> ', ' ').split(' ');
        formulas[z] = [op, x, y];
    }
}

function makeWire(char, num) {
    return char + String(num).padStart(2, '0');
}

function verifyZ(wire, num) {
    if (!(wire in formulas)) return false;
    const [op, x, y] = formulas[wire];
    if (op !== 'XOR') return false;
    
    if (num === 0) {
        return JSON.stringify([x, y].sort()) === JSON.stringify(['x00', 'y00']);
    }
    
    return (verifyIntermediateXor(x, num) && verifyCarryBit(y, num)) ||
           (verifyIntermediateXor(y, num) && verifyCarryBit(x, num));
}

function verifyIntermediateXor(wire, num) {
    if (!(wire in formulas)) return false;
    const [op, x, y] = formulas[wire];
    if (op !== 'XOR') return false;
    
    return JSON.stringify([x, y].sort()) === 
           JSON.stringify([makeWire('x', num), makeWire('y', num)].sort());
}

function verifyCarryBit(wire, num) {
    if (!(wire in formulas)) return false;
    const [op, x, y] = formulas[wire];
    
    if (num === 1) {
        if (op !== 'AND') return false;
        return JSON.stringify([x, y].sort()) === JSON.stringify(['x00', 'y00']);
    }
    
    if (op !== 'OR') return false;
    return (verifyDirectCarry(x, num - 1) && verifyRecarry(y, num - 1)) ||
           (verifyDirectCarry(y, num - 1) && verifyRecarry(x, num - 1));
}

function verifyDirectCarry(wire, num) {
    if (!(wire in formulas)) return false;
    const [op, x, y] = formulas[wire];
    if (op !== 'AND') return false;
    
    return JSON.stringify([x, y].sort()) === 
           JSON.stringify([makeWire('x', num), makeWire('y', num)].sort());
}

function verifyRecarry(wire, num) {
    if (!(wire in formulas)) return false;
    const [op, x, y] = formulas[wire];
    if (op !== 'AND') return false;
    
    return (verifyIntermediateXor(x, num) && verifyCarryBit(y, num)) ||
           (verifyIntermediateXor(y, num) && verifyCarryBit(x, num));
}

function verify(num) {
    return verifyZ(makeWire('z', num), num);
}

function progress() {
    let i = 0;
    while (true) {
        if (!verify(i)) break;
        i++;
    }
    return i;
}

function printTree(wire, depth) {
    if (!(wire in formulas)) {
        if (wire[0] === 'x' || wire[0] === 'y') {
            return '  '.repeat(depth) + wire;
        }
        return '';
    }
    const [op, x, y] = formulas[wire];
    return '  '.repeat(depth) + op + ' (' + wire + ')\n' + 
           printTree(x, depth + 1) + '\n' + 
           printTree(y, depth + 1);
}

// Main execution
try {
    parseInput();
    const swaps = [];
    
    for (let i = 0; i < 4; i++) {
        const baseline = progress();
        let found = false;
        
        for (const x of Object.keys(formulas)) {
            if (found) break;
            
            for (const y of Object.keys(formulas)) {
                if (x === y) continue;
                
                // Swap formulas
                const tempX = formulas[x];
                const tempY = formulas[y];
                formulas[x] = tempY;
                formulas[y] = tempX;
                
                if (progress() > baseline) {
                    swaps.push(x, y);
                    found = true;
                    break;
                }
                
                // Swap back if not improved
                formulas[x] = tempX;
                formulas[y] = tempY;
            }
        }
    }
    
    console.log(swaps.sort().join(','));
} catch (error) {
    console.error("Error:", error.message);
}