const getPairData = require('./index');
const getContractsPlayed = require('./utils/utfuncs').getContractsPlayed;
const pairNumbers = require('./tournaments/formulaJuly24/pairNumbers');
const singleNumber = require('./tournaments/singleNumber'); // for testing
const fs = require('fs');
const path = require('path');

const fileName = `formulaJulyContractsPlayed`;
const filePath = path.join('./', 'data', `${fileName}.csv`);

(async () => {
    const ws = fs.createWriteStream(filePath);
    for (const pair of pairNumbers) {
        const hands = await getPairData(pair);
        const cp = getContractsPlayed(hands);
        const str = `${pair};${cp.all[0]};${cp.all[1]};${cp.allPercentage};${cp.meanMade};${cp.medianMade};${cp.meanFailed};${cp.medianFailed}\n`;
        ws.write(str);
    }
    ws.end();
})();