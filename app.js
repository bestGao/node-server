const { indexCodes, mockArray } = require('./constants.js')
const axios = require("axios");
const WebSocket = require("ws");

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
  port: 9898  // 9966 // docker时: 9898
});

function fetchIndexes(callback) {
  const curHours = new Date().getHours();
  if (curHours > 15) {
    console.log('成功')
    // 下午三点后模拟数据
    mockArray.forEach(function (dItem) {
      if (Math.random() > 0.5) {
        dItem.f2 = dItem.f2 + Math.random() * 6
        dItem.f3 = dItem.f3 + Math.random() * 3
        dItem.f4 = dItem.f4 + Math.random() * 2
      } else {
        dItem.f2 = dItem.f2 - Math.random() * 7
        dItem.f3 = dItem.f3 + Math.random() * 1.8
        dItem.f4 = dItem.f4 + Math.random() * 2.5
      }
    })
    callback(mockArray)
  } else {
    const url =
      `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=${indexCodes.join(',')}&_=` +
      new Date().getTime();
    axios.get(url).then((res) => {
      callback(res.data.data.diff);
    });
  }
}

let intervalId;
let tempData;
wss.on("connection", function (ws) {
  ws.on("message", function (mesg) {
    console.log("客户端传来的数据：", mesg);
    if (mesg === "jayGao") {
      // 暗号正确
      intervalId = setInterval(function () {
        fetchIndexes((data) => {
          const curTime = new Date().toLocaleTimeString('en-US',{timeZone:"Asia/ShangHai"})
          const originData = { fundArray: data, curTime }
          const indexesData = JSON.stringify(originData);
          if (tempData != indexesData) {
            ws.send(indexesData);
          }
          tempData = indexesData;
        });
      }, 10 * 1000);
    }
  });
});
