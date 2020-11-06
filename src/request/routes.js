const routes = {
    login: {
        url: '/login',
        method: 'POST',
        guard: (params) => {
            return typeof params.user === 'string'
                && typeof params.password === 'string'
        },
    },
    token: {
        url: '/token',
        method: 'POST',
        stringify: true,
        guard: (params) => {
            return typeof params.refresh_token === 'string'
                && params.grant_type === 'refresh_token'
        },
    },
    accounts: {
        url: '/accounts',
        method: 'GET',
    },
    transactions: {
        url: '/accounts/:acc_number/transactions',
        method: 'GET',
    },
}

module.exports = routes