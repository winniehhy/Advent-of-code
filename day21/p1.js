const fs = require('fs');

function findTilePos(tile, board) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {
            if (board[y][x] === tile) {
                return [x, y];
            }
        }
    }
    return [-1, -1];
}

function isInBounds(pos, keypad) {
    const [x, y] = pos;
    const rows = keypad.length;
    const cols = keypad[0].length;
    return x >= 0 && y >= 0 && x < cols && y < rows;
}

function allPossibleShortestSequences(from, to, keypad) {
    const start_pos = findTilePos(from, keypad);
    const end_pos = findTilePos(to, keypad);
    const dm = {
        '0,-1': '^',
        '0,1': 'v',
        '-1,0': '<',
        '1,0': '>'
    };
    const ds = [
        [0, -1], [0, 1], [1, 0], [-1, 0]
    ];

    const dist = new Map();
    const paths = new Map();
    const pq = [];

    keypad.forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            if (cell !== ' ') {
                const pos = [x, y].toString();
                dist.set(pos, Infinity);
                paths.set(pos, []);
            }
        });
    });

    dist.set(start_pos.toString(), 0);
    paths.set(start_pos.toString(), ['']);
    pq.push([0, start_pos]);

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [curr_dist, curr_pos] = pq.shift();

        const neighbours = ds.map(d => {
            const next = [curr_pos[0] + d[0], curr_pos[1] + d[1]];
            if (isInBounds(next, keypad) && keypad[next[1]][next[0]] !== ' ') {
                return [1, next];
            }
            return null;
        }).filter(Boolean);

        neighbours.forEach(([cost, next_pos]) => {
            const dist_thru_curr = curr_dist + cost;
            const next_key = next_pos.toString();
            const curr_key = curr_pos.toString();

            if (dist_thru_curr < dist.get(next_key)) {
                dist.set(next_key, dist_thru_curr);
                paths.set(next_key, paths.get(curr_key).map(path => path + dm[`${next_pos[0] - curr_pos[0]},${next_pos[1] - curr_pos[1]}`]));
                pq.push([dist_thru_curr, next_pos]);
            } else if (dist_thru_curr === dist.get(next_key)) {
                paths.set(next_key, paths.get(next_key).concat(paths.get(curr_key).map(path => path + dm[`${next_pos[0] - curr_pos[0]},${next_pos[1] - curr_pos[1]}`])));
            }
        });
    }

    const end_key = end_pos.toString();
    const paths_to_end = paths.get(end_key) || [];
    if (paths_to_end.length === 0) return [];

    paths_to_end.sort((a, b) => a.length - b.length);
    const shortest = paths_to_end[0].length;

    return paths_to_end.filter(path => path.length === shortest);
}

function generateSequenceMap(keypad) {
    const sm = new Map();
    const all_chars = keypad.join('').replace(/ /g, '');

    for (const from of all_chars) {
        for (const to of all_chars) {
            sm.set(`${from},${to}`, allPossibleShortestSequences(from, to, keypad) || ['']);
        }
    }

    return sm;
}

function buildDirectionalSequence(code, keypad) {
    let sequence = '';
    let curr = findTilePos('A', keypad);

    for (const c of code) {
        const next = findTilePos(c, keypad);
        sequence += generateMoveSequence(curr, next, keypad);
        curr = next;
    }

    return sequence;
}

function generateMoveSequence(from, to, keypad) {
    let s = '';
    const ds = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const dm = {
        '0,-1': '^',
        '0,1': 'v',
        '-1,0': '<',
        '1,0': '>'
    };

    const h_dist = to[0] - from[0];
    const v_dist = to[1] - from[1];

    const h_dir = h_dist === 0 ? [0, 0] : h_dist > 0 ? [1, 0] : [-1, 0];
    const v_dir = v_dist === 0 ? [0, 0] : v_dist > 0 ? [0, 1] : [0, -1];

    if (dm[h_dir] === '<') {
        s += dm[h_dir].repeat(Math.abs(h_dist));
        s += dm[v_dir].repeat(Math.abs(v_dist));
    } else {
        s += dm[v_dir].repeat(Math.abs(v_dist));
        s += dm[h_dir].repeat(Math.abs(h_dist));
    }

    s += 'A';
    return s;
}

const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const door_keypad = [
    '789',
    '456',
    '123',
    ' 0A'
];
const robot_keypad = [
    ' ^A',
    '<v>'
];

const door_map = generateSequenceMap(door_keypad);
const robot_map = generateSequenceMap(robot_keypad);

let complexity = 0;

input.forEach(code => {
    let sequence = buildDirectionalSequence(code, door_keypad);
    for (let i = 0; i < 2; i++) {
        sequence = buildDirectionalSequence(sequence, robot_keypad);
    }

    console.log(`Code: ${code}`);
    console.log(`Min length: ${sequence.length}`);
    console.log(`Num: ${parseInt(code, 10)}`);

    complexity += sequence.length * parseInt(code, 10);
});

console.log(`Complexity: ${complexity}`);
