/**
 * @name Github
 *
 * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 * `GITHUB_USER=myuser GITHUB_PWD=mypassword node github.js`
 *
 */
// const chromeLauncher = require('chrome-launcher');
// const axios = require('axios');
const puppeteer = require('puppeteer')
// const puppeteer = require('puppeteer-core')
const { load, cut } = require('@node-rs/jieba')
const xlsx = require('xlsx');

const fs = require("fs");
const width = process.env.WIN_WIDTH || 1200;
const height = process.env.WIN_HEIGHT || 1000;
// const user_data_dir = '/checkchan/data/user_data';
// if( !fs.existsSync( user_data_dir ) ) fs.mkdirSync( user_data_dir );

try {
  (async () => {
  const browser = await puppeteer.launch( {headless: false,
    args: ['--no-sandbox', '--disable-se=tuid-sandbox', '--auto-open-devtools-for-tabs' ]})



    // 手动初始化Chrome实例
    // const chrome = await chromeLauncher.launch({
    //   chromeFlags: ['--headless']
    // });
    // const response = await axios.get(`http://localhost:9222/json/version`);
    // const { webSocketDebuggerUrl } = response.data;

    // 使用“browserWSEndpoint”连接实例
    // const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
    // console.info(browser);



    // let opt = {
    //   args: ['--no-sandbox'],
    //   defaultViewport: null,
    //   headless: !(process.env.VDEBUG && process.env.VDEBUG == 'ON'),
    //   timeout:1000+1000*10,
    //   executablePath:process.env.CHROME_BIN||"/usr/bin/chromium-browser",
    // };
    //
    // // if( item.ua )
    // // {
    // //   opt.args.push( `--user-agent=${item.ua}` );
    // // }
    //
    // // 支持proxy
    // if( process.env.PROXY_SERVER )
    // {
    //   opt.args.push( `--proxy-server=${process.env.PROXY_SERVER}` );
    // }
    //
    // // console.log( opt );
    //
    // if( process.env.CHROMIUM_PATH )
    //   opt['executablePath'] = process.env.CHROMIUM_PATH;
    // const browser = await puppeteer.launch(opt);

    // const browser = await puppeteer.launch( {
    //   headless: false,
    //   args: ['--no-sandbox','--start-maximized'],
    //   executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    // })

    const page = await browser.newPage()

    await page.goto('http://www.baidu.com/')
    let keywrok = "小红书"
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
    function keyCount(result) {
      var obj = {};
      var objs = new Set();
      let ress = [];
      for(let i= 0; i < result.length; i++){
        let item = result[i];
        obj[item] = (obj[item] +1 ) || 1;
        objs.add(item);
      }

      for (let item of objs) {
        ress.push({'key':item,'count':obj[item]})
      }
      return ress;
    }

    let ressults = keyCount(result);


    const ra = Array.from(new Set(result))
    // console.log('result:', ra);

    load()
    for(var j=0;j<ra.length;j++){
      let word = cut(ra[j], false)
      resultWord.push(...word)
    }

    let resultWords = keyCount(resultWord);

    let sheet1 = xlsx.utils.json_to_sheet(ressults);
    let sheet2 = xlsx.utils.json_to_sheet(resultWords);

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
    browser.close()
})()
} catch (err) {
  console.error(err)
}
