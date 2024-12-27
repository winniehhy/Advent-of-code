# Answer: 269

lines = open("input.txt").read().splitlines()

patterns = set(lines[0].split(", "))
max_len = max(map(len, patterns))
cache = {}

def can_obtain(design):
    if design == "":
        return True
    if design in cache:
        return cache[design]
    for i in range(min(len(design), max_len) + 1):
        if design[:i] in patterns and can_obtain(design[i:]):
            cache[design] = True
            return True
    return False

print(sum(can_obtain(design) for design in lines[2:]))