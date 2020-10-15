const amqp = require("amqplib");
async function producer() {
  // 1. 创建链接对象
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: '192.168.1.200',
    port: 5672,
    username: 'rabbit',
    password: 'hangtian123',
    heartbeat: 1000,
  });
  // 获取通道
  const channel = await connection.createChannel();
  // 声明参数
  const exchangeName = "direct_exchange_name";
  const routingKey = "direct_routingKey";

  const msg = {
    cid: 0,
    plate_number: `浙B888`,
    plate_number_type: '黄色',
    "charging_car_type_id": 14,
    "car_length": "479",
    "white_list": 1,
    vehicle_lane_id: 1, // 通道ID
    "in_parking_date": 1602679530,
    "out_parking_date": 1602679630,
    "amount": 0,
    parking_flow_id: 2,
    needMark: false,
    paid: true
  };
  // 交换机
  await channel.assertExchange(exchangeName, "direct", {
    durable: false,
  });
  // 发送消息
  setInterval(async () => {
    await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(msg)));
    msg.cid += 1
    msg.amount = (Math.random() * 100).toFixed()
    msg.plate_number = `浙${(Math.random() * 1000).toFixed()}`
    msg.vehicle_lane_id = msg.vehicle_lane_id == 2 ? 1 : 2
  }, 6000);
  // 关闭链接
  // await channel.close();
  // await connection.close();
}
producer();
