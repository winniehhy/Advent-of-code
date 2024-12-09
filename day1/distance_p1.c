#include <stdio.h>
#include <stdlib.h>

// Comparison function for qsort
// This function compares two integers and returns the difference
// Used by qsort to sort the arrays in ascending order
int compare(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    // Open the input file for reading
    FILE* file = fopen("input_puzzle.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }

    // Define maximum number of entries and initialize arrays
    int max_entries = 1000;
    int left[1000], right[1000];
    int left_count = 0, right_count = 0;

    // Read pairs of numbers from the file and store them in arrays
    int left_num, right_num;
    while (fscanf(file, "%d %d", &left_num, &right_num) == 2) {
        left[left_count++] = left_num;
        right[right_count++] = right_num;
    }
    fclose(file);

    // Sort both arrays using qsort
    qsort(left, left_count, sizeof(int), compare);
    qsort(right, right_count, sizeof(int), compare);

    // Calculate the total distance between corresponding elements in the arrays
    long long total_distance = 0;
    printf("Pairs and Distances:\n");
    for (int i = 0; i < left_count; i++) {
        long long distance = llabs((long long)left[i] - (long long)right[i]);
        printf("Pair %d: Left=%d, Right=%d, Distance=%lld\n", 
               i, left[i], right[i], distance);
        total_distance += distance;
    }

    // Print the total distance
    printf("\nTotal distance between lists: %lld\n", total_distance);

    return 0;
}