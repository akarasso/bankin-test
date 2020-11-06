const routes = require('./request/routes')
const { createPaginatedRequest } = require('./request/request')
const logger = require('./logger')

/**
 * @description Convert api response to internal version
 * @param {object} transaction Initial transaction from api
 */
const transactionFormatter = (transaction) => ({
    label: transaction.label,
    amount: transaction.sign === 'DBT'
        ? `-${ transaction.amount }`
        : `${ transaction.amount }`,
    currency: transaction.currency,
})

/**
 * @description Fetch all transaction from one account
 * @param {object} accounts Map of accounts
 * @param {string} accessToken Token to be use to authenticate request
 */
const fetchTransactions = async (accounts, accessToken) => {
    for (const [, account] of accounts) {
        try {
            const paginateRequest = createPaginatedRequest(
                routes.transactions,
                {
                    'authorization': `Bearer ${ accessToken }`,
                    'Content-Type': 'application/json',
                },
                {
                    acc_number: account.acc_number,
                },
            )
            for await (const response of paginateRequest) {
                response.transactions.forEach(trsc => {
                    account.transactions.set(trsc.id, transactionFormatter(trsc))
                })
            }
        } catch(err) {
            logger.error(`[FetchTransactions]: ${ account.acc_number }`, err)
        }
    }
}

module.exports = {
    fetchTransactions,
}