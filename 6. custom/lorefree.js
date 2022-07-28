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
  await page.goto('https://ebook2.lorefree.com/')
  await page.click('button.add-to-cart-btn.addToCart')
})()
} catch (err) {
  console.error(err)
}
