const fs = require('fs');

function main() {
    // Read the input file
    const line = fs.readFileSync('input.txt', 'utf-8').trim();
    
    const files = {};
    let freeSpace = [];
    let id = 0;
    let pos = 0;

    // Parse the disk map
    for (let i = 0; i < line.length; i++) {
        const x = parseInt(line[i], 10);
        if (i % 2 === 0) {
            // Files: store the position and size for each file
            files[id] = [pos, x];
            id++;
        } else {
            // Free space: store the position and size of free spaces
            if (x !== 0) {
                freeSpace.push([pos, x]);
            }
        }
        pos += x;
    }

    // Move files into the available free space
    while (id > 0) {
        id--;
        let [pos, size] = files[id];
        
        for (let i = 0; i < freeSpace.length; i++) {
            let [start, len] = freeSpace[i];
            
            if (start >= pos) {
                freeSpace = freeSpace.slice(0, i); // Stop if the free space starts after the file position
                break;
            }

            if (size <= len) {
                // Move file into the free space
                files[id] = [start, size];
                if (size === len) {
                    freeSpace.splice(i, 1); // Remove the free space if file fills it completely
                } else {
                    freeSpace[i] = [start + size, len - size]; // Update free space
                }
                break;
            }
        }
    }

    // Calculate the total checksum
    let total = 0;
    for (const [id, [pos, size]] of Object.entries(files)) {
        for (let x = pos; x < pos + size; x++) {
            total += id * x;
        }
    }

    // Print the checksum
    console.log(total);

    // Save the checksum to a file
    fs.writeFileSync('output.txt', `Checksum: ${total}`);
}

main();
