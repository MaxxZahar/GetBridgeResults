const path = require('path');
const getPairData = require('./index');
const writeCSV = require('./utils/utfuncs').writeCSV;

const pairNumber = 107;

const fileName = `formulaMay${pairNumber}`;
const filePath = path.join('./', 'data', `${fileName}.csv`);

(async () => {
    const hands = await getPairData(pairNumber);
    writeCSV(filePath, hands);
})();
