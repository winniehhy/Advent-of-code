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

        // Rule 1: Adjacent differences must be between -3 and +3
        if (diff < -3 || diff > 3) {
            return false;
        }

        // Rule 2: Determine if the sequence is consistently increasing or decreasing
        if (diff > 0) {
            decreasing = false;
        } else if (diff < 0) {
            increasing = false;
        } else {
            // Rule 3: No plateaus allowed
            return false;
        }
    }

    // A report is safe if it is strictly increasing or strictly decreasing
    return increasing || decreasing;
}

// Function to check if a report is safe with the Problem Dampener
bool is_safe_with_dampener(int levels[], int size) {
    // Check if the report is already safe
    if (is_safe(levels, size)) {
        return true;
    }

    // Try removing each level one by one
    for (int i = 0; i < size; i++) {
        int temp[MAX_LEVELS], temp_size = 0;

        // Create a modified array without the current level
        for (int j = 0; j < size; j++) {
            if (j != i) {
                temp[temp_size++] = levels[j];
            }
        }

        // Check if the modified report is safe
        if (is_safe(temp, temp_size)) {
            return true;
        }
    }

    return false;
}

int main() {
    FILE *file = fopen("input_puzzle.txt", "r");
    if (!file) {
        perror("Error opening file");
        return 1;
    }

    char line[256];
    int safe_count = 0, total_reports = 0;

    printf("Processing reports with the Problem Dampener...\n");

    while (fgets(line, sizeof(line), file)) {
        int levels[MAX_LEVELS], size = 0;
        char *token = strtok(line, " ");
        
        // Parse numbers into an array
        while (token) {
            levels[size++] = atoi(token);
            token = strtok(NULL, " ");
        }

        // Check if the report is safe with the Problem Dampener
        if (size > 0 && is_safe_with_dampener(levels, size)) {
            printf("Report %d is SAFE.\n", total_reports + 1);
            safe_count++;
        } else {
            printf("Report %d is UNSAFE.\n", total_reports + 1);
        }
        total_reports++;
    }

    fclose(file);

    // Print the results
    printf("Total reports: %d, Safe reports with Problem Dampener: %d\n", total_reports, safe_count);

    return 0;
}
