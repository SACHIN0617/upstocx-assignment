'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline')

const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

let data = [];

parentPort.on('message', message => {
  for (let i = 0; i < message.data.length; i++) {
    let record = JSON.parse(message.data[i]);
    let firstRecord = JSON.parse(message.data[0]);
    data.push(
      {
        "event": "ohlc_notify",
        "symbol": record.sym, 
        "bar_num": message.bar_num,
        "o": firstRecord.P,
        "h": getHighValue(record, i),
        "l": getLowValue(record, i),
        "c": data.length - 1 === message.data.length ? record.P : 0.0,
        "volume": getVolume(record, i)
      }
    )
  }
  data = data[data.length - 1] || {}
  parentPort.postMessage(data)

  function getHighValue(currentRecord, i) {
    return i -1 >= 0 && currentRecord.P < data[i-1].h ? data[i-1].h : currentRecord.P;
  }
  
  function getLowValue(currentRecord, i) {
    return i -1 >= 0 && currentRecord.P > data[i-1].l ? data[i-1].l : currentRecord.P;
    
  }
  
  function getVolume(currentRecord, i) {
    return i -1 >= 0 ? data[data.length -1].volume + currentRecord.Q : currentRecord.Q
  }
});



