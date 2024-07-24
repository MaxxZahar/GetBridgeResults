const path = require('path');
const getPairData = require('./index');
const writeCSV = require('./utils/utfuncs').writeCSV;

const pairNumber = 204;

const fileName = `formulaJuly${pairNumber}`;
const filePath = path.join('./', 'data', `${fileName}.csv`);

(async () => {
    const hands = await getPairData(pairNumber);
    writeCSV(filePath, hands);
})();
