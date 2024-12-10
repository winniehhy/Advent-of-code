/*
- Parse the rules into a dictionary.
- Validate updates sequentially.
- Calculate the middle page for each valid update.
- Compute the sum.
*/

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_map>
#include <set>
#include <algorithm>

using namespace std;

// Function to parse input from file
void parseInput(const string& filename, unordered_map<int, set<int>>& rules, vector<vector<int>>& updates) {
    ifstream file(filename);
    if (!file) {
        cerr << "Error opening file!" << endl;
        return;
    }

    string line;
    bool parsingRules = true;

    while (getline(file, line)) {
        if (line.empty()) {
            parsingRules = false; // Switch to parsing updates
            continue;
        }

        if (parsingRules) {
            // Parse rules (e.g., "X|Y")
            stringstream ss(line);
            int x, y;
            char delim;
            ss >> x >> delim >> y;
            rules[x].insert(y);
        } else {
            // Parse updates (e.g., "75,47,61,53,29")
            stringstream ss(line);
            vector<int> update;
            int page;
            char delim;

            while (ss >> page) {
                update.push_back(page);
                ss >> delim; // Skip the comma
            }
            updates.push_back(update);
        }
    }
}

// Function to validate an update against rules
bool isValidUpdate(const vector<int>& update, const unordered_map<int, set<int>>& rules) {
    unordered_map<int, int> positions;

    // Map each page to its position in the update
    for (int i = 0; i < update.size(); ++i) {
        positions[update[i]] = i;
    }

    // Validate rules
    for (const auto& rule : rules) {
        int x = rule.first;
        for (int y : rule.second) {
            // If both x and y are in the update, check their order
            if (positions.count(x) && positions.count(y)) {
                if (positions[x] > positions[y]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Function to find the middle page of an update
int findMiddlePage(const vector<int>& update) {
    int n = update.size();
    return update[n / 2];
}

int main() {
    string filename = "input_puzzle.txt";

    unordered_map<int, set<int>> rules; // Stores rules as a map of X -> {Y}
    vector<vector<int>> updates;       // Stores updates as a vector of vectors

    // Parse the input file
    parseInput(filename, rules, updates);

    // Process each update
    int sumMiddlePages = 0;
    for (const auto& update : updates) {
        if (isValidUpdate(update, rules)) {
            sumMiddlePages += findMiddlePage(update);
        }
    }

    // Output the result
    cout << "Sum of middle pages: " << sumMiddlePages << endl;

    return 0;
}
