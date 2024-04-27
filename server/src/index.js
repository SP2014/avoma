const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('meet_start', (data) => {
        socket.broadcast.emit('meet_start', data);
    })

    socket.on('toggle_mic', (data) => {
        socket.broadcast.emit('toggle_mic', data);
    })

    socket.on('end_meeting', (data) => {
        socket.broadcast.emit('end_meeting', data)
    })

    socket.on('message_all', (data) => {
        socket.broadcast.emit('message_all', data)
    })

    socket.on('toggle_camera', (data) => {
        socket.broadcast.emit('toggle_camera', data);
    })

    socket.on('meeting_actions', (data) => {
        console.log(data)
        socket.broadcast.emit('meeting_actions', data)
    })
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
