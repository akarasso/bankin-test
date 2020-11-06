const axios = require('axios')

const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
})

axiosInstance.interceptors.request.use((config) => {
    if (config.url.indexOf(':') > -1) {
        const parts = config.url.split('/')
        config.url = parts.map(part => {
            if (part.startsWith(':')) {
                const key = part.slice(1)
                if (config.params[key]) {
                    const replaceByValue = config.params[key]
                    delete config.params[key]

                    return replaceByValue
                }
            }

            return part
        }).join('/')
    }

    return config
})
  
module.exports = axiosInstance