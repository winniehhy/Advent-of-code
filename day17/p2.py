def execute_program(program, initial_a):
    registers = {'A': initial_a, 'B': 0, 'C': 0}
    output = []
    pos = 0
    
    while pos < len(program):
        instruction = program[pos]
        
        if instruction == 0:  # Output from B
            output.append(registers['B'])
            pos += 1
        elif instruction == 1:  # Set B to value
            registers['B'] = program[pos + 1]
            pos += 2
        elif instruction == 2:  # Set B to value from register
            if program[pos + 1] == 0:
                reg = 'A'
            elif program[pos + 1] == 1:
                reg = 'B'
            else:
                reg = 'C'
            registers['B'] = registers[reg]
            pos += 2
        elif instruction == 3:  # Add to B
            registers['B'] += program[pos + 1]
            pos += 2
        elif instruction == 4:  # Multiply B by value
            registers['B'] *= program[pos + 1]
            pos += 2
        elif instruction == 5:  # Store B in register
            if program[pos + 1] == 0:
                reg = 'A'
            elif program[pos + 1] == 1:
                reg = 'B'
            else:
                reg = 'C'
            registers[reg] = registers['B']
            pos += 2
        elif instruction == 7:  # Jump if B != 0
            if registers['B'] != 0:
                pos += program[pos + 1]
            else:
                pos += 2
                
    return output

def find_initial_value(target_program):
    a = 1
    while a < 1000000:  # Reasonable upper limit
        output = execute_program(target_program, a)
        if output == target_program:
            return a
        a += 1
    return None

program = [2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0]
result = find_initial_value(program)
print(f"Initial value needed: {result}")