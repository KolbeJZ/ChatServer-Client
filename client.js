const net = require('net')


   const client = net.createConnection({ port: 5000 }, () => {
    console.log("You're Connected to the server!");
client.setEncoding("utf-8");

  process.stdin.pipe(client);

  client.on("data", (data) => {
    console.log(data);
  });

  client.on("close", () => {
    console.log("Connection Closed");
  });
   });