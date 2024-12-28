//ans: 270084

const fs = require('fs');

// Counter class implementation
class Counter {
    constructor() {
        this.counts = new Map();
    }

    add(key, value = 1) {
        const strKey = JSON.stringify(key);
        this.counts.set(strKey, (this.counts.get(strKey) || 0) + value);
    }

    items() {
        return Array.from(this.counts.entries()).map(([key, value]) => [JSON.parse(key), value]);
    }

    total() {
        return Array.from(this.counts.values()).reduce((sum, count) => sum + count, 0);
    }
}

// Add two counters
Counter.prototype.addCounter = function(other) {
    for (const [key, value] of other.counts.entries()) {
        const currentValue = this.counts.get(key) || 0;
        this.counts.set(key, currentValue + value);
    }
    return this;
}

function buildGrid(keys) {
    const grid = {};
    for (let i = 0; i < keys.length; i++) {
        grid[keys[i]] = [i % 3, Math.floor(i / 3)];
    }
    return grid;
}

function steps(grid, seq, weight) {
    let [px, py] = grid["A"];
    let [bx, by] = grid[" "];
    const result = new Counter();
    
    for (const instruction of seq) {
        const [npx, npy] = grid[instruction];
        const block = (npx === bx && py === by) || (npy === by && px === bx);
        result.add([npx - px, npy - py, block], weight);
        [px, py] = [npx, npy];
    }
    return result;
}

function getComplexity(codes, n, keypad, dirpad) {
    let total = 0;
    
    for (const code of codes) {
        if (!code.trim()) continue;  // Skip empty lines
        
        let res = steps(keypad, code, 1);
        
        for (let i = 0; i <= n; i++) {
            const newRes = new Counter();
            
            for (const [[x, y, block], count] of res.items()) {
                let seq = "";
                // Build sequence string
                if (x < 0) seq += "<".repeat(-x);
                if (y > 0) seq += "v".repeat(y);
                if (y < 0) seq += "^".repeat(-y);
                if (x > 0) seq += ">".repeat(x);
                
                // Apply block condition
                if (block) {
                    seq = seq.split('').reverse().join('');
                }
                seq += "A";
                
                newRes.addCounter(steps(dirpad, seq, count));
            }
            res = newRes;
        }
        
        total += res.total() * parseInt(code.slice(0, 3));
    }
    
    return total;
}

// Read and process input
try {
    const codes = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
    const keypad = buildGrid("789456123 0A");
    const dirpad = buildGrid(" ^A<v>");
    
    console.log(getComplexity(codes, 2, keypad, dirpad));
} catch (error) {
    console.error("Error:", error.message);
}