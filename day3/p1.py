import re

def extract_valid_mul_instructions(memory):
    # Regex to match only valid mul() instructions with exactly two comma-separated integers
    mul_pattern = r'mul\((\d+),(\d+)\)'
    
    # Find all valid mul() instructions
    valid_muls = re.findall(mul_pattern, memory)
    
    # Convert to integers and multiply
    results = [int(x) * int(y) for x, y in valid_muls]
    
    return results

def solve_corrupted_memory(memory):
    # Extract and multiply results
    mul_results = extract_valid_mul_instructions(memory)
    
    # Sum all multiplication results
    total_sum = sum(mul_results)
    
    return total_sum, mul_results

# Read the input file
with open('input_puzzle.txt', 'r') as file:
    corrupted_memory = file.read()

# Solve the puzzle
total, individual_results = solve_corrupted_memory(corrupted_memory)

print(f"Total sum of multiplications: {total}")
print(f"Number of valid mul() instructions: {len(individual_results)}")