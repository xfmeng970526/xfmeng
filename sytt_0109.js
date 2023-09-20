/**
 *
 * 自建模板
 * cron: 4 5,19 * * *
 * new Env('6-十堰头条/月低保4.5');
 * 项目名称：十堰头条/月低保4.5
 *  多账号并行执行任务模板
 */
//=====================================================//
const $ = new Env("十堰头条/月低保4.5");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1
const debug = 0
let ckStr = ($.isNode() ? process.env.sytt_data : $.getdata('sytt_data')) || '';  //检测CK  外部
let msg, ck;
let host = 'xxx.xxx.xxx';
let hostname = 'https://' + host;
let rand = randomInt(0, 14)
let rand1 = randomInt(0, 9)
let replytxtArr = ["好的政府办好事", "美丽十堰", "十堰欢迎大家", "我爱十堰", "十堰真的好美"];
let randReply = randomInt(0, 4)
let replytxt = replytxtArr[randReply]
//---------------------------------------------------//
async function tips(ckArr) {
    //DoubleLog(`当前脚本版本${Version}\n📌,如果脚本版本不一致请及时更新`);
    DoubleLog(`\n============= 共找到 ${ckArr.length} 个账号 =============`);
    debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}
!(async () => {
    let ckArr = await checkEnv(ckStr, "sytt_data");  //检查CK
    await tips(ckArr);  //脚本提示
    await start(); //开始任务
    await SendMsg(msg); //发送通知

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());


//---------------------------------------------------------------------------------封装循环测试
async function newstart(name, taskname, time) {  //任务名 函数名 等待时间
    let ckArr = await checkEnv(ckStr, "sytt_data");  //检查CK
    console.log("\n📌📌📌📌📌📌📌📌" + name + "📌📌📌📌📌📌📌📌");
    for (i = 0; i < ckArr.length; i++) {
        ck = ckArr[i].split("&");                 //单账号多变量分割符,如果一个账号需要user和token两个变量,那么则输入user1&token1@user2&token2...   
        //let CK = ckArr[i]
        await taskname();
        await $.wait(time * 1000);
    }
}
//-------------------------------------------------------------------------------封装循环测试

async function start() {
    await newstart("签到", sign, 2)
    await newstart("文章", getnewslist, 2)
    //await newstart("帖子", gettielist, 2)

}




//------------------------------------------------------------------------------------------
//用户信息查询
async function sign() {
    try {
        let options = {
            method: 'GET',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: {
                s: '/Api/Activityv1/sign',
                token: ck[1],
                uid: ck[0],
                source: 'android',
                ver: '6.2.3',
                build: '145'
            },
            headers: { Host: 'app.site.10yan.com.cn' }
        };
        let result = await httpRequest(options, `签到`);

        //console.log(result);
        if (result?.code == 200) {
            console.log(`账号[` + Number(i + 1) + `]` + `签到成功:${result.retinfo} 🎉`);
        } else if (result.code = 400) {
            console.log(`账号[` + Number(i + 1) + `]` + `签到失败:${result.retinfo} ！`);
            //console.log(result);
        } else { console.log(`账号[` + Number(i + 1) + `]` + `签到失败:${result.retinfo} ！`); }
    } catch (error) {
        console.log(error);
    }

}


//用户信息查询
async function getnewslist() {

    try {
        let options = {
            method: 'GET',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: { s: '/Api/Newsv4/newslist', page: '1', type: 'reply' },
            headers: { Host: 'app.site.10yan.com.cn' },
        };
        let result = await httpRequest(options, `评论文章列表`);

        //console.log(result);
        if (result?.code == 200) {
            //console.log(`获取评论文章成功🎉`);
            await wait(2);

            artID0 = result.list[0].contentid
            //await artReply(artID0);
            await artShare(artID0)
            await wait(2);

            artID1 = result.list[2].contentid
            //await artReply(artID1);
            await artShare(artID1)
            await wait(2);

            artID2 = result.list[4].contentid
            //await artReply(artID2);
            await artShare(artID2)
        } else {
            console.log(`获取评论文章失败！`);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }

}





//用户信息查询
async function artReply(artID) {
    try {
        let options = {
            method: 'POST',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: {
                s: '/Api/Article/artReply/',
                actiontype: '12',
                contentid: artID,
                reply: replytxt,
                uid: ck[0],
                source: 'android',
                ver: '6.2.3',
                build: '145',
                token: ck[1]
            },
            headers: { Host: 'app.site.10yan.com.cn' },
            form: {}
        };
        let result = await httpRequest(options, `评论文章`);

        //console.log(result);
        if (result?.code == 200) {
            console.log(`账号[` + Number(i + 1) + `]评论文章成功🎉`);
            await wait(2);
        } else {
            console.log(`账号[` + Number(i + 1) + `]评论文章失败！`);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }

}



//用户信息查询
async function artShare(artID) {
    try {
        let options = {
            method: 'GET',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: {
                s: '/Api/Activityv1/getNewsShareTask',
                contentid: artID,
                uid: ck[0],
                source: 'android',
                ver: '6.2.3',
                build: '145',
                token: ck[1]
            },
            headers: { Host: 'app.site.10yan.com.cn' },
            form: {}
        };
        let result = await httpRequest(options, `分享文章`);

        //console.log(result);
        if (result?.code == 200) {
            console.log(`账号[` + Number(i + 1) + `]分享文章成功🎉`);
            await wait(2);
        } else {
            console.log(`账号[` + Number(i + 1) + `]分享文章失败！`);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }

}

//用户信息查询
async function gettielist() {

    try {
        let options = {
            method: 'GET',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: { s: '/Api/Dynamic/' },
            headers: { Host: 'app.site.10yan.com.cn' },
        };
        let result = await httpRequest(options, `帖子列表`);

        //console.log(result);
        if (result?.code == 200) {
            //console.log(`获取评论文章成功🎉`);
            tieID0 = result.data[0].id
            //await tie(tieID0);
            await wait(2);

            tieID1 = result.data[2].id
            //await tie(tieID1);
            await wait(2);

            tieID2 = result.data[4].id
            //await tie(tieID2);
        } else {
            console.log(`获取帖子列表失败！`);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }

}



async function tie(tieID) {
    try {
        let options = {
            method: 'POST',
            url: 'http://app.site.10yan.com.cn/index.php',
            qs: { s: '/Api/Dynamic/reply/' },
            headers: { Host: 'app.site.10yan.com.cn' },
            form: {
                content: replytxt,
                uid: ck[0],
                source: 'android',
                ver: '6.2.3',
                build: '145',
                token: ck[1],
                pid: tieID
            }
        };
        let result = await httpRequest(options, `评论帖子`);

        //console.log(result);
        if (result?.code == 200) {
            console.log(`账号[` + Number(i + 1) + `]评论帖子成功🎉`);
            await wait(2);
        } else {
            console.log(`账号[` + Number(i + 1) + `]评论帖子失败！`);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }

}














// #region ********************************************************  固定代码  ********************************************************
/**
 * 变量检查
 */
async function checkEnv(ck, Variables) {
    return new Promise((resolve) => {
        let ckArr = []
        if (ck) {
            if (ck.indexOf("@") !== -1) {

                ck.split("@").forEach((item) => {
                    ckArr.push(item);
                });
            } else if (ck.indexOf("\n") !== -1) {

                ck.split("\n").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr)
        } else {
            console.log(` ${$.neme}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`)
        }
    }
    )
}
/**
 * 发送消息
 */
async function SendMsg(message) {
    if (!message) return;
    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require("./sendNotify");
            await notify.sendNotify($.name, message);
        } else {
            // $.msg(message);
            $.msg($.name, '', message)
        }
    } else {
        console.log(message);
    }
}

/**
 * 双平台log输出
 */
function DoubleLog(data) {
    if ($.isNode()) {
        if (data) {
            console.log(`${data}`);
            msg += `\n${data}`;
        }
    } else {
        console.log(`${data}`);
        msg += `\n${data}`;
    }

}
/**
* 等待 X 秒
*/
function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
/**
 * get请求
 */
async function httpGet(getUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = getUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.get(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg = `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * post请求
 */
async function httpPost(postUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = postUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.post(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg = `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 网络请求 (get, post等)
 */
async function httpRequest(postOptionsObject, tip, timeout = 3) {
    return new Promise((resolve) => {

        let Options = postOptionsObject;
        let request = require('request');
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
            console.log(Options);
        }

        request(Options, async (err, resp, data) => {
            try {
                if (debug) {
                    console.log(`\n\n 【debug】===============这是 ${tip} 返回数据==============`);
                    console.log(data);
                    console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                    console.log(JSON.parse(data));
                }
                let result = JSON.parse(data);
                if (!result) return;
                resolve(result);
            } catch (e) {
                console.log(err, resp);
                console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                msg = `\n ${tip} 失败了!请稍后尝试!!`
            } finally {
                resolve();
            }
        }), timeout

    });
}


/**
 * debug调试
 */
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}

// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
