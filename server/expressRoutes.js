const fs = require('fs')
const https = require('https')
const express = require('express')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors(
    {
        origin: '*'
    }
))

const certsKeys = {
    key: fs.readFileSync('./certs/cert.key'),
    cert: fs.readFileSync('./certs/cert.crt')
}

const expressServer = https.createServer(certsKeys, app)
const io = socketIo(expressServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})


expressServer.listen(9000, () => {
    console.log('Listening on port 9000')
})


// Routes

// Random string generator function
function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

app.get('/create-room', async (req, res) => {
    try {
        const room = generateRandomString(8); 
        res.status(200).json({ room });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports= {
    io,
    expressServer,
    app
}