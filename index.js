const os = require('os');
const crypto = require('crypto');
const {Worker, isMainThread, parentPort} = require('worker_threads');

const CPU_COUNT = os.cpus().length;
const THREAD_COUNT = process.env.USE_THREADS === 'all' ? CPU_COUNT : parseInt(process.env.USE_THREADS) || 1;
const MIN_LENGTH_TO_START = 500;
// const MAX_CHECKED_COLLATZ = 1n; // uncomment if you want to check up to 1
const MAX_CHECKED_COLLATZ = 2n * (10n**21n); // all numbers bellow 2 * 10**21 already checked, so stop if current num is less

if (isMainThread) {
    let bestSolve = MIN_LENGTH_TO_START;
    let benchmarkSum = 0;
    let benchmarkEventsGot = 0;
    console.log(`start with ${THREAD_COUNT} threads`);
    for (let i=0; i<THREAD_COUNT; i++){
        const worker = new Worker(__filename);
        worker.on('message', (msg) => {
            let event = msg.event;
            if (event === 'betterCollatzFound'){
                let {randomNum,iterationsDone} = msg;
                if (iterationsDone > bestSolve){
                    bestSolve = iterationsDone;
                    console.log(randomNum, iterationsDone);
                }
                if (iterationsDone >= 10000){
                    console.log('epic win! Number is found: ', randomNum);
                }
            } else if (event === 'benchmark'){
                let {speed} = msg;
                benchmarkSum += speed;
                benchmarkEventsGot++;
                if (benchmarkEventsGot === THREAD_COUNT){
                    console.log(`calculation speed: ${benchmarkSum} tries per second`);
                }
            }
        });
        worker.on('error', err => {
            console.error('error', err);
        });
        worker.on('exit', code => {
            console.error('worker exited with code: ', code)
        });
    }
} else {
    let i = 0;
    let maxFound = MIN_LENGTH_TO_START;

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
                    parentPort.postMessage({
                        event: 'betterCollatzFound',
                        randomNum,
                        iterationsDone
                    });

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
            parentPort.postMessage({
                event: 'benchmark',
                speed: i / (benchmarkPeriod / 1000),
            });
        }
    }
}

function n31(n){
    let iterations = 0;
    while (n > MAX_CHECKED_COLLATZ && iterations < 10000){
    // while (n !== 1n && iterations < 10000){
        if (n% 2n){
            n = n * 3n + 1n;
        } else {
            n = n / 2n;
        }
        iterations++;
    }
    return iterations;
}

function randomInt(upTo){
    if (crypto.randomInt){
        return crypto.randomInt(0, upTo);
    } else {
        return Math.floor(Math.random() * upTo);
    }
}