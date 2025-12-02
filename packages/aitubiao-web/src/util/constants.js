// imgs
import bingzhuangtu from '@assets/imgs/bingzhuangtu.jpeg';
import zhuzhuangtu from '@assets/imgs/zhuzhuangtu.jpeg';
import zhexiantu from '@assets/imgs/zhexiantu.jpeg';
import loudoutu from '@assets/imgs/loudoutu.jpeg';
import ciyuntu from '@assets/imgs/ciyuntu.jpeg';
import juxingshutu from '@assets/imgs/juxingshutu.jpeg';

export const showCards = [
  {
    title: '饼状图',
    img: bingzhuangtu,
    desc: `老板，我分析了一遍bug，引起bug的原因如下： 
- 环境问题：12个，因为测试环境和生产环境不同导致 
- 需求变动：5个，在发版前后产品修改需求导致 
- 修改代码引入：5个，在发版前后修改产品需求引入其他bug导致 
- 测试漏测：3个，测试case漏掉导致`,
  },
  {
    title: '柱状图',
    img: zhuzhuangtu,
    desc: `老板，统计了一下几个版本研发的bug数：
小A，v1版本：23个
小A，v2版本：20个
小A，v3版本：18个
小A，v4版本：25个
小B，v1版本：5个
小B，v2版本：7个
小B，v3版本：4个
小B，v4版本：3个
小C，v1版本：12个
小C，v2版本：16个
小C，v3版本：17个
小C，v4版本：18个`,
  },
  {
    title: '折线图',
    img: zhexiantu,
    desc: `帮我生成折线图
日期	网站PV	网站UV
2025/7/29	2	1
2025/7/30	41	5
2025/7/31	11	8
2025/8/1	33	12
2025/8/2	18	16
2025/8/3	12	7
2025/8/4	10	10
2025/8/5	8	8
2025/8/6	5	5
2025/8/7	70	19
2025/8/8	358	137
2025/8/9	63	21
2025/8/10	80	37
2025/8/11	104	50
2025/8/12	148	38
2025/8/13	114	39
2025/8/14	122	39
2025/8/15	152	28
2025/8/16	20	12
2025/8/17	24	11
2025/8/18	147	27
2025/8/19	134	34`,
  },
  {
    title: '漏斗图',
    img: loudoutu,
    desc: `老板，我统计了一下这个月的信息
hr推荐简历共100份
一面通过候选人38人
二面通过候选人20人
三面通过候选人15人
HR面通过候选人12人
老板通过候选人5人
接offer候选人3人
放鸽子候选人3人`,
  },
  {
    title: '词云图',
    img: ciyuntu,
    desc: `做个词云图
服务器 30
python 23
天气 22
文件系统 11
自动化 10
实时数据 8
图像生成 7
天气服务器 6
cli 6
本地开发 5
工作流 5
网页搜索 5
天气数据 4
代码生成 4
excel 4
kubernetes 4
fastapi 4
php 4
数据检索 3
文本转语音 3
提示词 3
金融数据 3
身份验证 3
项目管理 3
obsidian 3
测试 3
图表 3
git 3
数据分析 3
代码审查 2
c++ 2
知识图谱 2
标准化接口 2
截图 2
插件 2
知识库 2
搜索 2
文件操作 2
chrome 2
文档搜索 2
本地运行 2
安全 2
gemini 2
微服务 1
youtube 1
javascript 1
deno 1
node.js 1
quarkus 1
dockerfile 1
tts 1
网页抓取 1
typescript 1
supabase 1
jira 1
shell 1
macos 1
区块链 1
mysql 1
代码分析 1
高性能 1
数据库操作 1
故障排除 1
java 1
自然语言 1
安装 1
文档 1
可视化 1
股票数据 1
数据库 1
api 1
数据 1
查询 1
smithery 1
字幕 1
任务管理 1
加密货币 1
ocr 1
笔记存储 1
openapi 1
markdown 1
jdbc 1
vs code 1
交易 1
市场数据 1
claude 1
文档管理 1
大模型 1
分析 1
npm 1`,
  },
  {
    title: '矩形树图',
    img: juxingshutu,
    desc: `做个矩形树图
服务器 30
python 23
天气 22
文件系统 11
自动化 10
实时数据 8
图像生成 7
天气服务器 6
cli 6
本地开发 5
工作流 5
网页搜索 5
天气数据 4
代码生成 4
excel 4
kubernetes 4
fastapi 4
php 4
数据检索 3
文本转语音 3
提示词 3
金融数据 3
身份验证 3
项目管理 3
obsidian 3
测试 3
图表 3
git 3
数据分析 3
代码审查 2
c++ 2
知识图谱 2
标准化接口 2
截图 2
插件 2
知识库 2
搜索 2
文件操作 2
chrome 2
文档搜索 2
本地运行 2
安全 2
gemini 2
微服务 1
youtube 1
javascript 1
deno 1
node.js 1
quarkus 1
dockerfile 1
tts 1
网页抓取 1
typescript 1
supabase 1
jira 1
shell 1
macos 1
区块链 1
mysql 1
代码分析 1
高性能 1
数据库操作 1
故障排除 1
java 1
自然语言 1
安装 1
文档 1
可视化 1
股票数据 1
数据库 1
api 1
数据 1
查询 1
smithery 1
字幕 1
任务管理 1
加密货币 1
ocr 1
笔记存储 1
openapi 1
markdown 1
jdbc 1
vs code 1
交易 1
市场数据 1
claude 1
文档管理 1
大模型 1
分析 1
npm 1`,
  },
];

export const siteName = 'AITuBiao.online';
export const siteUrl = 'https://aitubiao.online/';
export const textareaPlaceholder =
  'AITuBiao.online\n\n在线, 即开即用\n强大, 支持生成超25种图表\n\n示例: 生成一个饼状图, 有a,b,c三个分类, 对应的数值分别为10,20,70';
