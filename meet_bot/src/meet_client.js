const { MeetBot } = require("./meet_bot")
const client = new MeetBot();
const { io } = require("socket.io-client");



async function command(client, message) {
    if (message.content.startsWith("!quote")) {
        await client.sendMessage(`${message.author} said, "${message.content.replace("!quote ", "")}" at ${message.time}`);
    }
}

const socket = io('http://localhost:3000')
// client-side
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('toggle_mic', async (data) => {
    console.log('Called Toggle mic function')
    await client.toggleMic()
})

// end_meeting
socket.on('end_meeting', async (data) => {
    console.log('Called end meeting function')
    await client.endMeeting()
    socket.emit('meeting_actions', `Meeting has ended`)
})

// message all
socket.on('message_all', async (data) => {
    console.log('Broadcasting message')
    console.log(data)
    await client.sendMessage(data)
})

socket.on('toggle_camera', async (data) => {
    await client.toggleVideo()
})
socket.on('meet_start', async (data) => {
    console.log(data);
    config = { link: data, email: '<replace_with_email>', pass: '<replace_with_password>' };
    //(async () => {

    client.once('ready', async () => {
        console.log('ready')
        socket.emit('meeting_actions', 'Meeting has started')
    })

    await client.login(config)

    await client.on('message', async (message) => {
        command(client, message);
    })

    await client.on('memberJoin', async (member) => {
        console.log(`${member} Joined`)
        socket.emit('meeting_actions', `${member} Joined`)
        //await client.sendMessage(`Welcome, ${member.name}!`);
    })

    await client.on('memberLeave', async (member) => {
        console.log(`${member} Leaved`)
        socket.emit('meeting_actions', `${member} Leaved`)

    })

    //})()
})
