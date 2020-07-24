const axios = require('axios')
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 9898
});

let data;
function fetchIndexes(callback) {
    let intervalId = axios.get('https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=1.000001').then(res => {
        // console.log('结果', res)
        callback(res.data.data.diff)
    })
}

wss.broadcast = function broadcast() {
    wss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
            fetchIndexes((data) => { console.log(data); client.send(JSON.stringify(data)) })
            client.send('我是广播')
        }
    })
}

wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`)
    ws.on('message', function (mesg) {
        console.log(typeof mesg)
        // fetchIndexes(sendmsg)

        console.log(`[SERVER] Received: ${mesg}`)
        // ws.send(`ECHO: ${mesg}`, (err)=> {
        //     if(err) {
        //         console.log(`[SERVER] error: ${err}`)
        //     }
        // })
        // ws.send('我是推送')
    })
    wss.broadcast()
})