let crypto = require('crypto');

function randomInt(upTo){
    if (crypto.randomInt){
        return crypto.randomInt(0, upTo);
    } else {
        return Math.floor(Math.random() * upTo);
    }
}

function n31(n){
    let iterations = 0;
    while (n !== 1n && iterations < 10000){
        if (n% 2n){
            n = n * 3n + 1n;
        } else {
            n = n / 2n;
        }
        iterations++;
    }
    return iterations;
}

let i = 0;
let maxFound = 1000;

const benchmarkPeriod = 10 * 1000; // 10 sec
const benchmarkTime = Date.now() + benchmarkPeriod;
let benchmarkMode = true;

while (true){
    let random1 = BigInt(randomInt(2**32));
    let random2 = BigInt(randomInt(2**32)) * 2n**32n;
    let random3 = BigInt(randomInt(2**32)) * 2n**64n;
    let randomNum = 2n**96n + random1 + random2 + random3;

    for (let j = 0; j<1000; j++){
        let iterationsDone = n31(randomNum);
        if (iterationsDone >= 10000){
            console.log('epic win! Number is found: ', randomNum);
        }
        if (iterationsDone > maxFound){
            if (!benchmarkMode){
                console.log(randomNum, iterationsDone);
            }
            maxFound = iterationsDone;
        }

        randomNum++;
        if (benchmarkMode){
            i++;
        }
    }
    if (benchmarkMode && Date.now() >= benchmarkTime){
        benchmarkMode = false;
        console.log('calculation speed: ', i / (benchmarkPeriod / 1000), ' tries per second');
    }
}
