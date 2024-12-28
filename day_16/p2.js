// MinHeap implementation for priority queue
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const result = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._bubbleDown(0);
        return result;
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            if (this._compare(this.heap[parentIdx], this.heap[index]) <= 0) break;
            
            [this.heap[parentIdx], this.heap[index]] = 
            [this.heap[index], this.heap[parentIdx]];
            index = parentIdx;
        }
    }

    _bubbleDown(index) {
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && 
                this._compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }
            if (rightChild < this.heap.length && 
                this._compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = 
            [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    _compare(a, b) {
        return a[0] - b[0];  // Compare by cost
    }

    get length() {
        return this.heap.length;
    }
}

const fs = require('fs');

// Read and parse input
const grid = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split(''));

const rows = grid.length;
const cols = grid[0].length;

// Find starting position
let sr, sc;
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 'S') {
            sr = r;
            sc = c;
            break;
        }
    }
    if (sr !== undefined) break;
}

const pq = new MinHeap();
pq.push([0, sr, sc, 0, 1]);

const lowestCost = new Map();
lowestCost.set(`${sr},${sc},0,1`, 0);

const backtrack = new Map();
let bestCost = Infinity;
const endStates = new Set();

while (pq.length > 0) {
    const [cost, r, c, dr, dc] = pq.pop();
    const stateKey = `${r},${c},${dr},${dc}`;
    
    if (cost > (lowestCost.get(stateKey) ?? Infinity)) continue;
    
    lowestCost.set(stateKey, cost);
    
    if (grid[r]?.[c] === 'E') {
        if (cost > bestCost) break;
        bestCost = cost;
        endStates.add(stateKey);
    }
    
    if (!backtrack.has(stateKey)) {
        backtrack.set(stateKey, new Set());
    }
    
    // Generate next moves
    const moves = [
        [cost + 1, r + dr, c + dc, dr, dc],      // Continue straight
        [cost + 1000, r, c, dc, -dr],            // Turn right
        [cost + 1000, r, c, -dc, dr]             // Turn left
    ];
    
    for (const [newCost, nr, nc, ndr, ndc] of moves) {
        if (!grid[nr]?.[nc] || grid[nr][nc] === '#') continue;
        
        const nextKey = `${nr},${nc},${ndr},${ndc}`;
        const lowest = lowestCost.get(nextKey) ?? Infinity;
        
        if (newCost > lowest) continue;
        
        if (newCost < lowest) {
            backtrack.set(nextKey, new Set());
            lowestCost.set(nextKey, newCost);
        }
        
        backtrack.get(nextKey).add(stateKey);
        pq.push([newCost, nr, nc, ndr, ndc]);
    }
}

// Backtrack to find all visited positions
const states = [...endStates];
const seen = new Set(endStates);

while (states.length > 0) {
    const key = states.shift();
    for (const last of backtrack.get(key) ?? []) {
        if (seen.has(last)) continue;
        seen.add(last);
        states.push(last);
    }
}

// Count unique positions
const uniquePositions = new Set();
for (const state of seen) {
    const [r, c] = state.split(',').map(Number);
    uniquePositions.add(`${r},${c}`);
}

console.log(uniquePositions.size);