/**
 * @name Github
 *
 * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 * `GITHUB_USER=myuser GITHUB_PWD=mypassword node github.js`
 *
 */
const puppeteer = require('puppeteer')
try {
  (async () => {
  const browser = await puppeteer.launch( {headless: false,
    args: ['--no-sandbox', '--disable-se=tuid-sandbox', '--auto-open-devtools-for-tabs' ]})
  const page = await browser.newPage()

    await page.goto('http://www.baidu.com/')
    let keywrok = "小红书"
    // for (var i=0;i<26;i++){
    let i = 3
    const input_area =await page.$("#kw");
    await input_area.type(keywrok+String.fromCharCode(65+i));
    await page.waitForSelector('#form');
    const alltext = await page.$$eval('#form > div > ul > li',
      anchors => {
      return anchors.map(anchor => anchor.innerHTML.replace('<b>','').replace('</b>',''))
    })
    console.log('alltext:', alltext);

  // await page.goto('http://www.bing.com/')
  // let keywrok = "小红书"
  // // for (var i=0;i<26;i++){
  //   let i = 2
  //   const input_area =await page.$(".b_searchbox");
  //   await input_area.type(keywrok+String.fromCharCode(65+i));
  //   const alltext = await page.$$eval('.sa_drw > li', el => el.query);
  //   console.log('alltext:', alltext);
  // // }

})()
} catch (err) {
  console.error(err)
}
