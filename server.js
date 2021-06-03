const net = require('net')
const fs = require('fs')

let clients = []
let newClientId = 1
fs.writeFile('./chat.log', '', () => {})
let server = net.createServer(client => {
    client.id = `Client-${newClientId}` 
    newClientId++
    clients.push(client) 
    fs.appendFile('./chat.log', `${client.id} has joined the chat. \n`, () => {})
    console.log('\n' + 'A new client has arrived.')
    console.log(`Number of clients: ${clients.length}` + '\n')

    broadcast(`${client.id} has joined the chat! \n`, client)
    
    client.write('\n' + 'Hello ' + client.id + '\n' + 'Welcome to the chatroom!' + '\n') 
 
    client.on('data', data => {
        let dataString = data.toString()
        let dataArray = dataString.split(' ')
        if (dataArray[0] == '/w') {
            if (!dataArray[2]) {
                client.write('Not enough Arguments. Try again.')
            } else {
                let reciever = clients.filter(x => x.id == dataArray[1])[0]
                } if (reciever) {
                    message = dataArray.slice(2, dataArray.length).join(' ')
                    reciever.write(`Whisper from ${client.id}: ${message}\n`)
                    fs.appendFile('./chat.log', `Whisper from ${client.id} to ${reciever.id}: ${message}\n`, () => {})
                    console.log(`Whisper from ${client.id} to ${reciever.id}: ${message}\n`)
                }
            }
        else {
            broadcast(`\n${client.id}: ${dataString}\n`, client)
            fs.appendFile('./chat.log', `${client.id}: ${dataString}\n`, () => {})
        }
        
    });

    client.on('end', () => {
        broadcast(`${client.id} has left the chat. \n`, client)
        clients.splice(clients.indexOf(client), 1); 
        console.log(`Number of clients: ${clients.length}` + '\n')
        fs.appendFile('./chat.log', `${client.id} has left the chat. \n`, () => {})
    })

    function broadcast(message, sender) {
        clients.forEach(x => {
            if (x === sender) return;
            x.write(message)
        })
        console.log(message)
    }
})
process.stdin.on('data', data => {
    clients.forEach(x => {
        x.write(`Server: ${data}`)
    })
    fs.appendFile('./chat.log', `Server: ${data}`, () => {})
})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})