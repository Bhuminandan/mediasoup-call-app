const os = require('os')
const mediasoup = require('mediasoup')

const createWorker = async () => {

    const worker = await mediasoup.createWorker({
        numWorkers: os.cpus().length,
        logLevel: 'debug',
        logTags: [
            // 'info',
            // 'ice',
            // 'dtls',
            // 'rtp',
            // 'srtp',
            // 'rtcp',
            // 'rtx',
            // 'bwe',
            // 'score',
            // 'simulcast',
            // 'svc'
        ],
        rtcMinPort: 30000,
        rtcMaxPort: 40000
    })

    return worker
    
}

module.exports = createWorker