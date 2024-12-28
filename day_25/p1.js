const fs = require('fs');

function parse(s) {
    const lock = s[0][0] === "#";
    
    if (lock) {
        let vals = [];
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 7; i++) {
                if (s[i][j] === ".") {
                    vals.push(i);
                    break;
                }
            }
        }
        return [vals, lock];
    }
    
    let vals = [];
    for (let j = 0; j < 5; j++) {
        for (let i = 6; i >= 0; i--) {
            if (s[i][j] === ".") {
                vals.push(6 - i);
                break;
            }
        }
    }
    return [vals, lock];
}

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const lines = data.trim().split("\n\n");
    
    let locks = [];
    let keys = [];
    
    lines.forEach(s => {
        const [vals, lock] = parse(s.split("\n"));
        if (lock) {
            locks.push(vals);
        } else {
            keys.push(vals);
        }
    });

    let ans = 0;
    
    locks.forEach(lock => {
        keys.forEach(key => {
            let good = true;
            for (let j = 0; j < 5; j++) {
                if (lock[j] + key[j] > 7) {
                    good = false;
                    break;
                }
            }
            ans += good;
        });
    });

    console.log(ans);
});
