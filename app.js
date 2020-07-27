const axios = require("axios");
const WebSocket = require("ws");

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
  port: 9898,
});

function fetchIndexes (callback) {
  const url =
    `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=1.000001,0.399006,100.HSI&_=` +
    new Date().getTime();
  axios.get(url).then((res) => {
    callback(res.data.data.diff);
  });
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
          const indexesData = JSON.stringify(data);
          if (tempData != indexesData) {
            ws.send(indexesData);
          }
          tempData = indexesData;
        });
      }, 10000);
    }
  });
});
