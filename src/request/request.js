const { stringify } = require('querystring')
const axiosInstance = require('./axios')

const getPayload = (route, params) => route.stringify !== true
    ? params
    : stringify(params)

const getContentType = (route) => route.stringify === true
    ? 'application/x-www-form-urlencoded'
    : 'application/json'

const getBaseHeaders = (route) => {
    if (route.method === 'POST') {
        const contentType = getContentType(route)

        return {
            'Content-Type': contentType,
        }
    }

    return {}
}

const request = async (route, params, partialHeaders) => {
    if (route.guard && !route.guard(params)) {
        throw new Error(`[Request] Failed to validate parameters ${ route.url }`)
    }
    const headers = Object.assign(
        getBaseHeaders(route),
        partialHeaders,
    )
    try {
        if (route.method === 'GET') {
            const response = await axiosInstance.get(
                route.url,
                {
                    params,
                    headers,
                }
            )

            return response
        }
        if (route.method === 'POST') {
            const payload = getPayload(route, params)
            const response = await axiosInstance.post(
                route.url,
                payload,
                {
                    headers,
                }
            )

            return response
        }
    } catch(error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        }

        throw error
    }
}

const createPaginatedRequest = (
    route,
    headers = {},
    params = {},
    start = 1,
) => {
    params.page = start
    return {
        [Symbol.asyncIterator]() {
            return {
                next: async () => {
                    if (params.page === undefined) {
                        return { done: true }
                    }
                    const response = await request(route, params, headers)
                    params.page = response.data.link.next === null
                        ? undefined
                        : params.page + 1

                    return {
                        value: response.data,
                        done: false,
                    }
                },
            }
        }
    }
}

module.exports = {
    request,
    createPaginatedRequest,
}