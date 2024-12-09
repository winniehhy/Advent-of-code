def get_directions():
    """
    Define and return directions for checking X-MAS patterns.
    """
    return {
        'UL': (-1, -1),
        'UR': (1, -1),
        'DL': (-1, 1),
        'DR': (1, 1),
    }

def is_valid_position(arr, i, j):
    """
    Check if the position (i, j) is valid within the array boundaries.
    """
    return 0 <= i < len(arr) and 0 <= j < len(arr[0])

def check_direction(arr, i, j, direction, letter, directions):
    """
    Check if the cell in the given direction matches the expected letter.
    """
    dx, dy = directions[direction]
    ni, nj = i + dy, j + dx  # Adjust indices for direction
    if not is_valid_position(arr, ni, nj):
        return False
    return arr[ni][nj] == letter

def find_xmas(arr, i, j):
    """
    Check for X-MAS patterns centered at (i, j).
    """
    if arr[i][j] != "A":  # Start check only for "A"
        return 0

    directions = get_directions()  # Get directions for checking patterns

    # Check for the four directional pairings forming the XMAS pattern
    ul_dr_match = (
        (check_direction(arr, i, j, 'UL', 'M', directions) and 
         check_direction(arr, i, j, 'DR', 'S', directions)) or
        (check_direction(arr, i, j, 'UL', 'S', directions) and 
         check_direction(arr, i, j, 'DR', 'M', directions))
    )

    ur_dl_match = (
        (check_direction(arr, i, j, 'UR', 'M', directions) and 
         check_direction(arr, i, j, 'DL', 'S', directions)) or
        (check_direction(arr, i, j, 'UR', 'S', directions) and 
         check_direction(arr, i, j, 'DL', 'M', directions))
    )

    # Return 1 if both matches are found
    return 1 if ul_dr_match and ur_dl_match else 0

def count_xmas_patterns(arr):
    """
    Count all X-MAS patterns in the array.
    """
    return sum(
        find_xmas(arr, i, j)
        for i in range(len(arr))
        for j in range(len(arr[0]))
    )

def main():
    """
    Main execution function.
    """
    with open("input.txt") as file:
        array = [list(line.strip()) for line in file]

    total_xmas = count_xmas_patterns(array)
    print("Total X-MAS patterns:", total_xmas)

if __name__ == "__main__":
    main()
