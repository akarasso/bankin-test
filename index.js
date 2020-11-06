require('dotenv').config()
const {
    getRefreshToken,
    getAccessToken,
} = require('./src/auth')
const { fetchAccounts } = require('./src/accounts')
const { fetchTransactions } = require('./src/transactions')
const { formatResult } = require('./src/print')
const logger = require('./src/logger')

const main = async () => {
    const userCredentials = {
        user: 'BankinUser',
        password: '12345678',
    }

    try {
        const refreshToken = await getRefreshToken(userCredentials)
        const accessToken = await getAccessToken(refreshToken)
        const accounts = await fetchAccounts(accessToken)
        await fetchTransactions(accounts, accessToken)
        formatResult(accounts)
    } catch(err) {
        logger.error(`[BANKIN-API] Cannot fetch all data`, err)
    }
}

main()