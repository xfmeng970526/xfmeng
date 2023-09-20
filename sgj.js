/**
 * 拾光家 app https://www.shiguangjia.cn , 内测拾光码:130239
 * cron: 10 10,21 * * *
 * new Env('29-拾光家');
 * 项目名称：拾光家
 * 22/12/7   每日答题1块钱低保
 * 22/12/8   请在执行前手动完成所有的剩余任务 一天运行10次
 * 22/12/9   判断每日完成数量超过10次不再执行,判断每日未完成5个不再执行,判断已做过的和随机获取的一样,不再执行
 * 22/12/10  满1000光子才可提现,增加了可以做正在进行中的任务  题库每天都在增加放心跑
 * ========= 青龙--配置文件 ===========
 * # 项目名称
 * export sgj_data='token'
 * 
 * 多账号用 换行 或 @ 分割
 * 抓包 api.shiguangjia.cn/api中
 * headers 中 token 需要自动提现请填写 c-shebei-id 用&连接
 * ====================================
 *   
 */



const $ = new Env("拾光家");
const ckName = "sgj_data";
//-------------------- 一般不动变量区域 -------------------------------------
const utils = require("./utils");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1;		 //0为关闭通知,1为打开通知,默认为1
let debug = 0;           //Debug调试   0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';       //let ck,msg
let host, hostname;
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------- 自定义变量区域 -----------------------------------
//---------------------------------------------------------

async function start() {
    //    async official_event(name) { // 发送消息获取答题
    //    async chatuser_list(name) { // 获取消息列表
    //    async task_accept(name) { // 接受任务
    //    async get_rw(name) { // 进入答题任务
    //    async get_recoord(name) { // 进入答题
    //    async get_qlist(name) { // 获取答题列表
    //    async sub_papers(name) { // 提交答案
    console.log('\n更新：题库内没有就会重新获取题库,直到所有的题目都在题库内才会答题,建议一天跑11次,一小时一次');
    console.log('\n如果一直出现循环5次以上,那么您就手动做一下,可能答案真的不全\n把答案和日志截图发我QQ860562056就行.主要是题目ID题目和答案这三个,在此感谢你');
    console.log('\n题目均为人工收集,如有正确答案请及时发送我正确答案和脚本运行日志');
    //console.log('\n请先完成进行中的拾光!！这个报错是因为你那边积攒的未完成的太多了!');
    //console.log('\n达到完成次数上限!！ 这个报错是因为这条任务你已经上限了,可以多运行几次');

    console.log('\n================== 用户信息 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.user_info());
        await wait(3); //延迟
    }
    await Promise.all(taskall);
    console.log('\n================== 开始获取答题 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_accept('开始获取答题'));
        await wait(10); //延迟
    }
    await Promise.all(taskall);




}


