const puppeteer = require('puppeteer');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');

(async () => {
  // 复制翻译的文件
  const readZh = fs.readFileSync('./lang/zh.js');
  fs.writeFileSync('./lang/JPN.js', readZh);
  // 复制内容到JPN文件
  const readStream = fs.createReadStream('./lang/JPN.js');
  // 读取内容
  var transData = ''
  readStream.on('data', chunk => {
    transData += chunk;
  });
  readStream.on('end', async () => {
    let transList = transData.split(',');
    let googleList = []
    let transedList = []
    const pickReg = /: '([^]*)'/;
    transList.forEach(item => {
      pickReg.test(item);
      googleList.push(RegExp.$1);
    })
    // 开始翻译
    console.log(googleList)
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    console.log('page loading...');
    page.goto('https://translate.google.cn/#view=home&op=translate&sl=zh-CN&tl=ja');
    setTimeout(async () => {
      console.log('page loaded');
      const input = await page.$('textarea#source');
      translateItem(googleList, input, page, transedList, transList)
    }, 5000);
  });

  async function translateItem(list, input, page, transedList, transList) {
    if (!list.length) return;
    await input.type(list[0]);
    page.on('response', interceptedRes => {
      const resUrl = interceptedRes.url();
      if (/https:\/\/translate.google.cn\/translate_a\/single/.test(resUrl)) {
        interceptedRes.text().then(async (data) => {
          transedList.push(JSON.parse(data)[0][0][0]);
          list.shift();
          await page.click('.clear')
          if (list.length) {
            setTimeout(() => {
              translateItem(list, input);
            }, 1000);
          } else {
            console.log('translate complete!', transedList)
            writeData(transedList, transList)
            // 开始组装数据，写入数据
          }
        })
      }
    })
  }

  function writeData(transedList, list) {
    const pickReg = /: '([^]*)'/;
    transedList.forEach((word, index) => {
      let itemList = list[index].split("'");
      itemList[1] = word;
      list[index] = itemList.join("'");
    });
    const writeStream = fs.createWriteStream('./lang/JPN.js');
    writeStream.write(list.join());
  }
})();