import React, { useEffect, useState } from 'react'
import createSocketConnection from '../utilities/createSocketConnection'
import ReactPlayer from 'react-player'
import { Device } from 'mediasoup-client';  

const MainVideoPage = () => {

    const [socketState, setSocketState] = useState(null)
    const [localStream, setLocalStream] = useState(null)
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState(null)
    const [isDeviceLoaded, setIsDeviceLoaded] = useState(false)
    const [device, setDevice] = useState(null)
    const [roomName, setRoomName] = useState("room1")
    const [paramsForSendVideoTransport, setParamsForSendVideoTransport] = useState({
        // mediasoup params
        encodings: [
          {
            rid: 'r0',
            maxBitrate: 100000,
            scalabilityMode: 'S1T3',
          },
          {
            rid: 'r1',
            maxBitrate: 300000,
            scalabilityMode: 'S1T3',
          },
          {
            rid: 'r2',
            maxBitrate: 900000,
            scalabilityMode: 'S1T3',
          },
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000
        }
      })
    const [paramsForSentAudioTransport, setParamsForSentAudioTransport] = useState({
      })
    const [deviceSendTransport, setDeviceSendTransport] = useState(null)

  useEffect(() => {
    const socket = createSocketConnection("main-video-page")
    setSocketState(socket)
  }, [])


//   UseEffect to fetch the userMedia
  useEffect(() => {
        const fetchUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setLocalStream(stream)

                const audioTracks = stream.getAudioTracks()[0]
                const videoTracks = stream.getVideoTracks()[0]

                setParamsForSendVideoTransport({
                    ...paramsForSendVideoTransport,
                    appData: { audioTrack: audioTracks, videoTrack: videoTracks }
                })
                setParamsForSentAudioTransport({
                    ...paramsForSentAudioTransport,
                    appData: { audioTrack: audioTracks }
                })

            } catch (error) {
                console.log("ERROR Inside fetchUserMedia: ", error)
            } 
        }
        if (socketState) {
            fetchUserMedia()
        }
    }, [socketState])


    // UseEffect to create or join the room and get the rtpCapabilities
    useEffect(() => {
        const createRoomandGetRtpCapabilities = async () => {
            socketState.emit('createRoom', { roomName }, ({routerRtpCapabilities}) => {
                console.log("Inside the create room and we got the rtpCapabilities", routerRtpCapabilities)
                setRouterRtpCapabilities(routerRtpCapabilities)
            });
        }

        if (socketState) {
            createRoomandGetRtpCapabilities()
        }
    }, [socketState])


    // So now we have rtpCapabilities and we can join the room
    useEffect(() => {
        const joinRoom = async () => {
            socketState.emit('joinRoom', { roomName }, ({rtpCapabilities}) => {
                console.log("Inside the join room and we got the rtpCapabilities", rtpCapabilities)
            });
        }
        if (socketState && routerRtpCapabilities) {
            joinRoom()
        } 
    }, [socketState, routerRtpCapabilities])

    // Now that we have the room created lets create device and call device.load
    useEffect(() => {

        const createAndLoadDevice = async () => {

            try {
                // First lets create the device
                const device = new Device();

                // Next step is to call the device.load
                await device.load({ routerRtpCapabilities });
                setIsDeviceLoaded(true)
                setDevice(device)

                console.log("Deviceloaded successfully")
                
            } catch (error) {
                console.log("ERROR Inside createAndLoadDevice: ", error)
            }

        }
        
        if (routerRtpCapabilities) {
            createAndLoadDevice()
        }
    }, [routerRtpCapabilities])


    // Once we loadded the device successfully we can create the producer
    useEffect(() => {
        const createWebrtcTransport = async () => {
            
            const src = {
                forceTransportCreation: true,
                rtpCapabilities: deviceState.rtpCapabilities
              }
      
            socketState.emit('createProducerTransport', src)


            socketState.on('producerTransportCreated', (params) => {
          
                if (params.error) {
                  console.log("error", params.error)
                }
      
                const { id, iceParameters, iceCandidates, dtlsParameters } = params;
      
      
                const transport = deviceState.createSendTransport({
                  id,
                  iceParameters,
                  iceCandidates,
                  dtlsParameters,
                })
      
                setDeviceSendTransport(transport);
      
                transport.on('connect', ({ dtlsParameters }, callback, errback) => {
      
      
                  socketState.emit('connectProducerTransport', {
                    dtlsParameters,
                  })
      
                  socketState.on('producerTransportConnected', () => {
                    console.log("Inside producerTransportConnected$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                    callback()
                  })
      
                  socketState.on('producerTransportError', (error) => {
                    errback(error)
                  })
                })
      
                transport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
                  socketState.emit('produce', {
                    transportId: transport.id,
                    kind,
                    rtpParameters,
                  })
      
                  socketState.on('producerCreated', (id) => {
      
                    if (id) {
                      console.log("Inside producerCreated, id is >>>>>>>>>>>>>>>>", id)
                      
                    }
                    callback({ id })
                  })
                })
      
                transport.on('connectionstatechange', (state) => {
                  switch (state) {
                    case 'connecting':
                      console.log('connecting<<<<<<<<<<<<')
                      break
                    case 'connected':
                      console.log('connected<<<<<<<<<<<<')
                      break
                    case 'failed':
                      console.log('failed<<<<<<<<<<<<')
                      break
                    case 'disconnected':
                      console.log('disconnected<<<<<<<<<<<<')
                      break
                    default:
                      break
                  }
                })
              })
          }
        if (isDeviceLoaded) {
            createWebrtcTransport()
        } 
    }, [isDeviceLoaded])


  return (
    <div className='w-full'>
        <div>
            <ReactPlayer url={localStream} playing={true} controls={true} width="20%" height="10%" />
        </div>
    </div>
  )
}

export default MainVideoPage