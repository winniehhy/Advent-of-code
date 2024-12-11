#include <iostream>
#include <fstream>
#include <vector>
#include <set>
#include <tuple>
using namespace std;

// Directions: Up, Right, Down, Left
const vector<pair<int, int>> STEP_DIRECTIONS = {
    {0, -1}, // Up
    {1, 0},  // Right
    {0, 1},  // Down
    {-1, 0}  // Left
};

// Function to locate the starting position of the guard (marked by '^') in the grid
pair<int, int> getStartingPosition(const vector<string>& array) {
    for (int j = 0; j < array.size(); ++j) {
        for (int i = 0; i < array[j].size(); ++i) {
            if (array[j][i] == '^') {
                return {i, j};
            }
        }
    }
    return {-1, -1}; // Return an invalid position if '^' is not found
}

// Function to determine if placing an obstruction at a specific position causes an infinite loop
bool isPathInfinite(pair<int, int> startPos, pair<int, int> obstructionPos, const vector<string>& array) {
    int rows = array.size(), columns = array[0].size();
    pair<int, int> currentPos = startPos;
    int directionIdx = 0;
    set<pair<pair<int, int>, int>> visitedPositions;

    while (true) {
        // Calculate the next position based on the current direction
        int nextPosX = currentPos.first + STEP_DIRECTIONS[directionIdx].first;
        int nextPosY = currentPos.second + STEP_DIRECTIONS[directionIdx].second;

        // If the next position is outside the grid, the path is not infinite
        if (nextPosX < 0 || nextPosX >= columns || nextPosY < 0 || nextPosY >= rows) {
            return false;
        }

        char cell = array[nextPosY][nextPosX];

        // If the next position is an obstruction or a '#' character, turn right
        if (make_pair(nextPosX, nextPosY) == obstructionPos || cell == '#') {
            directionIdx = (directionIdx + 1) % 4;
        } else if (cell == '.' || cell == '^') { // Move forward if the cell is empty or the starting position
            currentPos = {nextPosX, nextPosY};

            // Check if the current state (position and direction) has been visited before
            pair<pair<int, int>, int> state = {currentPos, directionIdx};
            if (visitedPositions.count(state)) {
                return true; // Infinite loop detected
            }
            visitedPositions.insert(state);
        }
    }
}

// Function to compute all distinct positions the guard can visit starting from the initial position
set<pair<int, int>> getDistinctPositionsSet(const vector<string>& array) {
    int rows = array.size(), columns = array[0].size();
    set<pair<int, int>> distinctPositions;
    pair<int, int> startPos = getStartingPosition(array);

    pair<int, int> currentPos = startPos;
    int directionIdx = 0;

    while (true) {
        // Calculate the next position based on the current direction
        int nextPosX = currentPos.first + STEP_DIRECTIONS[directionIdx].first;
        int nextPosY = currentPos.second + STEP_DIRECTIONS[directionIdx].second;

        // If the next position is outside the grid, stop the simulation
        if (nextPosX < 0 || nextPosX >= columns || nextPosY < 0 || nextPosY >= rows) {
            break;
        }

        char cell = array[nextPosY][nextPosX];

        if (cell == '.' || cell == '^') { // Add positions the guard can visit
            currentPos = {nextPosX, nextPosY};
            distinctPositions.insert(currentPos);
        } else if (cell == '#') { // Turn right if encountering an obstacle
            directionIdx = (directionIdx + 1) % 4;
        }
    }

    return distinctPositions;
}

// Function to calculate positions where placing an obstruction causes the guard to enter an infinite loop
int getDistinctObstructionPositions(const set<pair<int, int>>& distinctPositions, const vector<string>& array) {
    pair<int, int> startPos = getStartingPosition(array);
    set<pair<int, int>> filteredPositions = distinctPositions;
    filteredPositions.erase(startPos); // Remove the starting position from the set

    int infinitePaths = 0;
    for (const auto& position : filteredPositions) {
        if (isPathInfinite(startPos, position, array)) {
            ++infinitePaths; // Increment the count if an infinite loop is detected
        }
    }

    return infinitePaths;
}

int main() {
    // Open the input file and read the grid
    ifstream inputFile("input.txt");
    if (!inputFile) {
        cerr << "Error: Unable to open input.txt" << endl;
        return 1;
    }

    vector<string> array;
    string line;
    while (getline(inputFile, line)) {
        array.push_back(line);
    }

    inputFile.close();

    // Compute distinct positions the guard can visit
    set<pair<int, int>> distinctPositions = getDistinctPositionsSet(array);

    // Calculate the number of obstruction positions that cause an infinite loop
    int distinctObstructionPositions = getDistinctObstructionPositions(distinctPositions, array);
    cout << distinctObstructionPositions << endl;

    return 0;
}