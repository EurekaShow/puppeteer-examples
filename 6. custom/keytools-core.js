/**
 * @name Github
 *
 * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 * `GITHUB_USER=myuser GITHUB_PWD=mypassword node github.js`
 *
 */

const puppeteer = require('puppeteer-core')
const { load, cut } = require('@node-rs/jieba')
const { pageSettings} = require('./page-settings')
const xlsx = require('xlsx');
load()
let getSuggest = async ( key ) =>
{
  try {
    if (typeof key != 'string' || key.length == 0) {
      return {'keySuggest':'','keyCloud':''}
    }
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
      dumpio: false,
      timeout: 5 + 1000 * 10,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });
    const page = await browser.newPage()
    // await pageSettings(page);
    await page.goto('http://www.baidu.com/')
    let keywrok = key
    let result = []
    let resultWord = []
    const input_area = await page.$("#kw");

    for (var i = 0; i < 26; i++) {
      let input = keywrok + String.fromCharCode(97 + i);
      console.log('--'+input+'--')
      await input_area.type(input, {delay: 100});
      // await page.waitForSelector('#form');
      let max =5,min = 2;
      await page.waitForTimeout(1000*Math.floor(Math.random()*(max-min+1)+min))
      const alltext = await page.$$eval('#form > div > ul > li',
        anchors => {
          return anchors.map(anchor => anchor.innerHTML.replace('<b>', '').replace('</b>', ''))
        })
      result.push(...alltext)
      console.log(alltext)
      if(alltext.find(function (currentValue, currentIndex, currentArray){
        if(currentValue =='抖m') return true;
        else return false;
      } )){break;}
      await input_area.click({clickCount: 3})
    }


    function formatCurrentDate() {
      date = new Date();
      var y = date.getFullYear();
      console.log(y);
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    }

    function keyCount(result, ctime) {
      var obj = {};
      var objs = new Set();
      let ress = [];
      for (let i = 0; i < result.length; i++) {
        let item = result[i];
        obj[item] = (obj[item] + 1) || 1;
        objs.add(item);
      }

      for (let item of objs) {
        ress.push({'key': keywrok, 'keyValue': item, 'count': obj[item], 'updateTime': ctime})
      }
      return ress;
    }

    function resetData(data){
      let ress = [];
      for (let item of data) {
        ress.push({'key': keywrok, 'keyValue': item, 'count': 0, 'updateTime': ctime})
      }
      return ress;
    }

    let ctime = formatCurrentDate();

    let ressults = resetData(result, ctime);


    const ra = Array.from(new Set(result))
    // console.log('result:', ra);

    for (var j = 0; j < ra.length; j++) {
      let word = cut(ra[j], false)
      resultWord.push(...word)
    }

    let resultWords = keyCount(resultWord, ctime);

    let sheet1 = xlsx.utils.json_to_sheet(ressults);
    let sheet2 = xlsx.utils.json_to_sheet(resultWords);

    let workBook = {
      SheetNames: ['提示关键词', '关键词分词'],
      Sheets: {
        '提示关键词': sheet1,
        '关键词分词': sheet2
      }
    };

    xlsx.writeFile(workBook, './keylist-' + keywrok + '.xlsx');

    // await page.goto('http://www.bing.com/')
    // let keywrok = "小红书"
    // // for (var i=0;i<26;i++){
    //   let i = 2
    //   const input_area =await page.$(".b_searchbox");
    //   await input_area.type(keywrok+String.fromCharCode(65+i));
    //   const alltext = await page.$$eval('.sa_drw > li', el => el.query);
    //   console.log('alltext:', alltext);
    // // }
    // browser.close()
    return {'keySuggest':ressults,'keyCloud':resultWords}
  }catch (err) {
    console.error(err)
    return {'keySuggest':'','keyCloud':''}
  }
}

getSuggest('抖音');
