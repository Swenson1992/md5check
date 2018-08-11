var net = require('net')
var port = 12306
var host = "192.100.10.28"

var client = new net.Socket()

var socket = client.connect(port, host)
var runInternal;

client.on('error', function (error) {
    runInternal = setInterval(function () {
        console.error('Server Connecting ......');
        var socket = client.connect(port, host)
    }, 1000);
});

client.on('close', function () {
    runInternal = setInterval(function () {
        console.error('Server Connecting ......');
        var socket = client.connect(port, host)
    }, 1000);
});

client.on('connect', function () {
    console.log('client connect Ok.');
    clearInterval(runInternal);

    setInterval(function () {
        var newDate = formatDate()
        sendClientResponse = newDate + " md5?"
        var len = Buffer.byteLength(sendClientResponse);
        var sendDbBuffer = new Buffer(len);
        sendDbBuffer.write(sendClientResponse, 0);
        client.write(sendDbBuffer);
    }, 1000);
});
client.on('data', function (data) {
    console.error("receive server data: ", data.toString('utf8', 0));
    var dataString = data.toString('utf8', 0)
    console.log("dataString:",dataString)
    if(dataString === "false"){
        console.log("result:false")
    }else {
        console.log("result:true")
    }
});

function formatDate() {
    var d = new Date();
    var years = d.getFullYear();
    var month = add_zero(d.getMonth() + 1);
    var days = add_zero(d.getDate());
    var hours = add_zero(d.getHours());
    var minutes = add_zero(d.getMinutes());
    var seconds = add_zero(d.getSeconds());
    return years + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
}

function add_zero(temp) {
	if (temp < 10) return "0" + temp;
	else return temp;
}