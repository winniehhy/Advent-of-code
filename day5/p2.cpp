#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_map>
#include <string>
#include <regex>
#include <algorithm>

using namespace std;

// Helper function to get the middle value from a map
int getMiddleValue(const unordered_map<string, int>& indexMap) {
    int middleIndex = indexMap.size() / 2;
    for (const auto& pair : indexMap) {
        if (pair.second == middleIndex) {
            return stoi(pair.first);
        }
    }
    return -1; // Default return if middle value not found
}

// Check if the rules for a specific update value are valid
bool isRuleValid(const string& updateValue, const vector<string>& ruleValues, const unordered_map<string, int>& indexMap) {
    for (const auto& ruleValue : ruleValues) {
        if (indexMap.find(ruleValue) == indexMap.end()) {
            continue;
        }
        if (indexMap.at(ruleValue) < indexMap.at(updateValue)) {
            return false;
        }
    }
    return true;
}

// Get the key for a specific index in the map
string getIndexMapKey(const unordered_map<string, int>& indexMap, int index) {
    for (const auto& pair : indexMap) {
        if (pair.second == index) {
            return pair.first;
        }
    }
    return "";
}

// Check if two update values are in order based on the rules
bool isUpdateValueInOrder(const string& val1, const string& val2, const unordered_map<string, vector<string>>& ruleGraph,
                          const unordered_map<string, int>& indexMap) {
    if (ruleGraph.find(val1) != ruleGraph.end()) {
        const auto& ruleValues = ruleGraph.at(val1);
        if (find(ruleValues.begin(), ruleValues.end(), val2) != ruleValues.end()) {
            return true;
        }
    }

    if (ruleGraph.find(val2) != ruleGraph.end()) {
        const auto& ruleValues = ruleGraph.at(val2);
        if (find(ruleValues.begin(), ruleValues.end(), val1) != ruleValues.end()) {
            return false;
        }
        return true;
    }

    return true;
}

// Sort the index map based on the rules
unordered_map<string, int> sortIndexMap(const unordered_map<string, vector<string>>& ruleGraph,
                                        unordered_map<string, int> indexMap) {
    int n = indexMap.size();

    for (int i = 0; i < n - 1; ++i) {
        int minIndex = i;
        for (int j = i + 1; j < n; ++j) {
            string val1 = getIndexMapKey(indexMap, minIndex);
            string val2 = getIndexMapKey(indexMap, j);
            if (!isUpdateValueInOrder(val1, val2, ruleGraph, indexMap)) {
                minIndex = j;
            }
        }
        string minVal = getIndexMapKey(indexMap, minIndex);
        string val = getIndexMapKey(indexMap, i);
        swap(indexMap[val], indexMap[minVal]);
    }

    return indexMap;
}

// Check rules and calculate the total middle values for incorrect updates
int checkRules(const unordered_map<string, vector<string>>& ruleGraph,
               vector<unordered_map<string, int>>& updateIndexMapArr) {
    int totalMiddleValues = 0;

    for (auto& indexMap : updateIndexMapArr) {
        bool incorrectRule = false;

        for (const auto& updateValue : indexMap) {
            if (ruleGraph.find(updateValue.first) != ruleGraph.end()) {
                const auto& ruleValues = ruleGraph.at(updateValue.first);
                if (!isRuleValid(updateValue.first, ruleValues, indexMap)) {
                    incorrectRule = true;
                    break;
                }
            }
        }

        if (incorrectRule) {
            auto sortedIndexMap = sortIndexMap(ruleGraph, indexMap);
            totalMiddleValues += getMiddleValue(sortedIndexMap);
        }
    }

    return totalMiddleValues;
}

int main() {
    ifstream file("./input_puzzle.txt");
    unordered_map<string, vector<string>> ruleGraph;
    vector<unordered_map<string, int>> updateIndexMapArr;

    if (!file.is_open()) {
        cerr << "Error opening file!" << endl;
        return 1;
    }

    string line;
    bool parsingRules = true;

    // Parse rules
    while (getline(file, line)) {
        if (line.empty()) {
            parsingRules = false; // Switch to parsing updates
            continue;
        }

        if (parsingRules) {
            regex re("(\\d+)\\|(\\d+)");
            smatch match;
            if (regex_search(line, match, re)) {
                string key = match[1].str();
                string value = match[2].str();
                ruleGraph[key].push_back(value);
            }
        } else {
            // Parse updates
            istringstream ss(line);
            vector<string> updateValues;
            string value;
            while (getline(ss, value, ',')) {
                updateValues.push_back(value);
            }

            unordered_map<string, int> updateIndexMap;
            for (int i = 0; i < updateValues.size(); ++i) {
                updateIndexMap[updateValues[i]] = i;
            }
            updateIndexMapArr.push_back(updateIndexMap);
        }
    }

    int totalMiddleValues = checkRules(ruleGraph, updateIndexMapArr);
    cout << totalMiddleValues << endl;

    return 0;
}
