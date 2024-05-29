const getPairData = require('./index');
const getContractsPlayed = require('./utils/utfuncs').getContractsPlayed;

(async () => {
    const hands = await getPairData(107);
    console.log(getContractsPlayed(hands));
})();