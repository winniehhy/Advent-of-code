#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#define MAX_LEVELS 100

// Function to check if a report is safe
bool is_safe(int levels[], int size) {
    bool increasing = true, decreasing = true;

    for (int i = 1; i < size; i++) {
        int diff = levels[i] - levels[i - 1];

        printf("Checking levels[%d]: %d -> levels[%d]: %d | diff: %d\n", 
                i - 1, levels[i - 1], i, levels[i], diff);

        // Rule 1: Adjacent differences must be between -3 and +3
        if (diff < -3 || diff > 3) {
            printf("Unsafe: Difference %d is out of range [-3, +3].\n", diff);
            return false;
        }

        // Rule 2: Determine if the sequence is consistently increasing or decreasing
        if (diff > 0) {
            decreasing = false;
        } else if (diff < 0) {
            increasing = false;
        } else {
            // Rule 3: No plateaus allowed
            printf("Unsafe: Plateau detected (diff = 0).\n");
            return false;
        }
    }

    // The report is safe if it is strictly increasing or strictly decreasing
    printf("Report is increasing: %d, decreasing: %d\n", increasing, decreasing);
    return increasing || decreasing;
}

int main() {
    FILE *file = fopen("input_puzzle.txt", "r");
    if (!file) {
        perror("Error opening file");
        return 1;
    }

    char line[256];
    int safe_count = 0, total_reports = 0;

    printf("Processing reports...\n");

    while (fgets(line, sizeof(line), file)) {
        int levels[MAX_LEVELS], size = 0;
        char *token = strtok(line, " ");
        
        // Parse numbers into an array
        while (token) {
            levels[size++] = atoi(token);
            token = strtok(NULL, " ");
        }

        // Check if the report is safe
        if (size > 0 && is_safe(levels, size)) {
            printf("Report %d is SAFE.\n", total_reports + 1);
            safe_count++;
        } else {
            printf("Report %d is UNSAFE.\n", total_reports + 1);
        }
        total_reports++;
    }

    fclose(file);

    // Print the results
    printf("Total reports: %d, Safe reports: %d\n", total_reports, safe_count);

    return 0;
}
