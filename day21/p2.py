import heapq
import sys
from collections import defaultdict


def find_tile_pos(tile, board):
    for y, row in enumerate(board):
        for x, val in enumerate(row):
            if val == tile:
                return (x, y)
    return (-1, -1)


def is_in_bounds(pos, keypad):
    rows = len(keypad)
    cols = len(keypad[0])
    return 0 <= pos[0] < cols and 0 <= pos[1] < rows


def all_possible_shortest_sequences(from_tile, to_tile, keypad):
    start_pos = find_tile_pos(from_tile, keypad)
    end_pos = find_tile_pos(to_tile, keypad)

    directions = [(0, -1), (0, 1), (-1, 0), (1, 0)]  # Up, Down, Left, Right
    direction_map = {
        (0, -1): '^',
        (0, 1): 'v',
        (-1, 0): '<',
        (1, 0): '>',
    }

    dist = {}
    paths = {}
    pq = []

    for y in range(len(keypad)):
        for x in range(len(keypad[0])):
            if keypad[y][x] != ' ':
                pos = (x, y)
                dist[pos] = float('inf')
                paths[pos] = []

    dist[start_pos] = 0
    paths[start_pos] = [""]

    heapq.heappush(pq, (0, start_pos))

    while pq:
        curr_dist, curr_pos = heapq.heappop(pq)

        neighbours = []

        # Check adjacent tile neighbours
        for d in directions:
            next_pos = (curr_pos[0] + d[0], curr_pos[1] + d[1])
            if is_in_bounds(next_pos, keypad) and keypad[next_pos[1]][next_pos[0]] != ' ':
                neighbours.append((1, next_pos))

        for cost, next_pos in neighbours:
            dist_thru_curr = curr_dist + cost
            if dist_thru_curr < dist[next_pos]:
                dist[next_pos] = dist_thru_curr
                paths[next_pos] = []
                for path in paths[curr_pos]:
                    paths[next_pos].append(path + direction_map[(next_pos[0] - curr_pos[0], next_pos[1] - curr_pos[1])])

                heapq.heappush(pq, (dist[next_pos], next_pos))
            elif dist_thru_curr == dist[next_pos]:
                for path in paths[curr_pos]:
                    paths[next_pos].append(path + direction_map[(next_pos[0] - curr_pos[0], next_pos[1] - curr_pos[1])])

    if end_pos in paths:
        sorted_paths = sorted(paths[end_pos])
        shortest_length = len(sorted_paths[0])
        return [path + 'A' for path in sorted_paths if len(path) == shortest_length]

    return []


def generate_sequence_map(keypad):
    all_chars = ''.join(''.join(row) for row in keypad)
    sequence_map = defaultdict(list)

    for from_tile in all_chars:
        for to_tile in all_chars:
            if from_tile == ' ' or to_tile == ' ':
                continue

            sequence_map[(from_tile, to_tile)] = all_possible_shortest_sequences(from_tile, to_tile, keypad)
            if not sequence_map[(from_tile, to_tile)]:
                sequence_map[(from_tile, to_tile)] = ["A"]

    return sequence_map


def find_cost(seq, cost_map):
    cost = 0
    curr = 'A'
    for char in seq:
        cost += cost_map[(curr, char)]
        curr = char
    return cost


def get_cost_map(num_intermediate_keypads, robot_seq_map, door_seq_map):
    curr_costs = {}
    next_costs = {}
    final_costs = {}

    for key, sequences in robot_seq_map.items():
        curr_costs[key] = len(sequences[0])

    for _ in range(num_intermediate_keypads - 1):
        next_costs.clear()
        for key, sequences in robot_seq_map.items():
            possible_costs = [find_cost(seq, curr_costs) for seq in sequences]
            next_costs[key] = min(possible_costs)
        curr_costs = next_costs.copy()

    for key, sequences in door_seq_map.items():
        possible_costs = [find_cost(seq, curr_costs) for seq in sequences]
        final_costs[key] = min(possible_costs)

    return final_costs


def main():
    if len(sys.argv) != 2:
        return -1

    filename = sys.argv[1]
    with open(filename, 'r') as f:
        codes = [line.strip() for line in f.readlines()]

    door_keypad = [
        "789",
        "456",
        "123",
        " 0A"
    ]
    robot_keypad = [
        " ^A",
        "<v>"
    ]

    robot_seq_map = generate_sequence_map(robot_keypad)
    door_seq_map = generate_sequence_map(door_keypad)
    cost_map = get_cost_map(25, robot_seq_map, door_seq_map)

    print(robot_seq_map)
    print(door_seq_map)
    print(cost_map)

    complexity = 0
    for code in codes:
        complexity += find_cost(code, cost_map) * int(code)

    print(complexity)


if __name__ == '__main__':
    main()
