const routes = require('./request/routes')
const { request } = require('./request/request')

/**
 * @description Request refresh token
 * @param {object} credentials contains two keys (user: string, password: string)
 */
const getRefreshToken = async (credentials) => {
    const { CLIENT_ID, CLIENT_SECRET } = process.env
    const authToken = new Buffer.from(`${ CLIENT_ID }:${ CLIENT_SECRET }`, 'utf8')
        .toString('base64')
    const authorization = `Basic ${ authToken }`
    const headers = { authorization }
    const response = await request(routes.login, credentials, headers)

    return response.data.refresh_token
}

/**
 * @description Consume refresh token to produce access token
 * @param {string} refreshToken Token used to get access token
 */
const getAccessToken = async (refreshToken) => {
    const params = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    }
    const response = await request(routes.token, params)

    return response.data.access_token
}

module.exports = {
    getRefreshToken,
    getAccessToken,
}