const fs = require('fs');

// Function to compare two numbers for sorting
const compare = (a, b) => a - b;

// Function to calculate the absolute difference
const absoluteDifference = (a, b) => Math.abs(a - b);

// Main function
function processFile(filename) {
    try {
        // Read the file content
        const data = fs.readFileSync(filename, 'utf8');

        // Split the file content into lines
        const lines = data.trim().split('\n');

        // Arrays to store the left and right numbers
        const left = [];
        const right = [];

        // Parse each line and populate the arrays
        lines.forEach(line => {
            const [leftNum, rightNum] = line.split(/\s+/).map(Number);
            left.push(leftNum);
            right.push(rightNum);
        });

        // Sort both arrays
        left.sort(compare);
        right.sort(compare);

        // Calculate the total distance
        let totalDistance = 0;
        console.log('Pairs and Distances:');
        for (let i = 0; i < left.length; i++) {
            const distance = absoluteDifference(left[i], right[i]);
            console.log(`Pair ${i}: Left=${left[i]}, Right=${right[i]}, Distance=${distance}`);
            totalDistance += distance;
        }

        // Print the total distance
        console.log(`\nTotal distance between lists: ${totalDistance}`);
    } catch (err) {
        console.error('Error reading or processing the file:', err);
    }
}

// Call the function with the input file
processFile('input_puzzle.txt');
