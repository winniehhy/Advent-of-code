//ans: 329431019997766

class Counter {
    constructor() {
        this.counts = new Map();
    }

    add(key, value = 1) {
        this.counts.set(key, (this.counts.get(key) || 0) + value);
    }

    items() {
        return Array.from(this.counts.entries());
    }

    total() {
        return Array.from(this.counts.values()).reduce((sum, count) => sum + count, 0);
    }

    addCounter(other) {
        for (const [key, value] of other.counts) {
            this.add(key, value);
        }
        return this;
    }
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
    let result = new Counter();
    
    for (const instruction of seq) {
        const [npx, npy] = grid[instruction];
        const block = (npx === bx && py === by) || (npy === by && px === bx);
        result.add(JSON.stringify([npx - px, npy - py, block]), weight);
        [px, py] = [npx, npy];
    }
    return result;
}

// Helper function to safely repeat strings with negative numbers
function safeRepeat(str, count) {
    return count > 0 ? str.repeat(count) : '';
}

function getComplexity(codes, n, keypad, dirpad) {
    let total = 0n;
    
    for (const code of codes) {
        if (!code) continue;
        let res = steps(keypad, code, 1);
        
        for (let i = 0; i <= n; i++) {
            let newRes = new Counter();
            
            for (const [keyStr, count] of res.items()) {
                const [x, y, block] = JSON.parse(keyStr);
                let seq = safeRepeat('<', -x) + 
                         safeRepeat('v', y) + 
                         safeRepeat('^', -y) + 
                         safeRepeat('>', x);
                
                if (block) {
                    seq = [...seq].reverse().join('');
                }
                seq += 'A';
                
                newRes.addCounter(steps(dirpad, seq, count));
            }
            res = newRes;
        }
        
        const multiplier = parseInt(code.slice(0, 3));
        total += BigInt(res.total()) * BigInt(multiplier);
    }
    return total;
}

const fs = require('fs');

try {
    const fileContent = fs.readFileSync('input.txt', 'utf8');
    const codes = fileContent.trim().split('\n');
    const keypad = buildGrid("789456123 0A");
    const dirpad = buildGrid(" ^A<v>");
    
    const result = getComplexity(codes, 25, keypad, dirpad);
    console.log(result.toString());
} catch (err) {
    console.error("Error:", err);
}