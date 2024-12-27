from dataclasses import dataclass
import re
import math
from time import sleep
from os import system

WIDTH = 101
HEIGHT = 103
SECONDS = 100
# WIDTH = 11
# HEIGHT = 7

@dataclass
class Robot:
    px: int
    py: int
    vx: int
    vy: int

robots: list[Robot] = []

def get_quadrant(x, y):
    middle = x == WIDTH // 2 or y == HEIGHT // 2
    if middle:
        return -1
    left = x < WIDTH // 2
    top = y < HEIGHT // 2
    if left and top:
        return 0
    elif not left and top:
        return 1
    elif left and not top:
        return 2
    return 3

with open("input.txt", 'r') as f:
    lines = f.readlines()
    pattern = "p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)"
    for line in lines:
        match = re.match(pattern, line)
        px, py, vx, vy = map(int, match.groups())
        robots.append(Robot(px=px, py=py, vx=vx, vy=vy))

quadrant_robots = [0, 0, 0, 0]

def check_frame(grid, pos):
    width = 0
    height = 0
    row = pos[0]
    col = pos[1]
    while row + height < HEIGHT and grid[row + height][col] == '*':
        height += 1
    while col + width < WIDTH and grid[row][col + width] == '*':
        width += 1
    if height <= 3 or width <= 3:
        return False
    for i in range(width):
        if grid[row + height - 1][col + i] != '*':
            return False
    for i in range(height):
        if grid[row + i][col + width - 1] != '*':
            return False
    return True
    

def check_christmas_tree(grid):
    for i in range(0, HEIGHT - 3):
        for j in range(0, WIDTH - 3):
            if check_frame(grid, (i, j)):
                return True
    return False

def save_grid(grid: list[list[str]]):
    with open('grid.txt', 'w') as f:
        f.writelines([''.join(line) for line in grid])

seconds = 0
while True:
    grid = [[' ' for i in range(WIDTH)] for _ in range(HEIGHT)]
    for robot in robots:
        robot.px = (robot.px + robot.vx) % WIDTH
        if robot.px < 0:
            robot.px = WIDTH + robot.px
        robot.py = (robot.py + robot.vy) % HEIGHT
        if robot.py < 0:
            robot.py = HEIGHT + robot.py
        grid[robot.py][robot.px] = '*'
        quadrant = get_quadrant(robot.px, robot.py)
        if quadrant == -1:
            continue
        quadrant_robots[quadrant] += 1
    seconds += 1
    if check_christmas_tree(grid):
        save_grid(grid)
        break

print(seconds)