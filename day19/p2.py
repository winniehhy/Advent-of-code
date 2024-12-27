lines = open("input.txt").read().splitlines()

patterns = set(lines[0].split(", "))
max_len = max(map(len, patterns))
cache = {}

def find_permutation(design):
    if design == "":
        return 1
    count = 0
    if design in cache:
        return cache[design]
    for i in range(min(len(design), max_len) + 1):
        if design[:i] in patterns:
            count += find_permutation(design[i:])
    cache[design] = count
    return count

print(sum(find_permutation(design) for design in lines[2:]))