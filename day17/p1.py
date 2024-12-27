def simulate_computer(program, init_a=0, init_b=0, init_c=0):
    registers = {'A': init_a, 'B': init_b, 'C': init_c}
    outputs = []
    ip = 0
    
    def get_combo_value(operand):
        if operand <= 3:
            return operand
        elif operand == 4:
            return registers['A']
        elif operand == 5:
            return registers['B']
        elif operand == 6:
            return registers['C']
        return 0  # operand 7 reserved
    
    while ip < len(program) - 1:
        opcode = program[ip]
        operand = program[ip + 1]
        
        if opcode == 0:  # adv
            registers['A'] = registers['A'] // (2 ** get_combo_value(operand))
        elif opcode == 1:  # bxl
            registers['B'] ^= operand
        elif opcode == 2:  # bst
            registers['B'] = get_combo_value(operand) % 8
        elif opcode == 3:  # jnz
            if registers['A'] != 0:
                ip = operand
                continue
        elif opcode == 4:  # bxc
            registers['B'] ^= registers['C']
        elif opcode == 5:  # out
            outputs.append(str(get_combo_value(operand) % 8))
        elif opcode == 6:  # bdv
            registers['B'] = registers['A'] // (2 ** get_combo_value(operand))
        elif opcode == 7:  # cdv
            registers['C'] = registers['A'] // (2 ** get_combo_value(operand))
            
        ip += 2
    
    return ','.join(outputs)

# Run the actual program
program = [2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0]
result = simulate_computer(program, init_a=48744869, init_b=0, init_c=0)
print(result)