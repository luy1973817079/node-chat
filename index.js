//1.导入net模块
var net = require('net');
var count = 0;
var user = {}//存储当前聊天室的用户
//2。创建一个tcp的服务器
var server = net.createServer(function(scoket){
    scoket.write("welcome to node chat now,"+count+"at this time,your name\r\n");
    count++;
    //监听
    var nickname;//临时存储用户输入的姓名
    var temp = "";
    scoket.on("data",function(data){
        temp += data;
        //公共的广播方法
        function broadcast(msg){
            for(var i in user){
                if(i!=nickname){
                    user[i].write(msg)
                }
            }
        }
        if(temp.indexOf("\n")===-1){
            return;
        }
        data=temp.replace(/\r|\n/g,"");
       /* data = temp.replace(/\r|\n/g,"");*/

        if(!nickname){
            //判断用户名是否重复
            if(user[data]){
                scoket.write("nickname already in use,try \r\n");
                temp = "";
                return;
            }else{
                nickname = data;
                user[nickname] = scoket;
                broad(nickname+"join the room \r\n");
            }
        }else{
            broad(nickname+"say:"+data+"\r\n");
        }
        scoket("close",function(){
            count--;
            delete  user[nickname];
            broad(nickname+"leave the room");
        })
    })
})
server.listen(9000,function(){
    console.log("server listening on 9000")
})