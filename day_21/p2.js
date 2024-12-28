const fs = require('fs');

function checkFullAdderStructure(x, y, z, gates) {
    // Find XOR gate for sum
    const xorGate = gates.find(g => g[0].includes(x) && g[0].includes(y) && g[1] === "XOR");
    if (!xorGate) return false;
    const a = xorGate[2];

    // Find AND gate for first carry
    const andGate = gates.find(g => g[0].includes(x) && g[0].includes(y) && g[1] === "AND");
    if (!andGate) return false;
    const b = andGate[2];

    // Find second XOR gate
    const xorGate2 = gates.find(g => g[0].includes(a) && g[0].includes(z) && g[1] === "XOR");
    if (!xorGate2) return false;
    const c = xorGate2[2];

    // Find AND gate with XOR output
    const andGate2 = gates.find(g => g[0].includes(a) && g[0].includes(z) && g[1] === "AND");
    if (!andGate2) return false;
    const d = andGate2[2];

    // Find OR gate
    const orGate = gates.find(g => g[0].includes(b) && g[0].includes(d) && g[1] === "OR");
    if (!orGate) return false;

    return true;
}

function findSwapped(gates) {
    const swapped = [];
    const checked = new Set();

    gates.forEach(gate => {
        gate[0].forEach(input => {
            if ((input.startsWith('x') || input.startsWith('y')) && !checked.has(input)) {
                checked.add(input);
                gates.forEach(otherGate => {
                    otherGate[0].forEach(otherInput => {
                        if (otherInput !== input && 
                            (otherInput.startsWith('x') || otherInput.startsWith('y')) && 
                            !checked.has(otherInput)) {
                            console.log(`Checking: ${input} ${otherInput}`);
                            if (checkFullAdderStructure(input, otherInput, 'z00', gates)) {
                                swapped.push(input, otherInput);
                            }
                        }
                    });
                });
            }
        });
    });

    return swapped;
}

// Parse the input file
function parseInput(data) {
    const lines = data.split('\n');
    const gates = [];
    let readingGates = false;

    for (const line of lines) {
        if (line.trim() === '') {
            readingGates = true;
            continue;
        }

        if (readingGates && line.trim()) {
            const [inputs, output] = line.split(' -> ');
            const parts = inputs.trim().split(' ');
            gates.push([
                [parts[0], parts[2]], // input signals
                parts[1],             // operation
                output.trim()         // output signal
            ]);
        }
    }

    return gates;
}

try {
    const data = fs.readFileSync('input.txt', 'utf-8');
    const gates = parseInput(data);
    const swapped = findSwapped(gates);
    console.log("Swapped signals:", swapped.join(','));
} catch (error) {
    console.error("Error:", error.message);
}