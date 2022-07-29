/**
 * @name Github
 *
 * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 * `GITHUB_USER=myuser GITHUB_PWD=mypassword node github.js`
 *
 */
const puppeteer = require('puppeteer')
const { load, cut } = require('@node-rs/jieba')
const xlsx = require('xlsx');
try {
  (async () => {
  const browser = await puppeteer.launch( {headless: false,
    args: ['--no-sandbox', '--disable-se=tuid-sandbox', '--auto-open-devtools-for-tabs' ]})
  const page = await browser.newPage()

    await page.goto('http://www.baidu.com/')
    let keywrok = "小红书去水印"
    let result = []
    let resultWord = []
    const input_area = await page.$("#kw");
    // loadDict(fs.readFileSync(...))
    // loadTFIDFDict(fs.readFileSync(...))
    for (var i=0;i<26;i++) {
      await input_area.type(keywrok + String.fromCharCode(97 + i),{ delay: 100 });
      await page.waitForSelector('#form');
      const alltext = await page.$$eval('#form > div > ul > li',
        anchors => {
          return anchors.map(anchor => anchor.innerHTML.replace('<b>', '').replace('</b>', ''))
        })
      result.push(...alltext)
      await page.waitFor(1000)
      await input_area.click({ clickCount: 3 })
    }

    const ra = Array.from(new Set(result))
    // console.log('result:', ra);

    load()
    for(var j=0;j<ra.length;j++){
      let word = cut(ra[j], false)
      resultWord.push(...word)
    }

    const raW = Array.from(new Set(resultWord))
    // console.log('resultWord:', raW);

    let x1 = ra.map(x=>new Array(x))
    console.log(x1)
    let x2 = raW.map(x=>new Array(x))
    console.log(x2)

    let sheet1 = xlsx.utils.aoa_to_sheet(x1);
    let sheet2 = xlsx.utils.aoa_to_sheet(x2);

    let workBook = {
      SheetNames: ['提示关键词','关键词分词'],
      Sheets: {
        '提示关键词': sheet1,
        '关键词分词':sheet2
      }
    };

    xlsx.writeFile(workBook, './keylist-'+keywrok+'.xlsx');

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
