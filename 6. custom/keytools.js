/**
 * @name Github
 *
 * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 * `GITHUB_USER=myuser GITHUB_PWD=mypassword node github.js`
 *
 */
const puppeteer = require('puppeteer')
const nodejieba = require("nodejieba");
try {
  (async () => {
  const browser = await puppeteer.launch( {headless: false,
    args: ['--no-sandbox', '--disable-se=tuid-sandbox', '--auto-open-devtools-for-tabs' ]})
  const page = await browser.newPage()

    await page.goto('http://www.baidu.com/')
    let keywrok = "小红书"
    let result = []
    let resultWord = []
    const input_area = await page.$("#kw");
    for (var i=0;i<26;i++) {
      await input_area.type(keywrok + String.fromCharCode(65 + i),{ delay: 100 });
      await page.waitForSelector('#form');
      const alltext = await page.$$eval('#form > div > ul > li',
        anchors => {
          return anchors.map(anchor => anchor.innerHTML.replace('<b>', '').replace('</b>', ''))
        })
      result.push(...alltext)
      for(var j=0;j<alltext.length;j++){
        let word = nodejieba.cut(alltext[j]);
        resultWord.push(...word)
      }
      await page.waitFor(5000)
      await input_area.click({ clickCount: 3 })
    }
    const ra = Array.from(new Set(result))
    console.log('result:', ra);
    const raW = Array.from(new Set(resultWord))
    console.log('resultWord:', raW);

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
