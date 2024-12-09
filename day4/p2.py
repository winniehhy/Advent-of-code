def count_xmas_patterns(grid):
    rows = len(grid)
    cols = len(grid[0])
    count = 0

    # Define the two patterns explicitly
    pattern1 = [["M", ".", "S"],  # Top-left to bottom-right diagonal
                [".", "A", "."],
                ["M", ".", "S"]]

    pattern2 = [[".", "S", "M"],  # Top-right to bottom-left diagonal
                [".", "A", "."],
                [".", "S", "M"]]

    # Function to check if a 3x3 subgrid matches a pattern
    def matches_pattern(r, c, pattern):
        for i in range(3):
            for j in range(3):
                if pattern[i][j] != "." and grid[r + i][c + j] != pattern[i][j]:
                    return False
        return True

    # Iterate through all possible 3x3 subgrids
    for r in range(rows - 2):
        for c in range(cols - 2):
            # Check both patterns for the current subgrid
            if matches_pattern(r, c, pattern1) or matches_pattern(r, c, pattern2):
                count += 1

    return count

# Read the input file into a grid
with open("input.txt", "r") as file:
    word_search = [list(line.strip()) for line in file]

# Count the total X-MAS patterns
total_xmas_patterns = count_xmas_patterns(word_search)

print(f"Total X-MAS patterns found: {total_xmas_patterns}")
