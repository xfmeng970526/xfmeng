/*
jszack
cron: 0 10-22 * * *
new Env('65-资金盘-电动车');
项目名称：资金盘-电动车
资金盘 小米电动车  注册送一个充电桩 一个充电桩一天0.6 早撸早爽 不撸不爽

注册后填写自己得支付宝或者上传微信收款码   微信收款码只支持20及以上金额

账号#密码#al //提现至支付宝  
账号#密码#wx //提现至微信

账号填入变量 Dians 里面多账户 @ 或者 回车分割

例如 1332511****#adb123#al 
*/
const $ = new Env( '电动车' );
let envSplitor = [ '@', '\n' ]
let httpResult, httpReq, httpResp, usid = 0, userCount = 0 , userList = []
const ckName = 'Dians'
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
///////////////////////////////////////////////////////////////////
async function action () {
       if(userCount>0)for(let user of userList)await user.task();
}
class UserInfo{constructor(e){this.fsd=`账号[${++usid}] `,this.c1=e.split("#")[0],this.c2=e.split("#")[1],this.c3=e.split("#")[2],this.ck=$.randomString(26,"j91sp83at47e4ghea9ihh2q6ge"),this.h={Host:"xm.151gs.cn",Connection:"keep-alive","Content-Length":"70",Accept:"application/json, text/plain, */*","User-Agent":"Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 AgentWeb/4.1.3  UCBrowser/11.6.4.950","Content-Type":"application/json;charset=UTF-8",Origin:"http://xm.151gs.cn","X-Requested-With":"com.ten.cn",Referer:"http://xm.151gs.cn/home/login/index.html","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",Cookie:"PHPSESSID="+this.ck}}async reward(){let e;await httpRequest("post",popu("http://xm.151gs.cn/home/login/index.html",this.h,`{"username":"${this.c1}","password":"${this.c2}","smsCode":"","code":0}`));let t=httpResult;0==t.code&&(console.log(`${this.fsd}${t.message} `),this.br=httpResp.headers["set-cookie"][0],await this.receive()),0!==t.code&&console.log(`${this.fsd}${t.message} `)}async receive(){this.w={Host:"xm.151gs.cn",Connection:"keep-alive","Content-Length":"11",Accept:"*/*","X-Requested-With":"XMLHttpRequest","User-Agent":"Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 AgentWeb/4.1.3  UCBrowser/11.6.4.950","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",Origin:"http://xm.151gs.cn",Referer:"http://xm.151gs.cn/home/index/my_treaty.html","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",Cookie:"PHPSESSID="+this.ck+";"+this.br},await httpRequest("post",popu("http://xm.151gs.cn/home/index/receive.html",this.w,"code=123456"));let e=httpResult;0==e.code&&(console.log(`${this.fsd}免费电瓶车 ${e.message} `),await this.index())}async rollout(){"al"==this.c3&&(this.s=`{"money":"${this.v}","pay_type":["alipay"],"remain_time":100}`,console.log(`${this.fsd}此账号选择支付宝提现${this.v}`)),"wx"==this.c3&&(this.s=`{"money":"${this.v}","pay_type":["wx_pay_img"],"remain_time":100}`,console.log(`${this.fsd}此账号选择微信提现${this.v}`));let e=this.s;this.w={Host:"xm.151gs.cn",Connection:"keep-alive","Content-Length":"11",Accept:"*/*","X-Requested-With":"XMLHttpRequest","User-Agent":"Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 AgentWeb/4.1.3  UCBrowser/11.6.4.950","Content-Type":"application/json;charset=UTF-8",Origin:"http://xm.151gs.cn",Referer:"http://xm.151gs.cn/home/index/my_treaty.html","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",Cookie:"PHPSESSID="+this.ck+";"+this.br},await httpRequest("post",popu("http://xm.151gs.cn/home/index/rollout.html",this.w,e));let t=httpResult;0==t.code&&console.log(`${this.fsd}提现 ${t.message} `),0!==t.code&&console.log(`${this.fsd}提现 ${t.message} `)}async task(){await this.reward()}async index(){this.w={Host:"xm.151gs.cn",Connection:"keep-alive",Accept:"*/*","X-Requested-With":"XMLHttpRequest","User-Agent":"Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 AgentWeb/4.1.3  UCBrowser/11.6.4.950",Origin:"http://xm.151gs.cn",Referer:"http://xm.151gs.cn/home/index/my_treaty.html","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",Cookie:"PHPSESSID="+this.ck+";"+this.br},await httpRequest("post",popu("http://xm.151gs.cn/home/user/index.html",this.w,""));let e=httpResult,t=(e=e.replace(/\s*/g,"")).match(/"aui-flex-box"><h2>(\d+\D+\d+)/g)[0].split("<h2>")[1],i=e.match(/class="aui-palace-grid"><h2>(\d+\D+\d+)/g)[0].split("<h2>")[1],s=e.match(/class="aui-palace-grid"><h2>(\d+\D+\d+)/g)[1].split("<h2>")[1],n=e.match(/class="aui-palace-grid"><h2>(\d+\D+\d+)/g)[2].split("<h2>")[1];console.log(`${this.fsd}${t} 今日收益 ${i} 累计收益${s} 累计提现${n}`),i>=.1&&i<3&&(this.v="0.10"),i>=3&&i<20&&(this.v="3.00"),i>=20&&i<200&&(this.v="20.00"),this.v&&await this.rollout()}}
(async()=>{"undefined"!=typeof $request&&await GetRewrite(),await checkEnv()&&userCount>0&&await action()})().catch(a=>console.log(a)).finally(()=>$.done());
///////////////////////////////////////////////////////////////////
async function GetRewrite(){}async function checkEnv(){if(userCookie){let e=envSplitor[0];for(let n of envSplitor)if(userCookie.indexOf(n)>-1){e=n;break}for(let t of userCookie.split(e))t&&userList.push(new UserInfo(t));userCount=userList.length}else console.log(`未找到任何数据`);return userCount>0&&console.log(`找到${userCount}个账号`),!0}
////////////////////////////////////////////////////////////////////
function popu(e,t,n=""){e.replace("//","/").split("/")[1];let r={url:e,headers:t,timeout:7e3};return n&&(r.body=n,r.headers["Content-Length"]=n?.length||0),r}
async function httpRequest(e,l){return httpResult=null,httpReq=null,httpResp=null,new Promise(n=>{$.send(e,l,async(e,l,t)=>{try{if(httpReq=l,httpResp=t,e);else if(t.body){if("object"==typeof t.body)httpResult=t.body;else try{httpResult=JSON.parse(t.body)}catch(y){httpResult=t.body}}}catch(o){console.log(o)}finally{n()}})})}
////////////////////////////////////////////////////////////////////
function Env(e,s){return"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0),new class{constructor(e,s){this.name=e,this.notifyStr="",this.notifyFlag=!1,this.startTime=(new Date).getTime(),Object.assign(this,s),console.log(`${this.name} 开始运行：
`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getdata(e){let s=this.getval(e);if(/^@/.test(e)){let[,i,n]=/^@(.*?)\.(.*?)$/.exec(e),r=i?this.getval(i):"";if(r)try{let o=JSON.parse(r);s=o?this.lodash_get(o,n,""):s}catch(a){s=""}}return s}setdata(e,s){let i=!1;if(/^@/.test(s)){let[,n,r]=/^@(.*?)\.(.*?)$/.exec(s),o=this.getval(n);try{let a=JSON.parse(n?"null"===o?null:o||"{}":"{}");this.lodash_set(a,r,e),i=this.setval(JSON.stringify(a),n)}catch(l){let h={};this.lodash_set(h,r,e),i=this.setval(JSON.stringify(h),n)}}else i=this.setval(e,s);return i}getval(e){return this.isSurge()||this.isLoon()?$persistentStore.read(e):this.isQuanX()?$prefs.valueForKey(e):this.isNode()?(this.data=this.loaddata(),this.data[e]):this.data&&this.data[e]||null}setval(e,s){return this.isSurge()||this.isLoon()?$persistentStore.write(e,s):this.isQuanX()?$prefs.setValueForKey(e,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=e,this.writedata(),!0):this.data&&this.data[s]||null}send(e,s,i=()=>{}){if("get"!=e&&"post"!=e&&"put"!=e&&"delete"!=e){console.log(`无效的http方法：${e}`);return}if("get"==e&&s.headers?(delete s.headers["Content-Type"],delete s.headers["Content-Length"]):s.body&&s.headers&&!s.headers["Content-Type"]&&(s.headers["Content-Type"]="application/x-www-form-urlencoded"),this.isSurge()||this.isLoon()){this.isSurge()&&this.isNeedRewrite&&(s.headers=s.headers||{},Object.assign(s.headers,{"X-Surge-Skip-Scripting":!1}));let n={method:e,url:s.url,headers:s.headers,timeout:s.timeout,data:s.body};"get"==e&&delete n.data,$axios(n).then(e=>{let{status:s,request:n,headers:r,data:o}=e;i(null,n,{statusCode:s,headers:r,body:o})}).catch(e=>console.log(e))}else if(this.isQuanX())s.method=e.toUpperCase(),this.isNeedRewrite&&(s.opts=s.opts||{},Object.assign(s.opts,{hints:!1})),$task.fetch(s).then(e=>{let{statusCode:s,request:n,headers:r,body:o}=e;i(null,n,{statusCode:s,headers:r,body:o})},e=>i(e));else if(this.isNode()){this.got=this.got?this.got:require("got");let{url:r,...o}=s;this.instance=this.got.extend({followRedirect:!1}),this.instance[e](r,o).then(e=>{let{statusCode:s,request:n,headers:r,body:o}=e;i(null,n,{statusCode:s,headers:r,body:o})},e=>{let{message:s,request:n,response:r}=e;i(s,n,r)})}}time(e,s=null){let i=s?new Date(s):new Date,n={"M+":i.getMonth()+1,"d+":i.getDate(),"h+":i.getHours(),"m+":i.getMinutes(),"s+":i.getSeconds(),"q+":Math.floor((i.getMonth()+3)/3),S:this.padStr(i.getMilliseconds(),3)};for(let r in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(i.getFullYear()+"").substr(4-RegExp.$1.length))),n)RegExp("("+r+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?n[r]:("00"+n[r]).substr((""+n[r]).length)));return e}async showmsg(){if(!this.notifyFlag||!this.notifyStr)return;let e=this.name+" 运行通知\n\n"+this.notifyStr;if($.isNode()){var s=require("./sendNotify");console.log("\n============== 推送 =============="),await s.sendNotify(this.name,e)}else this.msg(e)}logAndNotify(e,s=!0){s&&(this.notifyFlag=!0),console.log(e),this.notifyStr+=e,this.notifyStr+="\n"}logAndNotifyWithTime(e,s=!0){s&&(this.notifyFlag=!0);let i="["+this.time("hh:mm:ss.S")+"]"+e;console.log(i),this.notifyStr+=i,this.notifyStr+="\n"}logWithTime(e){console.log("["+this.time("hh:mm:ss.S")+"]"+e)}msg(e=t,s="",i="",n){let r=e=>{if(!e)return e;if("string"==typeof e)return this.isLoon()?e:this.isQuanX()?{"open-url":e}:this.isSurge()?{url:e}:void 0;if("object"==typeof e){if(this.isLoon()){let s;return{openUrl:e.openUrl||e.url||e["open-url"],mediaUrl:e.mediaUrl||e["media-url"]}}if(this.isQuanX()){let i;return{"open-url":e["open-url"]||e.url||e.openUrl,"media-url":e["media-url"]||e.mediaUrl}}if(this.isSurge())return{url:e.url||e.openUrl||e["open-url"]}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(n)):this.isQuanX()&&$notify(e,s,i,r(n)));let o=["","============== 系统通知 =============="];o.push(e),s&&o.push(s),i&&o.push(i),console.log(o.join("\n"))}getMin(e,s){return e<s?e:s}getMax(e,s){return e<s?s:e}padStr(e,s,i="0"){let n=String(e),r=s>n.length?s-n.length:0,o="";for(let a=0;a<r;a++)o+=i;return o+n}json2str(e,s,i=!1){let n=[];for(let r of Object.keys(e).sort()){let o=e[r];o&&i&&(o=encodeURIComponent(o)),n.push(r+"="+o)}return n.join(s)}str2json(e,s=!1){let i={};for(let n of e.split("&")){if(!n)continue;let r=n.indexOf("=");if(-1==r)continue;let o=n.substr(0,r),a=n.substr(r+1);s&&(a=decodeURIComponent(a)),i[o]=a}return i}randomPattern(e,s="abcdef0123456789"){let i="";for(let n of e)"x"==n?i+=s.charAt(Math.floor(Math.random()*s.length)):"X"==n?i+=s.charAt(Math.floor(Math.random()*s.length)).toUpperCase():i+=n;return i}randomString(e,s="abcdef0123456789"){let i="";for(let n=0;n<e;n++)i+=s.charAt(Math.floor(Math.random()*s.length));return i}randomList(e){return e[Math.floor(Math.random()*e.length)]}wait(e){return new Promise(s=>setTimeout(s,e))}async done(e={}){await this.showmsg();let s=(new Date).getTime(),i=(s-this.startTime)/1e3;console.log(`
${this.name} 运行结束，共运行了 ${i} 秒！`),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(e)}}(e,s)}
