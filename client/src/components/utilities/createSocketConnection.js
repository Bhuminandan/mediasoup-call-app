import io from "socket.io-client"

const createSocketConnection = (roomId) => {

    console.log("roomId", roomId)

    let socket;
    if (socket && socket.connected) {
        return socket;
    } else {

        socket = io.connect("https://localhost:9000")

        socket.on('connection-success', () => {
            socket.emit("joinRoom", roomId)
        })

        return socket;
    }
}


export default createSocketConnection