#include <iostream>
#include <fstream>
#include <vector>
#include <set>
#include <tuple>
using namespace std;

// Directions: Up, Right, Down, Left
const vector<pair<int, int>> directions = { {-1, 0}, {0, 1}, {1, 0}, {0, -1} };

int main() {
    vector<string> grid;
    string line;

    // Read the grid input from file
    ifstream inputFile("input.txt");
    if (!inputFile) {
        cerr << "Error: Unable to open input.txt" << endl;
        return 1;
    }

    while (getline(inputFile, line)) {
        if (!line.empty()) {
            grid.push_back(line);
        }
    }
    inputFile.close();

    // Find the starting position and direction of the guard
    int rows = grid.size();
    int cols = grid[0].size();
    int start_x = -1, start_y = -1, direction = -1;

    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            if (grid[i][j] == '^') direction = 0;
            else if (grid[i][j] == '>') direction = 1;
            else if (grid[i][j] == 'v') direction = 2;
            else if (grid[i][j] == '<') direction = 3;

            if (direction != -1) {
                start_x = i;
                start_y = j;
                break;
            }
        }
        if (direction != -1) break;
    }

    // Track visited positions
    set<pair<int, int>> visited;
    int x = start_x, y = start_y;
    visited.insert({x, y});

    while (true) {
        int next_x = x + directions[direction].first;
        int next_y = y + directions[direction].second;

        // Check if the guard is about to leave the grid
        if (next_x < 0 || next_x >= rows || next_y < 0 || next_y >= cols) {
            break;
        }

        // Check for an obstacle
        if (grid[next_x][next_y] == '#') {
            direction = (direction + 1) % 4; // Turn right
        } else {
            x = next_x;
            y = next_y;
            visited.insert({x, y}); // Move forward
        }
    }

    // Output the number of distinct positions visited
    cout << "Distinct positions visited: " << visited.size() << endl;

    return 0;
}
