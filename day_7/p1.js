const fs = require("fs");

const operations = ["+", "*"];

function getResult(numbers, target) {
    const operationPermutations = generatePermutations(operations, numbers.length - 1);

    for (const permutation of operationPermutations) {
        let equation = [];
        let tempNumbers = [...numbers];
        let permList = [...permutation];

        while (tempNumbers.length > 1) {
            equation.push(tempNumbers.shift());
            equation.push(permList.shift());
        }
        equation.push(tempNumbers.shift());

        let totalResult = equation.shift();

        while (equation.length > 0) {
            const char = equation.shift();
            const num = equation.shift();
            if (char === "+") {
                totalResult += num;
            } else if (char === "*") {
                totalResult *= num;
            }
        }

        if (totalResult === target) {
            return totalResult;
        }
    }
    return 0;
}

function generatePermutations(operations, length) {
    if (length === 0) return [[]];

    const smallerPermutations = generatePermutations(operations, length - 1);
    const permutations = [];

    for (const perm of smallerPermutations) {
        for (const op of operations) {
            permutations.push([...perm, op]);
        }
    }

    return permutations;
}

function main() {
    const input = fs.readFileSync("input.txt", "utf-8");
    let totalCalibrationResult = 0;
    const lines = input.trim().split("\n");

    for (const line of lines) {
        const numbers = line.match(/\d+/g).map(Number);
        const target = numbers.shift();
        totalCalibrationResult += getResult(numbers, target);
    }

    console.log("Total Calibration Result:", totalCalibrationResult);
}

main();
