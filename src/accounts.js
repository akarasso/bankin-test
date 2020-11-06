const routes = require('./request/routes')
const { createPaginatedRequest } = require('./request/request')

/**
 * @description Fetch all accounts from client
 * @param {string} accessToken used to authenticate request
 */
const fetchAccounts = async (accessToken) => {
    const paginateRequest = createPaginatedRequest(
        routes.accounts,
        {
            'authorization': `Bearer ${ accessToken }`,
        },
    )
    const mapAccounts = new Map()
    for await (const response of paginateRequest) {
        response.account.forEach(act => {
            if (!mapAccounts.has(act.acc_number)) {
                mapAccounts.set(act.acc_number, {
                    ...act,
                    transactions: new Map(),
                })
            }
        })
    }

    return mapAccounts
}

module.exports = {
    fetchAccounts,
}