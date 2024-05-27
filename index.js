const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://spb.bridgesport.ru/A6/240525/240525s1/p206h.php');
    await page.setViewport({ width: 1080, height: 1024 });
    const tableHandles = await page.$$('.allbrd tr');
    const hands = [];
    console.log(tableHandles.length);
    for (let i = 1; i < tableHandles.length; i++) {
        const hand = {};
        try {
            const boardNumber = await page.evaluate(el =>
                el.querySelectorAll('td')[0].querySelector('a').textContent
                , tableHandles[i]);
            const position = await page.evaluate(el =>
                el.querySelectorAll('td')[1].textContent
                , tableHandles[i]);
            const contractLevel = await page.evaluate(el =>
                el.querySelectorAll('td')[2].textContent
                , tableHandles[i]);
            let contractSuit;
            let contractAddition = '', declarer = '', leadCardValue = ''; leadCardSuit = '';
            let result = ''; let score;
            if (contractLevel[0].toLocaleLowerCase() !== 'p') {
                if (contractLevel[1].toLocaleLowerCase() !== 'n') {
                    contractSuit = await page.evaluate(el =>
                        el.querySelectorAll('td')[2].querySelector('img').getAttribute('src')
                        , tableHandles[i]);
                    contractSuit = contractSuit.split('/')[2].split('.')[0];
                } else {
                    contractSuit = 'nt';
                }
                declarer = await page.evaluate(el =>
                    el.querySelectorAll('td')[3].textContent
                    , tableHandles[i]);
                leadCardSuit = await page.evaluate(el =>
                    el.querySelectorAll('td')[4].querySelector('img').getAttribute('src')
                    , tableHandles[i]);
                leadCardSuit = leadCardSuit.split('/')[2].split('.')[0];
                leadCardValue = await page.evaluate(el =>
                    el.querySelectorAll('td')[4].textContent.trim()
                    , tableHandles[i]);
                result = await page.evaluate(el =>
                    el.querySelectorAll('td')[5].textContent.trim()
                    , tableHandles[i]);
            }
            if (new RegExp('xx').test(contractLevel)) {
                contractAddition = 'xx';
            } else if (new RegExp('x').test(contractLevel)) {
                contractAddition = 'x';
            }
            score = await page.evaluate(el =>
                el.querySelectorAll('td')[7].textContent.trim()
                , tableHandles[i]);
            hand['boardNumber'] = boardNumber;
            hand['position'] = position;
            hand['contractLevel'] = contractLevel[0];
            hand['contractSuit'] = contractSuit;
            hand['contractAddition'] = contractAddition;
            hand['declarer'] = declarer;
            hand['lead'] = {
                suit: leadCardSuit,
                value: leadCardValue
            };
            hand['result'] = resultToNumber(result);
            hand['score'] = Number(score.replaceAll(',', '.'));
        } catch (err) {
            console.log(err.message);
        }
        hands.push(hand);
    }
    console.log(hands);
    await browser.close();
})();

function resultToNumber(result) {
    if (result === '=') return 0;
    return Number(result);
}