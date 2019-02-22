const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public')

var app = express()
var server = http.createServer(app)
var io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message')

app.use(express.static(publicPath))

io.on('connection', (socket)=>{
    console.log('New User connected'); 
    
    socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'))
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User joined'))
    // socket.emit('newMessage', {
    //     from: 'cabo',
    //     text: 'hey',
    //     to: 'xd'
    // });

    socket.on('createMessage', (message,callback)=>{
        console.log('created Message: ', message);
        io.emit('newMessage', generateMessage(message.from,message.text))
        callback()
        // socket.broadcast.emit('newMessage',{
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     })
    })
    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage("Admin", coords.lat, coords.long))
    })    

    socket.on('disconnect', (socket)=>{
        console.log('client disconnected'); 
    })
})

server.listen(port, ()=>{
    console.log(`on port ${port}`);
})