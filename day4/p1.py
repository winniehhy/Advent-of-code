def find_word(grid, word):
    rows = len(grid)
    cols = len(grid[0])
    word_len = len(word)
    count = 0

    # Define directions for movement: (row_step, col_step)
    directions = [
        (0, 1),   # Right
        (1, 0),   # Down
        (1, 1),   # Down-right diagonal
        (1, -1),  # Down-left diagonal
        (0, -1),  # Left
        (-1, 0),  # Up
        (-1, -1), # Up-left diagonal
        (-1, 1)   # Up-right diagonal
    ]

    for r in range(rows):
        for c in range(cols):
            for dr, dc in directions:
                match = True
                for k in range(word_len):
                    nr, nc = r + k * dr, c + k * dc
                    if nr < 0 or nr >= rows or nc < 0 or nc >= cols or grid[nr][nc] != word[k]:
                        match = False
                        break
                if match:
                    count += 1
    return count


# Read the input file
with open("input.txt", "r") as file:
    word_search = [line.strip() for line in file]

# Define the word to search
word_to_find = "XMAS"

# Count the occurrences
total_occurrences = find_word(word_search, word_to_find)

print(f"Total occurrences of '{word_to_find}': {total_occurrences}")
