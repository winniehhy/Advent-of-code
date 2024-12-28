// Function to evaluate all equations generated from a digit set
const operations = ['+', '*', '||'];

function getResult(numbers, result) {
    const operationPermutations = cartesianProduct(operations, numbers.length - 1);

    for (const permutation of operationPermutations) {
        let equation = [];
        const tempNumbers = [...numbers];
        const permList = [...permutation];

        while (tempNumbers.length > 1) {
            equation.push(tempNumbers.shift());
            equation.push(permList.shift());
        }
        equation.push(tempNumbers.shift());

        let totalResult = parseInt(equation.shift(), 10);

        while (equation.length > 0) {
            const char = equation.shift();
            const num = parseInt(equation.shift(), 10);

            if (char === '+') {
                totalResult += num;
            } else if (char === '*') {
                totalResult *= num;
            } else if (char === '||') {
                totalResult = parseInt(`${totalResult}${num}`);
            }
        }

        if (totalResult === parseInt(result, 10)) {
            return totalResult;
        }
    }
    return 0;
}

function cartesianProduct(arr, repeat) {
    if (repeat === 0) return [[]];
    const rest = cartesianProduct(arr, repeat - 1);
    return arr.flatMap((item) => rest.map((combo) => [item, ...combo]));
}

function calculateTotalCalibration(input) {
    const lines = input.trim().split('\n');
    let totalCalibrationResult = 0;

    for (const line of lines) {
        const numbers = line.match(/\d+/g).map(Number);
        const result = numbers.shift();
        totalCalibrationResult += getResult(numbers, result);
    }

    return totalCalibrationResult;
}

// Example usage
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
const totalCalibrationResult = calculateTotalCalibration(input);
console.log(totalCalibrationResult);
