const fs = require("fs");

// Helper function to get the middle value from a map
function getMiddleValue(indexMap) {
    const entries = Array.from(indexMap.entries());
    const middleIndex = Math.floor(entries.length / 2);
    return entries[middleIndex] ? parseInt(entries[middleIndex][0], 10) : -1;
}

// Check if the rules for a specific update value are valid
function isRuleValid(updateValue, ruleValues, indexMap) {
    for (const ruleValue of ruleValues) {
        if (indexMap.has(ruleValue) && indexMap.get(ruleValue) < indexMap.get(updateValue)) {
            return false;
        }
    }
    return true;
}

// Get the key for a specific index in the map
function getIndexMapKey(indexMap, index) {
    for (const [key, value] of indexMap.entries()) {
        if (value === index) {
            return key;
        }
    }
    return "";
}

// Check if two update values are in order based on the rules
function isUpdateValueInOrder(val1, val2, ruleGraph, indexMap) {
    if (ruleGraph.has(val1)) {
        const ruleValues = ruleGraph.get(val1);
        if (ruleValues.includes(val2)) {
            return true;
        }
    }

    if (ruleGraph.has(val2)) {
        const ruleValues = ruleGraph.get(val2);
        if (ruleValues.includes(val1)) {
            return false;
        }
        return true;
    }

    return true;
}

// Sort the index map based on the rules
function sortIndexMap(ruleGraph, indexMap) {
    const entries = Array.from(indexMap.entries());
    const n = entries.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            const val1 = entries[minIndex][0];
            const val2 = entries[j][0];
            if (!isUpdateValueInOrder(val1, val2, ruleGraph, indexMap)) {
                minIndex = j;
            }
        }
        [entries[i], entries[minIndex]] = [entries[minIndex], entries[i]];
    }

    return new Map(entries);
}

// Check rules and calculate the total middle values for incorrect updates
function checkRules(ruleGraph, updateIndexMapArr) {
    let totalMiddleValues = 0;

    for (const indexMap of updateIndexMapArr) {
        let incorrectRule = false;

        for (const [updateValue] of indexMap.entries()) {
            if (ruleGraph.has(updateValue)) {
                const ruleValues = ruleGraph.get(updateValue);
                if (!isRuleValid(updateValue, ruleValues, indexMap)) {
                    incorrectRule = true;
                    break;
                }
            }
        }

        if (incorrectRule) {
            const sortedIndexMap = sortIndexMap(ruleGraph, indexMap);
            totalMiddleValues += getMiddleValue(sortedIndexMap);
        }
    }

    return totalMiddleValues;
}

// Main function
function main() {
    const filePath = "./input_puzzle.txt";
    const ruleGraph = new Map();
    const updateIndexMapArr = [];

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const lines = data.split("\n").map(line => line.trim());
        let parsingRules = true;

        // Parse the input file
        for (const line of lines) {
            if (line === "") {
                parsingRules = false;
                continue;
            }

            if (parsingRules) {
                const match = line.match(/(\d+)\|(\d+)/);
                if (match) {
                    const [_, key, value] = match;
                    if (!ruleGraph.has(key)) {
                        ruleGraph.set(key, []);
                    }
                    ruleGraph.get(key).push(value);
                }
            } else {
                const updateValues = line.split(",");
                const indexMap = new Map();
                updateValues.forEach((value, i) => indexMap.set(value, i));
                updateIndexMapArr.push(indexMap);
            }
        }

        // Process rules and updates
        const totalMiddleValues = checkRules(ruleGraph, updateIndexMapArr);
        console.log(totalMiddleValues);
    } catch (err) {
        console.error("Error reading file:", err.message);
    }
}

// Execute the main function
main();
