import re

def solve_corrupted_memory(memory):
    # Regex for mul(), do(), and don't() instructions
    mul_pattern = r'mul\((\d+),(\d+)\)'
    do_pattern = r'do\(\)'
    dont_pattern = r'don\'?t\(\)'
    
    # Track multiplication state
    mul_enabled = True
    results = []
    
    # Find all instructions in order
    mul_matches = list(re.finditer(mul_pattern, memory))
    do_matches = list(re.finditer(do_pattern, memory))
    dont_matches = list(re.finditer(dont_pattern, memory))
    
    # Combine and sort all matches by their position
    all_matches = sorted(
        [(m.start(), 'mul', m.group(1), m.group(2)) for m in mul_matches] +
        [(m.start(), 'do') for m in do_matches] +
        [(m.start(), 'dont') for m in dont_matches],
        key=lambda x: x[0]
    )
    
    # Process instructions in order
    for match in all_matches:
        if match[1] == 'do':
            mul_enabled = True
        elif match[1] == 'dont':
            mul_enabled = False
        elif match[1] == 'mul':
            if mul_enabled:
                results.append(int(match[2]) * int(match[3]))
    
    # Sum all enabled multiplication results
    total_sum = sum(results)
    
    return total_sum, results

# Read the input file
with open('input_puzzle.txt', 'r') as file:
    corrupted_memory = file.read()

# Solve the puzzle
total, individual_results = solve_corrupted_memory(corrupted_memory)

print(f"Total sum of enabled multiplications: {total}")
print(f"Number of enabled mul() instructions: {len(individual_results)}")
print(f"Individual multiplication results: {individual_results}")