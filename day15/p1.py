with open('input.txt', 'r') as f:
	map, moves = f.read().split("\n\n")
	map = [list(row.strip()) for row in map.split('\n')]
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

def sm_move(map, pos, dir):
	r, c = pos[0] + dir[0], pos[1] + dir[1]
	while map[r][c] == 'O':
		r += dir[0]
		c += dir[1]
	if map[r][c] == '#':
		# can't push, submarine stay
		return pos[0], pos[1]
	# push the whole line one tile on the direction
	map[r][c] = 'O'
	map[pos[0]][pos[1]] = '.'
	map[pos[0] + dir[0]][pos[1] + dir[1]] = '@'
	return pos[0] + dir[0], pos[1] + dir[1]

for ch in moves:
	if MOVEMENTS.get(ch) is None:
		continue
	dir = MOVEMENTS[ch]
	sm_row, sm_col = sm_move(map, (sm_row, sm_col), dir)

gps_sum = 0

for i in range(rows):
	for j in range(cols):
		if map[i][j] == 'O':
			gps_sum += 100 * i + j


with open('map.txt', 'w') as f:
	f.writelines([''.join(row) + '\n' for row in map])

print(gps_sum)