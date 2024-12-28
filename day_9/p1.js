const fs = require('fs');

function main() {
    // Read the input file
    const line = fs.readFileSync('input.txt', 'utf-8').trim();
    const disk = [];
    let id = 0;

    // Parse the disk map
    for (let i = 0; i < line.length; i++) {
        const x = parseInt(line[i], 10);
        if (i % 2 === 0) {
            // Add file blocks with the current file ID
            for (let j = 0; j < x; j++) {
                disk.push(id);
            }
            id++;
        } else {
            // Add free space blocks (represented as ".")
            for (let j = 0; j < x; j++) {
                disk.push('.');
            }
        }
    }

    // Collect indices of free space blocks
    const freeSpace = [];
    for (let i = 0; i < disk.length; i++) {
        if (disk[i] === '.') {
            freeSpace.push(i);
        }
    }

    // Move blocks from the end to fill in the free space
    for (let i = 0; i < freeSpace.length; i++) {
        while (disk[disk.length - 1] === '.') {
            disk.pop();
        }

        if (disk.length <= freeSpace[i]) {
            break;
        }

        disk[freeSpace[i]] = disk.pop();
    }

    // Calculate the checksum
    const checksum = disk.reduce((acc, x, i) => acc + (i * x), 0);

    // Print the checksum to the console
    console.log(checksum);

    // Write the result to an output file
    const output = `Disk: ${disk.join(' ')}\nChecksum: ${checksum}`;
    fs.writeFileSync('output.txt', output);
}

main();