let crypto = require("crypto")
let fs = require("fs")
let net = require("net")
let path = require("path")


let port = 12306


let chatServer = net.createServer()
let clientList = []
let clientListName = []
let sendClientResponse = ""

let checkMd5 = false

chatServer.on('connection', function (client) {//服务器连接客户端

    /**
     * 增加麒麟和凝思的ip获取
     */
    if (client.remoteAddress.substr(2, 4) == 'ffff') {
        /*增加凝思的name属性*/
        client.name = {
            remoteAddress: client.remoteAddress.slice(7),
            remotePort: client.remotePort,
            connectState: "连接中",
            "TYPE": "501"
        };
    } else {
        /*增加麒麟的name属性*/
        client.name = {
            remoteAddress: client.remoteAddress,
            remotePort: client.remotePort,
            connectState: "连接中",
            "TYPE": "501"
        };
    }

    clientList.push(client);
    clientListName.push(client.name);

    client.on('data', function (data) {
        console.info('收到【' + client.name.remoteAddress + ":" + client.name.remotePort + ' 】验证MD5值: ' + data.toString('utf8', 0));
        console.log("欢迎 " + client.name.remoteAddress + " 连接！")
        //进行客户端验证
        let login_md5 = "", index_md5 = "", adiWebservice_md5 = "", dtiWebservice_md5 = "", main_md5 = "", app_md5 = "";
        if (!!checkMd5) {
            login_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/src/login.html")), 'utf8').digest('hex');
            index_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/src/index.html")), 'utf8').digest('hex');
            adiWebservice_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/src/app/adi/adiWebService.js")), 'utf8').digest('hex');
            dtiWebservice_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/src/app/adi/dtiWebService.js")), 'utf8').digest('hex');
            main_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/main.js")), 'utf8').digest('hex');
            app_md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(process.env.APPPATH, "/resources/app/src/app/index/app.js")), 'utf8').digest('hex');
        }
        //let utilmd5 = crypto.createHash('md5').update(fs.readFileSync("./util.js"), 'utf8').digest('hex');

        if (!checkMd5 || (login_md5 == "8f4a4f315b5e6de39856a3a5d1130f40"
            && index_md5 == "c6960c8817a6f074dcde9a5948e6e8df"
            && adiWebservice_md5 == "236b4dbd5be8ddc6cc72bbfc8dc48ff5"
            && dtiWebservice_md5 == "f3385dd2eb2a296c0e3f871fdc02436a"
            && main_md5 == "40fa928d0c67a491aae04e5fc6e87201"
            && app_md5 == "247c25b59fbc4713a7ee8286b5cc52df")) {

            sendClientResponse = "true"
            let len = Buffer.byteLength(sendClientResponse);
            let sendDbBuffer = new Buffer(len);
            sendDbBuffer.write(sendClientResponse, 0);
            client.write(sendDbBuffer);
        } else {
            console.error("验证失败")
            sendClientResponse = "false"
            let len = Buffer.byteLength(sendClientResponse);
            let sendDbBuffer = new Buffer(len);
            sendDbBuffer.write(sendClientResponse, 0);
            client.write(sendDbBuffer);
        }
    });
    //监听客户端终止
    client.on('end', function () {
        let recentEndDate = new Date();
        //如果某个客户端断开连接，node控制台就会打印出来
        let index = clientList.indexOf(client);
        if (index != -1) {
            clientList.splice(index, 1);
            for (let temp = 0; temp < clientListName.length; temp++) {
                if (clientListName[temp].remotePort === client.name.remotePort) {
                    console.info('Client ' + client.name.remoteAddress + ':' + client.name.remotePort + ' exited');
                    clientListName.splice(temp, 1);
                    break;
                }
            }
        }
        //commonSourceServer.gjReceivePushArray.push(clientListName);
        //commonSourceServer.EventEmitter.emit("receiveGJPushData");
    });
    /*记录错误*/
    client.on('error', function (e) {
        console.error(client.name.remoteAddress + 'Client Error :' + e);
    });
    //监听客户端关闭
    client.on('close', function () {
        let recentDate = new Date();//如果某个客户端关闭，node控制台就会打印出来

        let index = clientList.indexOf(client);
        if (index != -1) {
            clientList.splice(index, 1);
            for (let temp = 0; temp < clientListName.length; temp++) {
                if (clientListName[temp].remotePort === client.name.remotePort) {
                    console.info('Client【' + client.name.remoteAddress + ':' + client.name.remotePort + '】exited');
                    clientListName.splice(temp, 1);
                    break;
                }
            }
        }
    });
});

//服务器端口
chatServer.listen(port, function () {
    console.log("listen port: " + port);
});
