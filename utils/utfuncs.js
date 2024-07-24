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

async function writePBN(path, deals) {
    const wStream = fs.createWriteStream(path, { flags: 'a' });
    await createPBNWithHeader(path, wStream);
    for (const i in deals) {
        const { dealer, vulnerability, deal } = deals[i];
        let str = `
[Event "Event"]
[Board "${Number(i) + 1}"]
[Dealer "${dealer}"]
[Vulnerable "${vulnerability}"]
[Deal "${deal}"]
`;
        wStream.write(str);
    }
    wStream.end();
}

function getContractsPlayed(hands) {
    const contractsPlayed = {
        east: [0, 0, 0, 0], west: [0, 0, 0, 0], north: [0, 0, 0, 0], south: [0, 0, 0, 0], all: [0, 0, 0, 0], scoresMade: [], scoresFailed: []
    };
    for (const hand of hands) {
        if (hand.contractLevel && hand.contractLevel !== 'p') {
            if (hand.position === 'NS') {
                switch (hand.declarer) {
                    case 'N':
                        changeSideStats(contractsPlayed, 'north', hand);
                        break;
                    case 'S':
                        changeSideStats(contractsPlayed, 'south', hand);
                        break;
                }
            }
            if (hand.position === 'EW') {
                switch (hand.declarer) {
                    case 'E':
                        changeSideStats(contractsPlayed, 'east', hand);
                        break;
                    case 'W':
                        changeSideStats(contractsPlayed, 'west', hand);
                        break;
                }
            }
        }
    }
    contractsPlayed['allPercentage'] = (contractsPlayed.all[0] * 100 / contractsPlayed.all[1]).toFixed(2) + '%';
    contractsPlayed['meanMade'] = (contractsPlayed.all[2] / contractsPlayed.all[0]).toFixed(2) + '\'';
    contractsPlayed['medianMade'] = median(contractsPlayed.scoresMade).toFixed(2) + '\'';
    contractsPlayed['meanFailed'] = (contractsPlayed.all[3] / (contractsPlayed.all[1] - contractsPlayed.all[0])).toFixed(2) + '\'';
    contractsPlayed['medianFailed'] = median(contractsPlayed.scoresFailed).toFixed(2) + '\'';
    return contractsPlayed;
}

function changeSideStats(cp, side, hand) {
    cp[side][1]++;
    cp.all[1]++;
    if (hand.result >= 0) {
        cp[side][0]++;
        cp.all[0]++;
        cp[side][2] += hand.score;
        cp.all[2] += hand.score;
        cp.scoresMade.push(hand.score);
    } else {
        cp[side][3] += hand.score;
        cp.all[3] += hand.score;
        cp.scoresFailed.push(hand.score);
    }
}

function median(data) {
    const n = data.length;
    data = data.sort((a, b) => a - b);
    return n % 2 ? data[Math.floor(n / 2)] : (data[(n / 2) - 1] + data[n / 2]) / 2;
}

async function createPBNWithHeader(path, wStream) {
    if (!fs.existsSync(path)) {
        const header = `
% PBN 1.0
[Generator "GetBridgeResults"]

`;
        wStream.write(header);
    }
}

module.exports = { writeCSV, getContractsPlayed, writePBN };