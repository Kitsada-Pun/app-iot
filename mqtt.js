const mqtt = require('mqtt')
 const client  = mqtt.connect('mqtt://broker.emqx.io:1883', { 
//const client  = mqtt.connect('mqtt://10.30.11.207:1883', { 
 username: 'user1',
 password: 'pass1',
})
let i = 0
client.on('connect', function () {
  console.log('connected')
  client.subscribe('status1')
  setInterval(() => {
    console.log('publish...')
    let nodeId = ('' + Math.floor(Math.random() * 10)).padStart(4, '0') // 0000-0009
    let relay = ('' + Math.floor(Math.random() * 4)) // 0 - 3
    let state = ('' + Math.floor(Math.random() * 2)) // 0 - 1
    msg = relay + '=' + state
    console.log('status' + nodeId, msg)
    //client.publish('status' + nodeId, msg)
    client.publish('status', 'Kitsada')
    client.publish('temp1','45')
    client.publish('temp2','60')
    i++
  }, 1000)
})
 client.on('message', (topic, message) => {
  // message is Buffer
  let msg =  message.toString()  // 
  console.log('topic=',topic)    //    0       1    2
  console.log('message=',msg)  // {'sensor1','30','69'}
  console.log('msg:',msg)
  let data = msg.split(',')
  console.log('data:',data)
  console.log('data[1]',data[1])
  if (topic == 'status') {
    console.log('status=', message.toString())
  } else {
    console.log('topic=', topic)
    console.log('msg=', message.toString())
  }
})