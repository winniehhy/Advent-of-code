function transformStones(initialStones) {
    // Track the stones as an array of stone counts and their current number
    let stones = initialStones.map(num => ({
        number: BigInt(num),
        count: 1n
    }));
    
    // Perform 75 blinks
    for (let blink = 0; blink < 75; blink++) {
        const newStones = [];
        
        for (let i = 0; i < stones.length; i++) {
            const { number, count } = stones[i];
            
            // Rule 1: If stone is 0, replace with 1
            if (number === 0n) {
                newStones.push({ number: 1n, count });
            }
            // Rule 2: If stone has even number of digits, split stone
            else if (number.toString().length % 2 === 0) {
                const stoneStr = number.toString();
                const midpoint = Math.floor(stoneStr.length / 2);
                newStones.push(
                    { 
                        number: BigInt(stoneStr.slice(0, midpoint)),
                        count 
                    },
                    { 
                        number: BigInt(stoneStr.slice(midpoint)),
                        count 
                    }
                );
            }
            // Rule 3: Multiply stone by 2024
            else {
                newStones.push({ 
                    number: number * 2024n, 
                    count 
                });
            }
        }
        
        // Merge identical stone numbers
        const mergedStones = new Map();
        for (const stone of newStones) {
            if (mergedStones.has(stone.number)) {
                mergedStones.get(stone.number).count += stone.count;
            } else {
                mergedStones.set(stone.number, stone);
            }
        }
        
        // Convert back to array
        stones = Array.from(mergedStones.values());
    }
    
    // Sum up the total number of stones
    return stones.reduce((sum, stone) => sum + stone.count, 0n);
}

// Read input from file
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split(' ').map(Number);

console.log(transformStones(input).toString());