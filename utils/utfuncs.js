const fs = require('fs');

async function writeCSV(path, hands) {
    const wStream = fs.createWriteStream(path);
    for (const hand of hands) {
        const { boardNumber, position, contractLevel, contractSuit, contractAddition, declarer, lead, result, score } = hand;
        let str = `${boardNumber};${position};${contractLevel};${contractSuit};${contractAddition};${declarer};${lead?.suit};${lead?.value};${result};${score}\n`;
        wStream.write(str);
    }
    wStream.end();
}

function getContractsPlayed(hands) {
    const contractsPlayed = {
        east: [0, 0], west: [0, 0], north: [0, 0], south: [0, 0], all: [0, 0]
    };
    for (const hand of hands) {
        if (hand.contractLevel && hand.contractLevel !== 'p') {
            if (hand.position === 'NS') {
                switch (hand.declarer) {
                    case 'N':
                        changeSideStats(contractsPlayed, 'north', hand);
                        changeSideStats(contractsPlayed, 'all', hand);
                        break;
                    case 'S':
                        changeSideStats(contractsPlayed, 'south', hand);
                        changeSideStats(contractsPlayed, 'all', hand);
                        break;
                }
            }
            if (hand.position === 'EW') {
                switch (hand.declarer) {
                    case 'E':
                        changeSideStats(contractsPlayed, 'east', hand);
                        changeSideStats(contractsPlayed, 'all', hand);
                        break;
                    case 'W':
                        changeSideStats(contractsPlayed, 'west', hand);
                        changeSideStats(contractsPlayed, 'all', hand);
                        break;
                }
            }
        }
    }
    return contractsPlayed;
}

function changeSideStats(cp, side, hand) {
    cp[side][1]++;
    if (hand.result >= 0) {
        cp[side][0]++;
    }
}

module.exports = { writeCSV, getContractsPlayed };