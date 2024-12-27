from time import sleep
from os import system

with open('input.txt', 'r') as f:
	map, moves = f.read().split("\n\n")
	map = [list(row.strip()) for row in map.split('\n')]
	for i in range(len(map)):
		for j in range(len(map[0])):
			if map[i][j] == '#':
				map[i][j] = '##'
			elif map[i][j] == 'O':
				map[i][j] = '[]'
			elif map[i][j] == '.':
				map[i][j] = '..'
			elif map[i][j] == '@':
				map[i][j] = '@.'
	map = [list(''.join(row)) for row in map]	
	with open('map_init.txt', 'w') as f:
		f.writelines([''.join(row) + '\n' for row in map])
	rows = len(map)
	cols = len(map[0])
	sm_row = -1
	sm_col = -1
	for i in range(rows):
		for j in range(cols):
			if map[i][j] == '@':
				sm_row = i
				sm_col = j
				break

MOVEMENTS = {
	'^': (-1, 0),
	'>': (0, 1),
	'v': (1, 0),
	'<': (0, -1)
}

def push_boxes(map, pos, dir, push_set: set):
	r, c = pos[0] + dir[0], pos[1] + dir[1]
	next_tile = map[r][c]
	if next_tile == '#':
		return False
	if next_tile == '[' and dir[0] != 0:
		if push_boxes(map, (pos[0] + dir[0], pos[1] + dir[1] + 1), dir, push_set) == False:
			return False
	elif next_tile == ']' and dir[0] != 0:
		if push_boxes(map, (pos[0] + dir[0], pos[1] + dir[1] - 1), dir, push_set) == False:
			return False
	push_set.add(pos)
	if next_tile != '.':
		return push_boxes(map, (pos[0] + dir[0], pos[1] + dir[1]), dir, push_set)
	return True

def sm_move(map, pos, dir):
	r, c = pos[0] + dir[0], pos[1] + dir[1]
	if map[r][c] == '#':
		return pos[0], pos[1]
	elif map[r][c] == '.':
		map[r][c] = '@'
		map[pos[0]][pos[1]] = '.'
		# for row in map:
		# 	print(''.join(row))
		# sleep(0.2)
		return r, c
	push_set = set()
	if push_boxes(map, pos, dir, push_set) == False:
		# can't push, submarine stay
		return pos[0], pos[1]
	push_list = list(push_set)
	push_list.sort(key=lambda t: (-t[0] * dir[0], -t[1] * dir[1]))
	for p in push_list:
		map[p[0] + dir[0]][p[1] + dir[1]] = map[p[0]][p[1]]
		map[p[0]][p[1]] = '.'
	# for row in map:
	# 	print(''.join(row))
	# sleep(0.5)
	return r, c

for ch in moves:
	if MOVEMENTS.get(ch) is None:
		continue
	dir = MOVEMENTS[ch]
	sm_row, sm_col = sm_move(map, (sm_row, sm_col), dir)

gps_sum = 0
for i in range(rows):
	for j in range(cols):
		if map[i][j] == '[':
			gps_sum += 100 * i + j

with open('map.txt', 'w') as f:
	f.writelines([''.join(row) + '\n' for row in map])

print(gps_sum)