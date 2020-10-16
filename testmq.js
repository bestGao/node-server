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
  const exchangeName = "real_time_charging";
  const routingKey = "direct_routingKey";

  const msg = {
    "parking_order_id": 12, // 停车记录ID
    "parking_flow_id": 2,
    "vehicle_lane_id": 1,
    "cid": 0,
    "plate_number": `浙B888`,
    "plate_number_type": '黄绿色',
    "charging_car_type_id": 14,
    "car_length": 479,
    "white_list": 1,
    "in_parking_date": 16026791138,
    "out_parking_date": 16026795138,
    "amount": 0,
    replenish_flag: 1,
    status: 'finish'
  };
  // 交换机
  await channel.assertExchange(exchangeName, "fanout", {
    durable: false,
  });
  // 发送消息
  setInterval(async () => {
    await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(msg)));
    msg.cid += 1
    msg.amount = (Math.random() * 100).toFixed()
    msg.plate_number = `浙${(Math.random() * 1000).toFixed()}`
    msg.vehicle_lane_id = msg.vehicle_lane_id == 1 ? 2 : 1
    msg.status = msg.status === 'unpay' ? 'finish' : 'unpay'
    msg.out_parking_date = msg.out_parking_date + 10
    msg.replenish_flag = msg.vehicle_lane_id === 2 ? 1 : 0
  }, 1000);
  setTimeout(() => {
    msg.replenish_flag = msg.replenish_flag ? 0 : 1
  }, 99999999);
  // 关闭链接
  // await channel.close();
  // await connection.close();
}
producer();