class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        //this.ck = str.split('&')[0]; //单账号多变量分隔符
        //let ck = str.split('&')
        //this.data1 = ck[0]
        this.token = str.split('&')[0]
        //this.cookie = str.split('&')[1]
        this.shebei_id = str.split('&')[1]
        //this.jm_token = str.split('&')[2]
        //this.jm_deviceid = str.split('&')[3]
        this.host = "echo.apipost.cn";
        this.hostname = "https://" + this.host;
        this.ts = utils.ts13()
        this.sign = utils.MD5_Encrypt("4044dd5f9031ba15a74a980c8cfbd74474b5dadf" + this.jm_deviceid + "android" + "215" + this.ts + "d75972c1a418f5acb4a4445acba394eccf863fbe")
        this.y = utils.local_year()
        this.m = utils.local_month_two() + 1
        this.d = utils.local_day_two()
        this.random = utils.randomszxx(10)
        this.pushid = "push" + this.y + this.m.toString() + this.d + this.random
        this.date = utils.tmtoDate().slice(0, 10)
        //this.randomNum = utils.randomInt(0, 49)
    }

    /** 
        async official_event(name) { // 发送消息获取答题
            try {
                let options = {
                    method: 'POST',
                    url: 'https://api.shiguangjia.cn/api/comm/official_event',
                    headers: {
                        Host: 'api.shiguangjia.cn',
                        'c-model': 'android',
                        'c-type': 'app',
                        'c-shebei-id': this.shebei_id,
                        'c-versioncode': '215',
                        'c-app-channel': 'official',
                        'c-shebei-info': '{"product":"platina","version_type":"user","display":"QKQ1.190910.002 test-keys","push_qx":"1","sdk_int":"29","manufacturer":"Xiaomi","hardward":"qcom","system":"Android 10","build_id":"QKQ1.190910.002","device_resolution":"1080x2154","bootloader":"unknown","fingerprint":"Xiaomi/platina/platina:10/QKQ1.190910.002/V12.0.1.0.QDTCNXM:user/release-keys","model":"MI 8 Lite","lang":"zh","device":"platina","brand":"Xiaomi","board":"sdm660"}',
                        token: this.token,
                        'c-version': '2.1.2',
                        'content-type': 'application/x-www-form-urlencoded',
                        //cookie: this.cookie,
                        'user-agent': 'okhttp/4.7.2'
                    },
                    form: { sg_code: '53', event: 'pull_mrsg' }
                };
                //console.log(options);
                let result = await httpRequest(options, name);
                //console.log(result);
                if (result.code == 1) {
                    DoubleLog(`账号[${this.index}]  获取答题任务成功: ${result.msg}`);
                    await wait(5)
                    await this.chatuser_list("获取消息列表")
                } else {
                    DoubleLog(`账号[${this.index}]  获取答题任务:失败 ❌ 了呢,原因未知！`);
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        }
    
        async chatuser_list(name) { // 获取消息列表
            try {
                let options = {
                    method: 'GET',
                    url: 'https://ws.shiguangjia.cn:8086/user_im/chatuser_list',
                    qs: { offset: '0', length: '1000' },
                    headers: {
                        'jm-devicetype': 'android',
                        'jm-verifymd5': this.sign,
                        'jm-deviceid': this.jm_deviceid,
                        'jm-versioncode': '215',
                        'jm-appid': '4044dd5f9031ba15a74a980c8cfbd74474b5dadf',
                        'jm-signtime': this.ts,
                        'jm-token': this.jm_token,
                        'user-agent': 'okhttp/4.7.2'
                    }
                };
                //console.log(options);
                let result = await httpRequest(options, name);
                //console.log(result);
                if (result.code == 1) {
                    DoubleLog(`账号[${this.index}]  获取答题任务信息: ${result.msg}`);
                    for (let i in result.data.list) {
                        if (result.data.list[i]._name == "每日拾光") {
                            console.log(`任务信息: ${result.data.list[i].last_msg.nr.data.h.t}&${result.data.list[4].last_msg.nr.data.h.st}`);
                            console.log(`任务链接获取成功 : ${result.data.list[i].last_msg.nr.data.url}`);
                            let r1 = result.data.list[4].last_msg.nr.data.url.replace("shiguangjia:\/\/sgj.cn\/uniapp\/__UNI__C6B64AE\/pages\/task\/taskDetail?", "")
                            //rw_id=168&pk=push20221207111239J9adIUVB6v
                            let r2 = r1.slice(6, 9)
                            let r3 = r1.slice(13)
                            await wait(3)
                            await this.task_accept(r2, r3)
                        }
    
                    }
    
                } else {
                    DoubleLog(`账号[${this.index}]  获取答题任务:失败 ❌ 了呢,原因未知！`);
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        }
    **/
    async api() { // 获取远程题库
        try {
            let options = {
                method: 'GET',
                url: 'https://ghproxy.com/https://raw.githubusercontent.com/smallfawn/QLScriptPublic/main/sgj/qlist.json',
            };
            //console.log(options);
            let result = await httpRequest(options, "获取远程题库");
            //console.log(result);
            if (result) {
                let rr = result
                //DoubleLog(`账号[${this.index}]  获取题目列表成功: ${result.msg}`);
                return rr
            }
        } catch (error) {
            console.log(error);
        }
    }
    async task_accept() { // 查看是否在已做完的列表中
        let r2list = await this.api()
        //console.log(r2list);
        let tidArr = r2list.tid
        let l = tidArr.length
        //console.log("开始获取远程仓库任务" + r2);
        let rd = utils.randomInt(0, l)
        let ti = tidArr[rd]
        let rArr = await this.s_task2() //已经做过的
        let rArr3 = await this.s_task3() // 正在进行的
        let rArr4 = await this.s_task4() // 今日完成的  
        await this.task_accept2(rArr, ti, rArr3, rArr4)
    } //rArr3.length < 5 //rArr.indexOf(ti) == -1 //rArr4.length < 10
    async task_accept2(rArr, ti, rArr3, rArr4) { // 接受任务
        if (rArr3.length < 5) {
            if (rArr4.length < 10) {
                if (rArr.indexOf(ti) == -1) {
                    try {
                        let options = {
                            method: 'POST',
                            url: 'https://api.shiguangjia.cn/api/task/accept',
                            headers: {
                                'C-model': 'android',
                                'C-type': 'app-miniapp',
                                'C-version': '2.7.7',
                                token: this.token,
                                'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                                'Content-Type': 'application/json;charset=UTF-8',
                                Host: 'api.shiguangjia.cn',
                                Connection: 'Keep-Alive',
                                //Cookie: this.cookie,
                                'content-type': 'application/json'
                            },
                            body: { rw_id: ti, pk: this.pushid },
                            json: true
                        };
                        //console.log(options);
                        let result = await httpRequest(options, "接受任务");
                        //console.log(result);
                        if (result.code == 1 && result.msg == "接受拾光成功!") {
                            DoubleLog(`账号[${this.index}]  接受答题任务成功: ${result.msg},${result.data.record_id}广告ID` + ti);
                            await wait(3);
                            let r4 = result.data.record_id
                            await this.get_rw(ti, r4);
                        } else if (result.code == -1 && result.msg == "已经接受了此拾光!") { //理论上不存在这个了 因为加了判定了
                            DoubleLog(`账号[${this.index}]  接受答题任务:失败 ❌ 了呢,原因${result.msg}！`);
                            await wait(1)
                            console.log("将为你重新获取广告");
                            await this.task_accept()
                        } else if (result.code == -1 && result.msg == "达到完成次数上限!") { //理论上不存在这个了 因为加了判定了
                            DoubleLog(`账号[${this.index}]  接受答题任务:失败 ❌ 了呢,原因${result.msg}！`);
                            await wait(1)
                            console.log("将为你重新获取广告");
                            console.log(ti);
                            await this.task_accept()
                        } else if (result.code == -1 && result.msg == "请先完成进行中的拾光!") {//理论上不存在这个了 因为加了判定了
                            console.log(`账号[${this.index}]当前账号积攒的未完成的数量太多了,手动完成再来运行吧`);
                        } else {
                            console.log(result);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    console.log(rArr, ti);
                    console.log("本次随机抽到的题,已经做过,现在重新获取");
                    await this.task_accept()
                }
            } else {
                console.log(`账号[${this.index}]当前账号今日任务已完成`);
            }

        } else {
            console.log(`账号[${this.index}]当前账号积攒的未完成的数量太多了`);
            console.log(`尝试做正在进行的任务`);
            let recordArr = await this.s_task33()
            for (let i in recordArr) {
                await this.get_qlist2(recordArr[i])
                await wait(2)
            }
        }

    }
    async my_task(n, m) { // 查询已经做过的
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/task/mytask',
                headers: {
                    Host: 'api.shiguangjia.cn',
                    'c-model': 'android',
                    'c-type': 'app',
                    //'c-shebei-id': this.shebei_id,
                    'c-versioncode': '215',
                    'c-app-channel': 'official',
                    'c-shebei-info': '{"product":"platina","version_type":"user","display":"QKQ1.190910.002 test-keys","push_qx":"1","sdk_int":"29","manufacturer":"Xiaomi","hardward":"qcom","system":"Android 10","build_id":"QKQ1.190910.002","device_resolution":"1080x2154","bootloader":"unknown","fingerprint":"Xiaomi/platina/platina:10/QKQ1.190910.002/V12.0.1.0.QDTCNXM:user/release-keys","model":"MI 8 Lite","lang":"zh","device":"platina","brand":"Xiaomi","board":"sdm660"}',
                    token: this.token,
                    'c-version': '2.1.2',
                    'content-type': 'application/x-www-form-urlencoded',
                    //cookie: this.cookie,
                    'user-agent': 'okhttp/4.7.2'
                },
                form: { page: n, lx: m }  //2是已完成  1是未完成  3是过期  
            };
            //console.log(options);
            let result = await httpRequest(options, "查询已经做过的");
            //console.log(result);
            if (result.code == 1) {
                //console.log("当前已做过的广告数量" + result.count);
                return result
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async s_task2() { // 查询已经做过的
        let rArr = []//已完成的数组
        try {
            let rlist1 = await this.my_task("1", "2")
            if (rlist1.count <= 20) {
                for (let l = 0; l < rlist1.data.length; l++) {
                    let id1 = rlist1.data[l].rw_id
                    rArr.push(id1)
                }
            }
            if (rlist1.count > 20) {
                let num = Math.ceil(rlist1.count / 20)
                for (let o = 2; o <= num; o++) {
                    let rlist2 = await this.my_task(o.toString(), "2")
                    for (let n = 0; n < rlist2.data.length; n++) {
                        let id2 = rlist2.data[n].rw_id
                        rArr.push(id2)
                    }

                }
            }
            console.log("当前已做过的广告数量" + rlist1.count + "列表[" + rArr + "]");
            //console.log("已经做过的广告列表" + rArr);
            return rArr
        } catch (error) {
            console.log(error);
        }
    }
    async s_task3() { // 查询正在进行的
        let rArr3 = []//正在进行的数组
        try {
            let rlist1 = await this.my_task("1", "1")
            console.log("当前正在进行广告数量" + rlist1.count);
            if (rlist1.count <= 20) {
                for (let l = 0; l < rlist1.data.length; l++) {
                    let id1 = rlist1.data[l].rw_id
                    rArr3.push(id1)
                }
            }
            if (rlist1.count > 20) {
                let num = Math.ceil(rlist1.count / 20)
                for (let o = 2; o <= num; o++) {
                    let rlist2 = await this.my_task(o.toString(), "1")
                    for (let n = 0; n < rlist2.data.length; n++) {
                        let id2 = rlist2.data[n].rw_id
                        rArr3.push(id2)
                    }

                }
            }
            console.log("当前正在进行的广告数量" + rlist1.count + "列表[" + rArr3 + "]");
            return rArr3
        } catch (error) {
            console.log(error);
        }
    }
    async s_task33() { // 查询正在进行的record_id
        let rArr33 = []//正在进行的数组
        try {
            let rlist1 = await this.my_task("1", "1")
            console.log("当前正在进行广告数量" + rlist1.count);
            if (rlist1.count <= 20) {
                for (let l = 0; l < rlist1.data.length; l++) {
                    let id1 = rlist1.data[l].record_id
                    rArr33.push(id1)
                }
            }
            if (rlist1.count > 20) {
                let num = Math.ceil(rlist1.count / 20)
                for (let o = 2; o <= num; o++) {
                    let rlist2 = await this.my_task(o.toString(), "1")
                    for (let n = 0; n < rlist2.data.length; n++) {
                        let id2 = rlist2.data[n].record_id
                        rArr33.push(id2)
                    }

                }
            }
            console.log("当前正在进行的广告数量临时代码数量" + rlist1.count + "列表[" + rArr33 + "]");
            return rArr33
        } catch (error) {
            console.log(error);
        }
    }
    async s_task4() { // 今日完成了的任务
        let rArr4 = []//今日完成了的任务
        try {
            let rlist1 = await this.my_task("1", "2")
            if (rlist1.count <= 20) {
                for (let l = 0; l < rlist1.data.length; l++) {
                    if (rlist1.data[l].done_time.slice(0, 10) == this.date) {
                        let id1 = rlist1.data[l].rw_id
                        rArr4.push(id1)
                    }

                }
            }
            //console.log("今日完成了的任务数量" + rArr4.length);
            //console.log("今日完成了的任务" + rArr4);
            console.log("今日完成数量" + rArr4.length + "列表[" + rArr4 + "]");
            return rArr4
        } catch (error) {
            console.log(error);
        }
    }
    async get_rw(r2, r4) { // 进入答题任务
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/task/get_rw',
                headers: {
                    'C-model': 'android',
                    'C-type': 'app-miniapp',
                    'C-version': '2.7.7',
                    token: this.token,
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                    'Content-Type': 'application/json;charset=UTF-8',
                    Host: 'api.shiguangjia.cn',
                    Connection: 'Keep-Alive',
                    //Cookie: this.cookie,
                    'content-type': 'application/json'
                },
                body: { rw_id: r2, pk: '' },
                json: true
            };
            //console.log(options);
            let result = await httpRequest(options, "进入答题任务");
            //console.log(result);
            if (result.code == 1) {
                //DoubleLog(`账号[${this.index}]  进入答题任务成功: ${result.msg}`);
                //console.log(`本次答题id为[${result.data.rw.id}&${result.data.rw.rw_id}]`)
                //console.log(`广告标题为${result.data.rw.name},任务标题为${result.data.rw.short_name}`)
                //console.log(`任务类型为${result.data.rw.tags_text}&${result.data.rw.type_text},任务状况为${result.data.rw.status_text}`);
                await wait(3)
                await this.get_recoord(r4)
            } else {
                DoubleLog(`账号[${this.index}]  进入答题任务:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async get_recoord(r4) { // 进入答题
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/task/get_record',
                headers: {
                    'C-model': 'android',
                    'C-type': 'app-miniapp',
                    'C-version': '2.7.7',
                    token: this.token,
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                    'Content-Type': 'application/json;charset=UTF-8',
                    Host: 'api.shiguangjia.cn',
                    Connection: 'Keep-Alive',
                    //Cookie: this.cookie,
                    'content-type': 'application/json'
                },
                body: { record_id: r4 },
                json: true
            };

            //console.log(options);
            let result = await httpRequest(options, "进入答题");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  进入答题成功: ${result.msg}`);
                console.log(`本次答题id为[${result.data.rw.rw_id}]`)
                console.log(`广告标题[${result.data.rw.name}]`)
                //console.log(`任务类型[${result.data.rw.tags_text}]&[${result.data.rw.type_text}],任务状况[${result.data.rw.status_text}]`);
                await wait(3)
                await this.get_qlist(r4)
            } else {
                DoubleLog(`账号[${this.index}]  进入答题:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    //重新获取的任务
    async get_qlist(r4) { // 获取答题列表
        let idArr = []
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/task/get_qlist',
                headers: {
                    'C-model': 'android',
                    'C-type': 'app-miniapp',
                    'C-version': '2.7.7',
                    token: this.token,
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                    'Content-Type': 'application/json;charset=UTF-8',
                    Host: 'api.shiguangjia.cn',
                    Connection: 'Keep-Alive',
                    //Cookie: this.cookie,
                    'content-type': 'application/json'
                },
                body: { record_id: r4 },
                json: true
            };
            //console.log(options);
            let result = await httpRequest(options, "获取答题列表");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  获取题目列表成功: ${result.msg}`);
                //console.log(`本次答题Key为[${result.data.key}]`)
                let k = result.data.key
                for (let i in result.data.question) {
                    console.log(`题目[${i}],id[${result.data.question[i].id}],问题题目${result.data.question[i].question}`);
                    let id = result.data.question[i].id
                    await wait(1)
                    idArr.push(id)
                    await wait(2)
                }
                await wait(3)
                await this.sub_papers(r4, k, idArr)
            } else {
                DoubleLog(`账号[${this.index}]  获取题目列表:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async sub_papers(r4, k, idArr) { // 提交答案
        try {
            let rs = await this.api()
            function r(r00) {
                if (r00.length == 3) {
                    let q0 = idArr[0]
                    let q1 = idArr[1]
                    let q2 = idArr[2]
                    let ppp0 = rs.qid[q0]
                    let ppp1 = rs.qid[q1]
                    let ppp2 = rs.qid[q2]
                    if (ppp0 !== undefined && ppp1 !== undefined && ppp2 !== undefined) {
                        return [
                            { qid: 0, answer: [ppp0], error: false },
                            { qid: 1, answer: [ppp1], error: false },
                            { qid: 2, answer: [ppp2], error: false }
                        ]
                    }
                } else if (r00.length == 4) {
                    let q0 = idArr[0]
                    let q1 = idArr[1]
                    let q2 = idArr[2]
                    let q3 = idArr[3]
                    let ppp0 = rs.qid[q0]
                    let ppp1 = rs.qid[q1]
                    let ppp2 = rs.qid[q2]
                    let ppp3 = rs.qid[q3]
                    if (ppp0 !== undefined && ppp1 !== undefined && ppp2 !== undefined && ppp3 !== undefined) {
                        return [
                            { qid: 0, answer: [ppp0], error: false },
                            { qid: 1, answer: [ppp1], error: false },
                            { qid: 2, answer: [ppp2], error: false },
                            { qid: 3, answer: [ppp3], error: false }
                        ]
                    }
                }
            }
            let pp = r(idArr)
            //console.log(pp);
            if (pp !== undefined) {
                let options = {
                    method: 'POST',
                    url: 'https://api.shiguangjia.cn/api/task/sub_papers',
                    headers: {
                        'C-model': 'android',
                        'C-type': 'app-miniapp',
                        'C-version': '2.7.7',
                        token: this.token,
                        'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                        'Content-Type': 'application/json;charset=UTF-8',
                        Host: 'api.shiguangjia.cn',
                        Connection: 'Keep-Alive',
                        //Cookie: this.cookie,
                        'content-type': 'application/json'
                    },
                    body: {
                        record_id: r4,
                        key: k,
                        papers: pp
                    },
                    json: true
                };
                //console.log(options);
                let result = await httpRequest(options, "提交答案");
                //console.log(result);
                if (result.code == 1) {
                    DoubleLog(`账号[${this.index}]  提交答案成功: ${result.msg}`);
                    console.log(options.body.papers);

                } else {
                    DoubleLog(`账号[${this.index}]  提交答案:失败 ❌ 了呢,原因未知！`);
                    console.log(result);
                    console.log(options.body.papers);

                }
            } else {
                console.log("题库中没有这道题呢现在为你重新答题延迟15s");
                console.log('\n如果一直出现循环10次以上,那么您就手动做一下,可能答案真的不全,\n然后把答案和日志截图发我QQ860562056就行.主要是题目ID题目和答案这三个,在此感谢你');
                await wait(15);
                await this.get_qlist(r4)
            }
        } catch (error) {
            console.log(error);
        }
    }


    //正在进行的任务 做
    async get_qlist2(r4) { // 获取答题列表
        let idArr = []
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/task/get_qlist',
                headers: {
                    'C-model': 'android',
                    'C-type': 'app-miniapp',
                    'C-version': '2.7.7',
                    token: this.token,
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                    'Content-Type': 'application/json;charset=UTF-8',
                    Host: 'api.shiguangjia.cn',
                    Connection: 'Keep-Alive',
                    //Cookie: this.cookie,
                    'content-type': 'application/json'
                },
                body: { record_id: r4 },
                json: true
            };
            //console.log(options);
            let result = await httpRequest(options, "获取答题列表");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  获取题目列表成功: ${result.msg}`);
                //console.log(`本次答题Key为[${result.data.key}]`)
                let k = result.data.key
                for (let i in result.data.question) {
                    console.log(`题目[${i}],id[${result.data.question[i].id}],问题题目${result.data.question[i].question}`);
                    let id = result.data.question[i].id
                    await wait(1)
                    idArr.push(id)
                    await wait(2)
                }
                await wait(3)
                await this.sub_papers2(r4, k, idArr)
            } else {
                DoubleLog(`账号[${this.index}]  获取题目列表:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async sub_papers2(r4, k, idArr) { // 提交答案
        try {
            let rs = await this.api()
            function r(r00) {
                if (r00.length == 3) {
                    let q0 = idArr[0]
                    let q1 = idArr[1]
                    let q2 = idArr[2]
                    let ppp0 = rs.qid[q0]
                    let ppp1 = rs.qid[q1]
                    let ppp2 = rs.qid[q2]
                    if (ppp0 !== undefined && ppp1 !== undefined && ppp2 !== undefined) {
                        return [
                            { qid: 0, answer: [ppp0], error: false },
                            { qid: 1, answer: [ppp1], error: false },
                            { qid: 2, answer: [ppp2], error: false }
                        ]
                    }
                } else if (r00.length == 4) {
                    let q0 = idArr[0]
                    let q1 = idArr[1]
                    let q2 = idArr[2]
                    let q3 = idArr[3]
                    let ppp0 = rs.qid[q0]
                    let ppp1 = rs.qid[q1]
                    let ppp2 = rs.qid[q2]
                    let ppp3 = rs.qid[q3]
                    if (ppp0 !== undefined && ppp1 !== undefined && ppp2 !== undefined && ppp3 !== undefined) {
                        return [
                            { qid: 0, answer: [ppp0], error: false },
                            { qid: 1, answer: [ppp1], error: false },
                            { qid: 2, answer: [ppp2], error: false },
                            { qid: 3, answer: [ppp3], error: false }
                        ]
                    }
                }
            }
            let pp = r(idArr)
            //console.log(pp);
            if (pp !== undefined) {
                let options = {
                    method: 'POST',
                    url: 'https://api.shiguangjia.cn/api/task/sub_papers',
                    headers: {
                        'C-model': 'android',
                        'C-type': 'app-miniapp',
                        'C-version': '2.7.7',
                        token: this.token,
                        'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/29.818182)',
                        'Content-Type': 'application/json;charset=UTF-8',
                        Host: 'api.shiguangjia.cn',
                        Connection: 'Keep-Alive',
                        //Cookie: this.cookie,
                        'content-type': 'application/json'
                    },
                    body: {
                        record_id: r4,
                        key: k,
                        papers: pp
                    },
                    json: true
                };
                //console.log(options);
                let result = await httpRequest(options, "提交答案");
                //console.log(result);
                if (result.code == 1) {
                    DoubleLog(`账号[${this.index}]  提交答案成功: ${result.msg}`);
                    console.log(options.body.papers);

                } else {
                    DoubleLog(`账号[${this.index}]  提交答案:失败 ❌ 了呢,原因未知！`);
                    console.log(result);
                    console.log(options.body.papers);

                }
            } else {
                console.log('题库中没有您的这条题目,请手动答题后将答案发送给QQ860562056');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async user_info() { // 个人信息
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/user/get_userinfo',
                headers: {
                    Host: 'api.shiguangjia.cn',
                    'c-model': 'android',
                    'c-type': 'app',
                    'c-shebei-id': this.shebei_id,
                    'c-versioncode': '215',
                    'c-app-channel': 'official',
                    'c-shebei-info': '{"product":"platina","version_type":"user","display":"QKQ1.190910.002 test-keys","push_qx":"1","sdk_int":"29","manufacturer":"Xiaomi","hardward":"qcom","system":"Android 10","build_id":"QKQ1.190910.002","device_resolution":"1080x2154","bootloader":"unknown","fingerprint":"Xiaomi/platina/platina:10/QKQ1.190910.002/V12.0.1.0.QDTCNXM:user/release-keys","model":"MI 8 Lite","lang":"zh","device":"platina","brand":"Xiaomi","board":"sdm660"}',
                    token: this.token,
                    'c-version': '2.1.2',
                    //cookie: 'PHPSESSID=7c7tk2fplm01u3nv5oail8aj8v',
                    'user-agent': 'okhttp/4.7.2'
                }
            };
            //console.log(options);
            let result = await httpRequest(options, "个人信息");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  UID: ${result.data.user.uid},名字[${result.data.user.mc}]当前光子[${result.data.user.zqian}]`);
                if (result.data.user.zqian >= 1000) {
                    console.log('该账号当前可以提现')
                    if (this.shebei_id !== undefined) {
                        console.log('\n================== 开始提现 ==================\n');
                        await wait(3)
                        await this.tx_check();
                    } else {
                        console.log("未填写c-shebei-id,不执行提现");
                    }
                }
            } else if (result.code == -1) {
                DoubleLog(`账号[${this.index}]  查询失败,原因${result.msg}！`);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async tx_check() { // 提现检测
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/user/gz_tx_check',
                headers: {
                    Host: 'api.shiguangjia.cn',
                    'c-model': 'android',
                    'c-type': 'app',
                    'c-shebei-id': this.shebei_id,
                    'c-versioncode': '215',
                    'c-app-channel': 'official',
                    'c-shebei-info': '{"product":"platina","version_type":"user","display":"QKQ1.190910.002 test-keys","push_qx":"1","sdk_int":"29","manufacturer":"Xiaomi","hardward":"qcom","system":"Android 10","build_id":"QKQ1.190910.002","device_resolution":"1080x2154","bootloader":"unknown","fingerprint":"Xiaomi/platina/platina:10/QKQ1.190910.002/V12.0.1.0.QDTCNXM:user/release-keys","model":"MI 8 Lite","lang":"zh","device":"platina","brand":"Xiaomi","board":"sdm660"}',
                    token: this.token,
                    'c-version': '2.1.2',
                    //cookie: 'PHPSESSID=7c7tk2fplm01u3nv5oail8aj8v',
                    'user-agent': 'okhttp/4.7.2'
                }
            };
            //console.log(options);
            let result = await httpRequest(options, "检查是否可提现");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  当前可以提现: ${result.msg},本次可提现[${result.data.money}]`);
                await wait(5)
                await this.tx_do()
            } else if (result.code == -1) {
                DoubleLog(`账号[${this.index}]  当前不可以提现,原因${result.msg}！`);
            } else if (result.code == -2) {
                DoubleLog(`账号[${this.index}]  当前不可以提现,原因${result.msg}！`);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async tx_do() { // 提现
        try {
            let options = {
                method: 'POST',
                url: 'https://api.shiguangjia.cn/api/user/gz_tx',
                headers: {
                    Host: 'api.shiguangjia.cn',
                    'c-model': 'android',
                    'c-type': 'app',
                    'c-shebei-id': this.shebei_id,
                    'c-versioncode': '215',
                    'c-app-channel': 'official',
                    'c-shebei-info': '{"product":"platina","version_type":"user","display":"QKQ1.190910.002 test-keys","push_qx":"1","sdk_int":"29","manufacturer":"Xiaomi","hardward":"qcom","system":"Android 10","build_id":"QKQ1.190910.002","device_resolution":"1080x2154","bootloader":"unknown","fingerprint":"Xiaomi/platina/platina:10/QKQ1.190910.002/V12.0.1.0.QDTCNXM:user/release-keys","model":"MI 8 Lite","lang":"zh","device":"platina","brand":"Xiaomi","board":"sdm660"}',
                    token: this.token,
                    'c-version': '2.1.2',
                    'content-type': 'application/x-www-form-urlencoded',
                    //cookie: 'PHPSESSID=7c7tk2fplm01u3nv5oail8aj8v',
                    'user-agent': 'okhttp/4.7.2'
                },
                form: { qz_wx: '0' }
            };
            //console.log(options);
            let result = await httpRequest(options, "提现");
            //console.log(result);
            if (result.code == 1) {
                DoubleLog(`账号[${this.index}]  提现成功: ${result.msg},当前提现[${result.data.money}]`);
            } else {
                DoubleLog(`账号[${this.index}]  提现失败,未知原因！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

}

!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());


// #region ********************************************************  固定代码  ********************************************************

// 变量检查与处理
async function checkEnv() {
    if (userCookie) {
        // console.log(userCookie);
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userCount}个账号`), true;//true == !0
}
// =========================================== 不懂不要动 =========================================================
// 网络请求 (get, post等)
async function httpRequest(options, name) { var request = require("request"); return new Promise((resolve) => { if (!name) { let tmp = arguments.callee.toString(); let re = /function\s*(\w*)/i; let matches = re.exec(tmp); name = matches[1] } if (debug) { console.log(`\n【debug】===============这是${name}请求信息===============`); console.log(options) } request(options, function (error, response) { if (error) throw new Error(error); let data = response.body; try { if (debug) { console.log(`\n\n【debug】===============这是${name}返回数据==============`); console.log(data) } if (typeof data == "string") { if (isJsonString(data)) { let result = JSON.parse(data); if (debug) { console.log(`\n【debug】=============这是${name}json解析后数据============`); console.log(result) } resolve(result) } else { let result = data; resolve(result) } function isJsonString(str) { if (typeof str == "string") { try { if (typeof JSON.parse(str) == "object") { return true } } catch (e) { return false } } return false } } else { let result = data; resolve(result) } } catch (e) { console.log(error, response); console.log(`\n ${name}失败了!请稍后尝试!!`) } finally { resolve() } }) }) }
// 等待 X 秒
function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000) }) }
// 双平台log输出
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `\n${data}` } } else { console.log(`${data}`); msg += `\n${data}` } }
// 发送消息
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
