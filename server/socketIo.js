const io =  require('./expressRoutes').io;
const mediasoup = require('mediasoup');
const config = require('./config');


let worker
let rooms = {}          // { roomName1: { Router, rooms: [ socketId1, ... ] }, ...}
let peers = {}          // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
let transports = []     // [ { socketId1, roomName1, transport, consumer }, ... ]
let producers = []      // [ { socketId1, roomName1, producer, }, ... ]
let consumers = []      // [ { socketId1, roomName1, consumer, }, ... ]


const createWorker = async () => {

    worker = await mediasoup.createWorker({
        numWorkers: config.mediasoup.numWorkers,
        logLevel: config.mediasoup.worker.logLevel,
        logTags: config.mediasoup.worker.logTags,
        rtcMinPort: config.mediasoup.worker.rtcMinPort,
        rtcMaxPort: config.mediasoup.worker.rtcMaxPort
    })

    worker.on('died', () => {
        console.error('mediasoup worker died, exiting in 2 seconds... [pid: ' + worker.pid + ']');
        setTimeout(() => process.exit(1), 2000);
    });

    console.log('Created mediasoup worker [pid: ' + worker.pid + ']');

    return worker
}

createWorker();


io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

      socket.on('createRoom', async ({ roomName }, callback) => {

        router1 = await createRoom(roomName, socket.id)

        // call callback from the client and send back the rtpCapabilities
        callback({ routerRtpCapabilities: router1.rtpCapabilities })
      })
      // Inside the 'joinRoom' function
    
      socket.on('joinRoom', async ({ roomName }, callback) => {
  
         console.log(" 1. (Join Room) Room is created with RoomName >>>>>>>>>",  roomName);
  
        router1 = await createRoom(roomName, socket.id)
  
    
        peers[socket.id] = {
          socket,
          roomName,           
          transports: [],
          producers: [],
          consumers: [],
          peerDetails: {
            name: '',
            isAdmin: false,   
          }
        }
    
        // get Router RTP Capabilities
        const rtpCapabilities = router1.rtpCapabilities
    
        // call callback from the client and send back the rtpCapabilities
        callback({ rtpCapabilities })
      })


      socket.on('createProducerTransport', async ({ src }) => {

        const { forceTransportCreation, rtpCapabilities } = src


        

      })
})

    const createRoom = async (roomName, socketId) => {

        // worker.createRouter(options)
        // options = { mediaCodecs, appData }
        // mediaCodecs -> defined above
        // appData -> custom application data - we are not supplying any
        // none of the two are required

        let  router1
        let peers = []
        if (rooms[roomName]) {
        router1 = rooms[roomName].router
        peers = rooms[roomName].peers || []
        } else {

            console.log("Inside the create room function", config.mediasoup.router.mediaCodecs);
            console.log("worker", worker);
            const mediaCodecs = config.mediasoup.router.mediaCodecs;
            router1 = await worker.createRouter({ mediaCodecs });
        }
        

        rooms[roomName] = {
        router: router1,
        peers: [...peers, socketId],
        }


        console.log("rooms", rooms)
        console.log("peers", peers)

        return router1
    }
