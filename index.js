const { Worker } = require('worker_threads');
const path = require('path');
const _ =  require("lodash");
let startTime = 1538409725;
let endTime = parseInt(startTime) + 14;
let bar_num = 1;



function fetchData(symbol) {
  let readWorker = new Worker(path.join(__dirname, './workers/read-data.js'));
  let creatDataWorker = new Worker(path.join(__dirname, './workers/create_data.js'));
  var data = [];
  readWorker.on("message", message => {
    // console.log("startTime", startTime)
    // console.log("endTime", endTime)
    data = _.filter(message.data, record => {
      record = JSON.parse(record);
      let timeStamp = parseInt(record.TS2.toString().substring(0,10));
      if (record.sym === symbol && startTime <= timeStamp && timeStamp <= endTime) {
        return record
      }
    })
    creatDataWorker.postMessage({data, bar_num});
    startTime = endTime + 1;
    endTime = parseInt(startTime) + 14;
    bar_num++;
  })
  
  creatDataWorker.on("message", message => {
    console.log(message)
  })

  // readWorker.once("close", message => {
  //   console.log("gsjgh", message)
  // })
}


const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Type a symbol", function(name) {
  setInterval(function() { fetchData(name) }, 15000);
});
