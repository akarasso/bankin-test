/**
 * @description Pretty log
 * @param {object} accounts Map of bank accounts and transactions 
 */
const formatResult = (accounts) => {
    const result = []
    for (const [ accNumber, account ] of accounts) {
        result.push({
            acc_number: accNumber,
            amount: account.amount,
            transactions: Array.from(account.transactions, ([, value]) => value),
        })
    }
    console.log(JSON.stringify(result, undefined, 4))
}

module.exports = {
    formatResult,
}