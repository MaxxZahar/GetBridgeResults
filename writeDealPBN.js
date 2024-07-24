const getDealPBN = require('./getDealpbn');
const writePBN = require('./utils/utfuncs').writePBN;
const getSessions = require('./tournaments/formulaJuly24/getSessions');
const fs = require('fs');
const path = require('path');

const fileName = `formulaJuly24`;
let filePath = path.join('./', 'data', 'pbn', `${fileName}.pbn`);

(async () => {
    const sessions = getSessions().paths;
    const numberOfDealsPerSession = getSessions().numberOfDealsPerSession;
    const deals = [];
    for (let i = 0; i < sessions.length; i++) {
        for (let j = 0; j < numberOfDealsPerSession[i]; j++) {
            dealPath = path.join(sessions[i], `d${j + 1}p.php`);
            const deal = await getDealPBN(dealPath);
            deals.push(deal);
        }
    }
    writePBN(filePath, deals);
})();
