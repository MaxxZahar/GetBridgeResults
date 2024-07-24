const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function getDealPBN(deal) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(deal);
    const dealHandles = await page.$$('.deal tr');
    const dealer = await page.evaluate(el => el.querySelectorAll('td')[0].querySelector('b').textContent.trim().at(-1), dealHandles[0]);
    const vulnerability = await page.evaluate(el => el.querySelectorAll('td')[2].querySelector('b').textContent.trim().slice(5).trim(), dealHandles[0])
    let north = [], south = [], west = [], east = [];
    for (let i = 1; i < 5; i++) {
        north.push(await page.evaluate(el => el.querySelectorAll('td')[1].textContent.trim(), dealHandles[i]));
    }
    for (let i = 5; i < 9; i++) {
        // console.log(`Current iteration: ${i}`);
        west.push(await page.evaluate(el => el.querySelectorAll('td')[0].textContent.trim(), dealHandles[i]));
        if (i === 5) {
            east.push(await page.evaluate(el => el.querySelectorAll('td')[2].textContent.trim(), dealHandles[i]));
        } else {
            east.push(await page.evaluate(el => el.querySelectorAll('td')[1].textContent.trim(), dealHandles[i]));
        }
    }
    for (let i = 9; i < 13; i++) {
        south.push(await page.evaluate(el => el.querySelectorAll('td')[1].textContent.trim(), dealHandles[i]));
    }
    north = north.join('.').replaceAll('10', 'T').replaceAll('--', '');
    west = west.join('.').replaceAll('10', 'T').replaceAll('--', '');
    east = east.join('.').replaceAll('10', 'T').replaceAll('--', '');
    south = south.join('.').replaceAll('10', 'T').replaceAll('--', '');
    const dealStr = `N:${north} ${east} ${south} ${west}`;
    await browser.close();
    return { dealer, vulnerability, deal: dealStr };
}

module.exports = getDealPBN;
