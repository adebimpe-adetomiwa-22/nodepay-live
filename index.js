require('dotenv').config();
const puppeteerx = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { connect } = require('puppeteer-real-browser');

// express
const express = require('express');
const port = process.env.PORT || 5000;

const startExress = () => {
    const app = express();
    app.get('/', (req, res) => res.send('The nodepay is now live'));

    app.listen(port);
};

// use middlewares
puppeteerx.use(StealthPlugin());

// useful functions
const wait = (time) =>
    new Promise((resolve) => setTimeout(resolve, time * 1000));

const main = async () => {
    const promise = new Promise(async (resolve) => {
        // const browser = await puppeteerx.launch({ headless: false });
        // const page = await browser.newPage();
        const { browser, page } = await connect({
            headless: true,

            args: [],

            customConfig: {},

            turnstile: true,

            connectOption: {},

            disableXvfb: false,
            ignoreAllFlags: false,
            // proxy:{
            //     host:'<proxy-host>',
            //     port:'<proxy-port>',
            //     username:'<proxy-username>',
            //     password:'<proxy-password>'
            // }
        });

        await page.goto(process.env.NODEPAY_URL);
        await wait(20);

        await page.type(`#${process.env.EMAIL_ID}`, process.env.EMAIL);
        await page.type(`#${process.env.PASSWORD_ID}`, process.env.PASSWORD);
        await page.click(`button[type="${process.env.BUTTON_TYPE}"]`);
        resolve('success');
    });
    return promise;
};

const start = async () => {
    try {
        await main();
        console.log('Page is ready');
        startExress();
    } catch (error) {
        console.log(error);
    }
};

start();
