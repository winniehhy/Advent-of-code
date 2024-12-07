#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

#define MAX_ENTRIES 100000
#define MAX_VALUE 100000

int main() {
    FILE* file = fopen("input_puzzle.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }

    int left[MAX_ENTRIES], right[MAX_ENTRIES];
    int left_count = 0, right_count = 0;
    int max_left = 0, max_right = 0;

    // Read numbers from the file with debugging
    int left_num, right_num;
    printf("Reading input file...\n");
    
    while (fscanf(file, "%d %d", &left_num, &right_num) == 2) {
        // Check for maximum value
        if (left_num > MAX_VALUE || right_num > MAX_VALUE) {
            printf("ERROR: Value out of range - Left: %d, Right: %d\n", left_num, right_num);
            return 1;
        }

        left[left_count++] = left_num;
        right[right_count++] = right_num;

        // Track maximum values for debugging
        max_left = (left_num > max_left) ? left_num : max_left;
        max_right = (right_num > max_right) ? right_num : max_right;

        // Optional: Limit entries to prevent overflow
        if (left_count >= MAX_ENTRIES || right_count >= MAX_ENTRIES) {
            printf("WARNING: Reached maximum number of entries\n");
            break;
        }
    }
    fclose(file);

    printf("Read %d entries\n", left_count);
    printf("Max left value: %d\n", max_left);
    printf("Max right value: %d\n", max_right);

    // Use dynamic allocation for counts to handle larger values
    long long* right_counts = calloc(max_right + 1, sizeof(long long));
    if (right_counts == NULL) {
        perror("Memory allocation failed");
        return 1;
    }

    // Count occurrences in right list
    printf("Counting occurrences...\n");
    for (int i = 0; i < right_count; i++) {
        right_counts[right[i]]++;
    }

    // Debug: Print first few occurrence counts
    printf("First 10 occurrence counts:\n");
    for (int i = 0; i < 10; i++) {
        if (right_counts[i] > 0) {
            printf("Number %d: %lld occurrences\n", i, right_counts[i]);
        }
    }

    // Calculate similarity score
    long long similarity_score = 0;
    printf("Calculating similarity score...\n");
    for (int i = 0; i < left_count; i++) {
        similarity_score += (long long)left[i] * right_counts[left[i]];
        
        // Optional: Periodic progress and overflow check
        if (i % 10000 == 0) {
            printf("Progress: %d/%d. Current score: %lld\n", i, left_count, similarity_score);
        }
    }

    printf("Similarity Score: %lld\n", similarity_score);

    // Clean up
    free(right_counts);

    return 0;
}