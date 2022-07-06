const axios = require('axios').default

let APIKey = null

async function checkStatus(sessionId) {
    try {
        let resp = await axios({
            method: 'post',
            url: `https://session.mockci.cloud/check-status?session_id=${sessionId}`
        })
        return !!resp.data.ready
    }catch(e){
        return false
    }
}

exports.MockCISession = {
    setAPIKey: (key) => APIKey = key,

    checkStatus,

    start: async ({ key, prefab }) => {
        if(!prefab) {
            prefab = {}
        }
        let qs = ''
        let apiKey = key || APIKey
        if (apiKey) {
            qs = `?api_key=${apiKey}`
        }
        let resp = await axios({
            method: 'post',
            url: `https://session.mockci.cloud/start${qs}`,
            data: prefab
        })
        let data = resp.data
        if(!data.ready) {
            for(let i = 0; i < 40; i++) {
                data.ready = checkStatus(data.sessionId)
                if(data.ready) {
                    break
                }
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
            if(!data.ready){
                throw new Error('Something went wrong, session isn\'t ready')
            }
        }
        return data
    },

    end: async (sessionId) => {
        await axios({
            method: 'post',
            url: `https://session.mockci.cloud/end?session_id=${sessionId}`,
        })
    }
}