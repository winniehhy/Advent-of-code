function transformStones(initialStones) {
    let stones = [...initialStones];
    
    // Perform 25 blinks
    for (let blink = 0; blink < 25; blink++) {
        const newStones = [];
        
        for (let i = 0; i < stones.length; i++) {
            const stone = stones[i];
            
            // Rule 1: If stone is 0, replace with 1
            if (stone === 0) {
                newStones.push(1);
            }
            // Rule 2: If stone has even number of digits, split stone
            else if (stone.toString().length % 2 === 0) {
                const stoneStr = stone.toString();
                const midpoint = stoneStr.length / 2;
                newStones.push(
                    parseInt(stoneStr.slice(0, midpoint)),
                    parseInt(stoneStr.slice(midpoint))
                );
            }
            // Rule 3: Multiply stone by 2024
            else {
                newStones.push(stone * 2024);
            }
        }
        
        // Update stones for next blink
        stones = newStones;
    }
    
    return stones.length;
}

// Read input from file
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split(' ').map(Number);

console.log(transformStones(input));