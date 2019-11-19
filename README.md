# 自动谷歌翻译(渣渣自动翻译器)
vue项目国际化存在很多重复工作，这个自动翻译器实现了批量翻译一个文件（格式固定）。很不智能，不能保证百分百成功（内容太多或者速度太快过程中有可能被谷歌拦截）。


# 需要的环境
1.node
2.puppeteer

# puppeteer安装踩坑
Puppeteer可以通过npm下载
1.npm i puppeteer
2.npm i puppeteer-core（跳过Chromium安装）
第一种安装时间久很容易失败。  第二种需要自己手动去下载Chromium，并且要和puppeteer-core所需要的Chromium版本号一致或者下载某一版本再把puppeteer-core的版本号更改

# 使用方法
1.下载项目、cd到目录
2.npm i或者yarn
3.node index
