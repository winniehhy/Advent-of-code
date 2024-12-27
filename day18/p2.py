from collections import deque

size = 70
coords = [list(map(int, line.split(","))) for line in open("input.txt")]

def connected(bytes):
    grid = [[0] * (size + 1) for _ in range(size + 1)]

    for c, r in coords[:bytes]:
        grid[r][c] = 1

    q = deque([(0, 0)])
    seen = {(0, 0)}

    while q:
        r, c = q.popleft()
        for nr, nc in [(r + 1, c), (r, c + 1), (r - 1, c), (r, c - 1)]:
            if nr < 0 or nc < 0 or nr > size or nc > size:
                continue
            if grid[nr][nc] == 1:
                continue
            if (nr, nc) in seen:
                continue
            if nr == nc == size:
                return True
            seen.add((nr, nc))
            q.append((nr, nc))

    return False

low = 0
high = len(coords) - 1

while low < high:
    mid = (low + high) // 2
    if connected(mid + 1):
        low = mid + 1
    else:
        high = mid

print(coords[low])