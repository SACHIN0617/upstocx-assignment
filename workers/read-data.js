'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

let data = [];
let rawdata = fs.createReadStream(path.join(__dirname, '../trades.json'));
const rl = readline.createInterface({
  input: rawdata
});

rl.on('line', (line) => {
  data.push(line);
})

rl.on("close", message => {
  // console.log("gsjha", data)
  // parentPort.on('message', message => {
    parentPort.postMessage({ data });
  // });
})


// const { Worker } = require('worker_threads');

// const worker = new Worker(`
// const { parentPort } = require('worker_threads');
// parentPort.once('message',
//     message => parentPort.postMessage({ pong: message }));  
// `, { eval: true });
// worker.on('message', message => console.log(message));      
// worker.postMessage('ping');  