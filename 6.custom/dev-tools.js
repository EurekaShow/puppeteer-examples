// const puppeteer =require('puppeteer-extra');
// const ppUserPrefs =require('puppeteer-extra-plugin-user-preferences');
const puppeteer =require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
// puppeteer.use(ppUserPrefs({
//     userPrefs: {
//         devtools: {
//             preferences: {
//                 currentDockState: '"undocked"'
//             },
//         },
//     }
// }));
(async () => {
    const browser = await puppeteer.launch({
        args: ['--shm-size=1gb'],
        headless: false,
        devtools: true
    })

    const page = await browser.newPage()
    // await page.emulate(iPhone)

    // set the viewport so we know the dimensions of the screen
    await page.setViewport({ width: 800, height: 600 })

    // go to a page setup for mouse event tracking
    await page.goto('https://so.gushiwen.cn/mingjus/default.aspx?page=1&tstr=%E6%80%9D%E5%BF%B5&astr=&cstr=&xstr=')

    // .hide-center
    const types = await page.$$eval('#type1>.sright>a', a => { return a.map(li => li.innerHTML) })
    console.log('Radio values:', types)

    for (const t of types) {
        let i = 1
            while(true) {
                await page.goto('https://so.gushiwen.cn/mingjus/default.aspx?page=' + i.toString() + '&tstr=' + t + '&astr=&cstr=&xstr=')
                const shiju = await page.$$eval('.left>.sons>.cont>a', a => {
                    return a.map(li => li.innerHTML)
                })
                console.log('Radio values:', shiju)
                i++
                const alink = await page.$eval('.pagesright>.amore',lable => lable.getAttribute('href'))
                if(alink==undefined || alink=='' || alink==null){
                    break
                }
            }
            await page.setCacheEnabled(false);
        }
    await browser.close()
})()
