var chessFun = require('./chessFun')


chess = {
    rooms : [
        {
            name : "楚汉争霸",
            personNum:2,
            person : ["小明","fsa"],
            currentSituation : [],//象棋局面
            gameState : '未开始',//游戏状态
            preparePeople : [],//准备的人，在未开始时判断，如果小于2，所有人都能准备，等于2，游戏开始，其他玩家不能再准备
            red : '',//红方是哪个玩家
            black : '',//黑方是哪个玩家
            turn : '',//轮到哪一方,''是还未开始，'red'是红方，'black'是黑方
            redBeGeneral : false,//红方现在是否被将军
            blackBeGeneral : false,//黑方现在是否被将军
            redGameTimer : 0,//局时
            blackGameTimer : 0,//局时
            redStepTimer : 0,//步时
            blackStepTimer : 0,//步时
            winner : '',//red或black，或''
            timer:{//一个房间需要5个存储定时器的变量
                redGameTimerId : 123,
                blackGameTimerId : 123,
                redStepTimerId : 123,
                blackStepTimerId : 123,
                gameTimerId : 123,
            },
            gameMsg:[{
                type:'msg',
                msg:'游戏开始',
                red:'小红',
                black:'小黑'
            },],//房间游戏信息，游戏开始、落子、游戏结束
            //象棋规则，房间规则
        },
        {
            name:"来发电磁炮",
            personNum:2,
            person:["小红","小金刚"],
            currentSituation : [],
            gameState : '未开始',//游戏状态
            preparePeople : [],//准备的人，在未开始时判断，如果小于2，所有人都能准备，等于2，游戏开始，其他玩家不能再准备
            red : '',//红方是哪个玩家
            black : '',//黑方是哪个玩家
            turn : '',//轮到哪一方,''是还未开始，'red'是红方，'black'是黑方
            redBeGeneral : false,//红方现在是否被将军
            blackBeGeneral : false,//黑方现在是否被将军
            redGameTimer : 0,//局时
            blackGameTimer : 0,//局时
            redStepTimer : 0,//步时
            blackStepTimer : 0,//步时
            winner : '',//red或black，或''
            timer:{//一个房间需要5个存储定时器的变量
                redGameTimerId : 123,
                blackGameTimerId : 123,
                redStepTimerId : 123,
                blackStepTimerId : 123,
                gameTimerId : 123,
            },
            gameMsg:[
                {
                    type:'msg',
                    msg:'游戏开始',
                    red:'小红',
                    black:'小黑'
                },
                {
                    type:'落子',
                    color:'red',
                    nickName:'小红',
                    from: [0,0],
                    to: [0,1],
                    piece:'車',
                },
                {
                    type:'落子',
                    color:'black',
                    nickName:'小黑',
                    from: [0,0],
                    to: [0,1],
                    piece:'車',
                },
                {
                    type:'msg',
                    msg:'游戏结束',
                    winner:'小红',
                    loser:'小黑',
                    winType:'双車错'
                }
            ],//将信息存储到数组里,更新游戏信息
        },
    ],
    getRoomsNum:{//如果这个结果是undefined，说明还没有这个房间，如果是数字，则是房间号
        roomName : {//如果是房间名，用这个来查
            "楚汉争霸":0,
            "来发电磁炮":1
        },
        nickName : {//如果是玩家昵称，用这个来查
            "小明":0,
            "fsa":0,
            "小红":1,
            "小金刚":1
        }

    },
    hallPeople : ["小李","令狐冲","萧峰"],//大厅里的人，登录了不一定在大厅，还可能在房间
    loggedPeople : ["小李","令狐冲","萧峰"],//已经登录的人，没登录一定不在大厅和房间
    playerMsg:{
        "小李":[
            {
                type:'msg',
                msg:'您已经登录'
            },
            {
                type:'邀请',
                inviter:'令狐冲',
                roomName:'楚汉争霸'
            },
            {
                type:'胜负',
                result:'胜利',//失败
            },
            {
                type:'位置改变',
                from:'大厅',
                to:'房间',
                roomName:'楚汉争霸',
            },
        ],
        "令狐冲":[],
        "萧峰":[],
    },
    //-----------------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑上面的是数据




    //-----------------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓下面的是房间和登录相关操作
    isLogged : function(name){//检测是否登录
        return (this.loggedPeople.indexOf(name) !== -1)
    },
    isInHall : function(name){//是否在大厅
        return (this.hallPeople.indexOf(name) !== -1)
    },
    isInRoom : function(name){//是否在房间
        if(this.getRoomsNum.nickName[name] === undefined){//不在房间
            return false
        }else{
            return true
        }
    },
    isPrepare : function(name){
        let result = false
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum === undefined){return false}
        if(this.rooms[roomNum].preparePeople.indexOf(name) !== -1){
            result = true
        }
        return result
    },
    getAllRoomPlayers : function(){//获得所有房间里的人
        return Object.keys(this.getRoomsNum.nickName)
    },
    getSameRoomPlayers :function(name){
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum){return this.rooms[roomNum].person}
        return undefined
    },
    getAllHallPlayers : function(){//获得所有大厅里的人
        return this.hallPeople
    },
    getAllRoomNames : function(){
        return Object.keys(this.getRoomsNum.roomName)
    },
    getPlayerMsg : function(name){
        return this.playerMsg[name]
    },
    getCurrentRoom : function(name){
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum){return this.rooms[roomNum].name}
        return undefined
    },
    whereUser : function(name){
        if(this.isInHall(name)){
            return '大厅'
        }else{
            return '房间'
        }
    },
    getRoomGameState : function(name){
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum !== undefined){
            let result = this.rooms[roomNum].gameState
            if(result !== ''){
                return result
            }
        }
        return ''
    },
    getGameMsg : function(name){
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum){return this.rooms[roomNum].gameMsg}
        return undefined
    },
    getRoomTime : function(nickname){
        let roomNum = this.getRoomsNum.nickName[nickname]
        if(roomNum === undefined){ return {} }//没有就返回空数组
        let redGameTimer = this.rooms[roomNum].redGameTimer
        let blackGameTimer = this.rooms[roomNum].blackGameTimer
        let redStepTimer = this.rooms[roomNum].redStepTimer
        let blackStepTimer = this.rooms[roomNum].blackStepTimer
        return {
            redGameTimer : redGameTimer,
            blackGameTimer : blackGameTimer,
            redStepTimer : redStepTimer,
            blackStepTimer : blackStepTimer,
        }
    },
    //写个创建房间，销毁房间
    createRoom : function(name,roomName){//创建房间时，自动进入房间
        if(this.getRoomsNum.roomName[roomName] === undefined && (!this.isInRoom(name))){
            console.log("创建房间")
            this.rooms.push({
                name:roomName,
                personNum:0,
                person:[],
                currentSituation : [],//象棋局面
                gameState : '未开始',//游戏状态
                preparePeople : [],
                red : '',//红方是哪个玩家
                black : '',//黑方是哪个玩家
                turn : '',//轮到哪一方,''是还未开始，'red'是红方，'black'是黑方
                redBeGeneral : false,//红方现在是否被将军
                blackBeGeneral : false,//黑方现在是否被将军
                redGameTimer : 0,//局时
                blackGameTimer : 0,//局时
                redStepTimer : 0,//步时
                blackStepTimer : 0,//步时
                winner : '',//red或black，或''
                gameMsg:[],
                timer:{//一个房间需要5个存储定时器的变量
                    redGameTimerId : 123,
                    blackGameTimerId : 123,
                    redStepTimerId : 123,
                    blackStepTimerId : 123,
                    gameTimerId : 123,
                }
            })
            this.getRoomsNum.roomName[roomName] = this.rooms.length - 1//记录索引--------
            console.log(roomName)
            console.log("当前房间都有：",this.getRoomsNum)
            console.log("自动进入房间")
            this.gotoRoom(name,roomName)
        }else{
            console.log("已存在房间名，不能使用该名字创建房间")
        }
        
    },
    destroyRoom : function(roomName){
        if(this.getRoomsNum.roomName[roomName]){//如果有这个房间
            console.log("开始删除房间")
            this.clearAllTimer(roomName)//先清除所有定时器
            this.rooms.splice(this.getRoomsNum.roomName[roomName],1)
            Reflect.deleteProperty(this.getRoomsNum.roomName, roomName)//es6新语法，删除对象属性
            console.log("房间删除完成！")
        }else{
            console.log("不存在该房间名，请注意函数的使用")
        }
        
    },
    exitRoom : function(name){
        if(this.isInRoom(name)){//这个是对象，只可能有一个属性，操作一次就好了
            let roomNum = this.getRoomsNum.nickName[name]
            let that = this
            // while(this.rooms[roomNum].person.indexOf(name)  !== -1){//有可能bug，玩家多次进入了房间
            //     this.rooms[roomNum].person.splice(this.rooms[roomNum].person.indexOf(name),1)
            //     this.rooms[roomNum].personNum--
            //     if(this.getRoomsNum.nickName[name]){
            //         Reflect.deleteProperty(this.getRoomsNum.nickName, name)//删除玩家在房间的信息
            //     }
            // }
            this.rooms[roomNum].person = this.rooms[roomNum].person.filter(function(item){
                if(item === name){
                    that.rooms[roomNum].personNum--
                    if(that.getRoomsNum.nickName[name] !== undefined){
                        Reflect.deleteProperty(that.getRoomsNum.nickName, name)//删除玩家在房间的信息
                    }
                }
                return item !== name
            })

            console.log("退出房间---")
        }
    },
    exitHall : function(name){
        this.hallPeople = this.hallPeople.filter(function(item){
            return item !== name
        })
    },
    gotoHall : function(name){//房间人数为0时，自动删除房间,返回大厅
        let roomNum = this.getRoomsNum.nickName[name]//获取该房间索引
        let result = false
        if( this.isInRoom(name) ){//在房间
            this.playerUnPrepare(name)//先取消准备
            this.exitRoom(name)//退出房间
            console.log("加入大厅")
            this.hallPeople.push(name)
            result = true
        }

        if(this.rooms[roomNum] && this.rooms[roomNum].personNum === 0){//房间人数为0时，自动删除房间
            console.log("房间人数为0，自动删除房间")
            this.destroyRoom(this.rooms[roomNum].name)//rooms里的房间名是.name属性
        }
        return result
    },
    gotoRoom : function(name,roomName){
        let roomNum = this.getRoomsNum.roomName[roomName]
        if(this.isInRoom(name)){ 
            console.log(name+"已在房间，不能继续进入房间")
            return false
        }
        if( this.isInHall(name) && this.rooms[roomNum]){//在大厅，且已经有这个房间
            this.exitHall(name)
            console.log("加入房间:"+roomName)
            if(this.rooms[roomNum].person.indexOf(name) === -1){//房间里有自己的话就不用加了
                this.rooms[roomNum].person.push(name)
                this.rooms[roomNum].personNum++
                this.getRoomsNum.nickName[name] = this.getRoomsNum.roomName[roomName]
            }
            return true
        }else{
            console.log("gotoRoom使用不正确，请注意函数的使用")
            return false
        }
    },
    //登录
    login : function(nickname){
        if( this.isLogged(nickname) || this.isInRoom(nickname) || this.isInHall(nickname)){
            console.log("不可再次登录")
        }else{
            // console.log("可以登录")
            this.hallPeople.push(nickname)
            this.loggedPeople.push(nickname)
            this.playerMsg[nickname] = []
            console.log("登录成功")
        }
    },
    // 退出登录
    logout : function(nickname){
        if( this.isLogged(nickname) || this.isInRoom(nickname) || this.isInHall(nickname)){
            //退出游戏代码
            if(this.isInRoom(nickname)){
                this.gotoHall(nickname)
            }
            this.hallPeople.splice(this.hallPeople.indexOf(nickname),1)
            this.loggedPeople.splice(this.loggedPeople.indexOf(nickname),1)
            return true
        }else{
            console.log("玩家还没登录")
            return false
        }
    },
    
    //-----------------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑上面的是房间和登录相关操作
    //游戏开始，是自动的
    gameStart : function(roomName){//游戏数据初始化
        console.log(roomName,'roomName')
        let roomNum = this.getRoomsNum.roomName[roomName]
        console.log(roomNum,'roomNum')
        console.log(this.rooms[roomNum].gameState,'gameState')
        console.log(this.rooms[roomNum].preparePeople,'preparePeople')
        if(this.rooms[roomNum].gameState === '未开始' && this.rooms[roomNum].preparePeople.length >= 2){
            console.log("游戏开始")
            this.rooms[roomNum].gameState = '已开始'
            let red = this.rooms[roomNum].preparePeople[0]
            let black = this.rooms[roomNum].preparePeople[1]
            this.rooms[roomNum].currentSituation = JSON.parse(JSON.stringify(chessFun.defaultSituation))
            this.rooms[roomNum].red = red
            this.rooms[roomNum].black = black
            this.rooms[roomNum].turn = 'red'
            this.rooms[roomNum].redGameTimer = 200,//局时,单位秒
            this.rooms[roomNum].blackGameTimer = 200,//局时
            this.rooms[roomNum].redStepTimer = 30,//步时
            this.rooms[roomNum].blackStepTimer = 30,//步时
            this.rooms[roomNum].winner = ''
            this.rooms[roomNum].gameMsg = [{
                type:'msg',
                msg:'游戏开始',
                red:red,
                black:black
            },]
            this.rooms[roomNum].timer = {//一个房间需要5个存储定时器的变量
                redGameTimerId : 123,
                blackGameTimerId : 123,
                redStepTimerId : 123,
                blackStepTimerId : 123,
                gameTimerId : 123,
            }
            console.log("游戏初始化完毕，祝您游戏愉快！")
            //全局时钟
            this.gameTimerStart(roomName)//全局输赢状态检测，出结果则清除所有定时器，开启红方计时
        }else{
            if(this.rooms[roomNum].gameState === '已开始'){
                console.log("游戏已经开始了，函数使用错误，请注意函数的使用")
            }
            if(this.rooms[roomNum].preparePeople.length < 2){
                console.log("人数小于2，还不能开始游戏")
            }
        }
    },
    //游戏结束函数不进行胜负的赋值，只进行胜负赋值后的处理
    gameOver : function(roomName,winner){//三个功能,游戏结束停止计时器，并输出终局信息，部分初始化
        let roomNum = this.getRoomsNum.roomName[roomName]
        clearInterval(this.rooms[roomNum].timer.gameTimerId)//立即停止全局定时器

        
        // let winner = this.rooms[roomNum].winner
        let winnerName
        let loserName
        let winnerColor
        let loserColor
        console.log(winner,'winner')
        if(winner === 'red'){
            winnerName = this.rooms[roomNum].red
            loserName = this.rooms[roomNum].black
            winnerColor = '红'
            loserColor = '黑'
        }else if (winner === 'black'){
            winnerName = this.rooms[roomNum].black
            loserName = this.rooms[roomNum].red
            winnerColor = '黑'
            loserColor = '红'
        }else{
            console.log("程序出错，请注意函数的使用！")
        }
        console.log(winnerName,'winnerName')
        this.rooms[roomNum].gameMsg.push({
            type:'msg',
            msg:'游戏结束',
            winner:winnerName,
            loser:loserName,
            winnerColor : winnerColor,
            loserColor : loserColor,
            winType:'双車错'
        })
        console.log("触发了gameOver函数")
        // console.log("恭喜"+winnerName+"获胜！")
        // console.log('全局信息',this.rooms[roomNum].gameMsg)
        if(winnerName){
            console.log("初始化房间属性")
            this.gameOverInit(roomName)//------------------------------------------------
            console.log("房间属性初始化完毕！")
            this.clearAllTimer(roomName)
        }else{
            console.log("输入错误，请注意函数的使用")
        }
    },
    gameOverInit : function(roomName){
        let roomNum = this.getRoomsNum.roomName[roomName]
        this.rooms[roomNum].turn = ''
        this.rooms[roomNum].redBeGeneral = false
        this.rooms[roomNum].blackBeGeneral = false
        let that = this//-------------------------------------------
        setTimeout(() => {
            that.rooms[roomNum].gameState = '未开始' //这个可以影响下一把开始时间，不初始化不能开始下一把
            that.rooms[roomNum].red = ''
            that.rooms[roomNum].black = ''
            that.rooms[roomNum].winner = ''
            that.rooms[roomNum].gameMsg = []
        }, 5000)
        this.rooms[roomNum].preparePeople = []

    },
    //游戏规则，每秒运行
    
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓处理房间定时器的函数
    redGameTimerStart : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        this.rooms[roomNum].timer.redGameTimerId = setInterval(function(){ 
            that.rooms[roomNum].redGameTimer--
        }, 1000)//一秒减一秒
    },
    redGameTimerStop : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        clearInterval(that.rooms[roomNum].timer.redGameTimerId)
    },
    
    blackGameTimerStart : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        this.rooms[roomNum].timer.blackGameTimerId = setInterval(function(){ 
            that.rooms[roomNum].blackGameTimer--
        }, 1000)//一秒减一秒
    },
    blackGameTimerStop : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        clearInterval(that.rooms[roomNum].timer.blackGameTimerId)
    },

    //步时
    redStepTimerStart : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        this.rooms[roomNum].timer.redStepTimerId = setInterval(function(){ 
            that.rooms[roomNum].redStepTimer--
        }, 1000)//一秒减一秒
    },
    redStepTimerStop : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        clearInterval(that.rooms[roomNum].timer.redStepTimerId)
    },
    
    blackStepTimerStart : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        this.rooms[roomNum].timer.blackStepTimerId = setInterval(function(){ 
            that.rooms[roomNum].blackStepTimer--
        }, 1000)//一秒减一秒
    },
    blackStepTimerStop : function(roomName){
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        clearInterval(that.rooms[roomNum].timer.blackStepTimerId)
    },
    //全局检测计时器,这个会自动结束
    
    //游戏时钟初始化
    gameTimerStart : function(roomName){//全局输赢状态检测，出结果则清除所有定时器，游戏结束会自动清除所有定时器
        let that = this
        let roomNum = this.getRoomsNum.roomName[roomName]
        // //开启红方时钟
        // this.redGameTimerStart(roomName)
        // this.redStepTimerStart(roomName)

        // this.redGameTimerStop(roomName)
        // this.redStepTimerStop(roomName)
        // console.log("调用了一次结束")
        //全局时钟↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        this.rooms[roomNum].timer.gameTimerId = setInterval(function(){ //检测输赢的全局计时
            if(that.rooms[roomNum].gameState === '已开始'){
                if(that.rooms[roomNum].turn === 'red'){
                    if(that.rooms[roomNum].redGameTimer <= 0 || that.rooms[roomNum].redStepTimer <= 0){
                        console.log("红方输了")
                        that.rooms[roomNum].gameState = '已结束'
                        // that.rooms[roomNum].winner = 'black'
                        let winner = 'black'
                        that.gameOver(roomName,winner)

                    }
                }else if(that.rooms[roomNum].turn === 'black'){
                    if(that.rooms[roomNum].blackGameTimer <= 0 || that.rooms[roomNum].blackStepTimer <= 0){
                        console.log("黑方输了")
                        that.rooms[roomNum].gameState = '已结束'
                        // that.rooms[roomNum].winner = 'red'
                        let winner = 'red'
                        that.gameOver(roomName,winner)
                    }
                }
            }
            // else if(that.rooms[roomNum].gameState === '已结束'){
            //     //清除所以定时器
            //     that.gameOver(roomName)//初始化房间
            //     clearInterval(that.rooms[roomNum].timer.gameTimerId)
            //     console.log("清除自己身上的时钟")
                
            // }
        }, 1000)//一秒减一秒
        //全局时钟↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        //游戏过程中时钟↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        if(this.rooms[roomNum].turn === 'red'){//轮到红方
            this.blackGameTimerStop(roomName)
            this.blackStepTimerStop(roomName)
            this.redGameTimerStart(roomName)
            this.redStepTimerStart(roomName)
        }else if(this.rooms[roomNum].turn === 'black'){
            this.redGameTimerStop(roomName)
            this.redStepTimerStop(roomName)
            this.blackGameTimerStart(roomName)
            this.blackStepTimerStart(roomName)
        }else{
            console.log("现在游戏还没开始吧")
        }
    },
    //游戏过程中计时器变化，上面写好了一些计时器，很形象
    //游戏过程时钟初始化↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    clearAllTimer : function(roomName){
        console.log("已清除所有时钟")
        this.redGameTimerStop(roomName)
        this.blackGameTimerStop(roomName)
        this.redStepTimerStop(roomName)
        this.blackStepTimerStop(roomName)
    },
    


    //这里是游戏机制↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    getPreParestate : function(name){
        if(this.isPrepare(name)){
            return '已准备'
        }
        return '未准备'
    },
    playerPrepare : function(name){//当玩家准备时触发
        console.log("玩家准备---"+name)
        let result = false
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum === undefined){return false}
        if(this.rooms[roomNum].preparePeople.indexOf(name) === -1){//加入准备队列
            this.rooms[roomNum].preparePeople.push(name)
            if(this.rooms[roomNum].preparePeople.length >= 2 && this.rooms[roomNum].gameState === '未开始'){//尝试开始游戏
                this.gameStart(this.rooms[roomNum].name)
            }
            result = true
            return result
        }   
        return result
    },
    playerUnPrepare : function(name){//当玩家取消准备时触发
        let result = false
        let roomNum = this.getRoomsNum.nickName[name]
        if(roomNum === undefined){return false}
        let playerIndex = this.rooms[roomNum].preparePeople.indexOf(name)
        if(playerIndex !== -1){//加入准备队列
            this.rooms[roomNum].preparePeople.splice(playerIndex,1)
            result = true
        }else{
            result = false
        }
        return result
    },
    gameTurnChange : function(roomName){
        let roomNum = this.getRoomsNum.roomName[roomName]
        if(this.rooms[roomNum].gameState === '已开始'){
            if(this.rooms[roomNum].turn === 'red'){//切换计时器，然后给步时重新赋值
                this.rooms[roomNum].turn = 'black'
                let color = '黑'
                this.rooms[roomNum].blackStepTimer = 30
                this.redGameTimerStop(roomName)
                this.redStepTimerStop(roomName)
                let isBeGeneral = chessFun.kingWillBeEaten(this.rooms[roomNum].currentSituation,color)
                this.rooms[roomNum].blackBeGeneral = isBeGeneral
                if(isBeGeneral){//回合开始前先看看自己老将是否被将军
                    this.rooms[roomNum].gameMsg.push({
                        type : '将军',
                        msg  :color + '方被将军！',
                        beGeneralColor : color,
                        beGeneralEnglishColor : 'black',
                    })
                    //下一步要护住老将
                }
                if(chessFun.isBeKill(this.rooms[roomNum].currentSituation,color)){
                    let winnerEnglishColor = 'red'
                    //游戏结束
                    let winner = winnerEnglishColor
                    this.gameOver(roomName,winnerEnglishColor)
                }

                this.blackGameTimerStart(roomName)
                this.blackStepTimerStart(roomName)
            }else if(this.rooms[roomNum].turn === 'black'){
                this.rooms[roomNum].turn = 'red'
                let color = '红'
                this.rooms[roomNum].redStepTimer = 30
                this.blackGameTimerStop(roomName)
                this.blackStepTimerStop(roomName)
                let isBeGeneral = chessFun.kingWillBeEaten(this.rooms[roomNum].currentSituation,color)
                this.rooms[roomNum].redBeGeneral = isBeGeneral
                if(isBeGeneral){//回合开始前先看看自己老将是否被将军
                    this.rooms[roomNum].gameMsg.push({
                        type : '将军',
                        msg  :color + '方被将军！',
                        beGeneralColor : color,
                        beGeneralEnglishColor : 'red',
                    })
                    //下一步要护住老将
                }
                if(chessFun.isBeKill(this.rooms[roomNum].currentSituation,color)){
                    let winnerEnglishColor = 'black'
                    //游戏结束
                    let winner = winnerEnglishColor
                    this.gameOver(roomName,winnerEnglishColor)
                }

                this.redGameTimerStart(roomName)
                this.redStepTimerStart(roomName)
            }else{
                console.log("当前回合切换，不可能发生这种情况")
            }
        }
    },
    //fall
    // {
    //     type:'落子',
    //     color:'red',
    //     nickname:'小红',
    //     from: [0,0],
    //     to: [0,1],
    //     piece:'红車',
    // },
    
    fallPiece : function(fall){//api只调用这一个就好了
        let roomNum = this.getRoomsNum.nickName[fall.nickname]
        if(this.canFallPiece(fall)){
            //操作当前局面
            let toPiece = {
                name : fall.piece,
                pos : {
                    x : fall.to[0],
                    y : fall.to[1]
                }
            }
            let currentSituation = this.rooms[roomNum].currentSituation
            if(chessFun.isEnemyPiece(currentSituation,fall.to,fall.color)){
                let eatPiece = this.rooms[roomNum].currentSituation[fall.to[1]][fall.to[0]]
                this.rooms[roomNum].currentSituation[fall.from[1]][fall.from[0]] = ''
                this.rooms[roomNum].currentSituation[fall.to[1]][fall.to[0]] = fall.piece
                if(eatPiece === '红帅' || eatPiece === '黑将'){
                    //游戏结束
                    let winnerEnglishColor = fall.color
                    //游戏结束
                    let winner = winnerEnglishColor
                    this.gameOver(roomName,winnerEnglishColor)
                }
                console.log(`您吃了对面的${eatPiece}！`)
            }else{
                this.rooms[roomNum].currentSituation[fall.from[1]][fall.from[0]] = ''
                this.rooms[roomNum].currentSituation[fall.to[1]][fall.to[0]] = fall.piece
            }
            this.rooms[roomNum].gameMsg.push(fall)//落子操作
            this.gameTurnChange(this.rooms[roomNum].name)//转换回合
            return true
        }
        console.log("没有通过后端canFallPiece验证")
        return false
    },
    //不完善后面再加
    canFallPiece : function(fall){//是否能这样落子，fall是一个对象，{pieceName:車,oldXY:[0,0],newXY:[0,1]}
        let roomNum = this.getRoomsNum.nickName[fall.nickname]
        let result = false
        let condition1 = false
        let condition2 = false
        let condition3 = false
        let condition4 = false
        let pieceArr = {
            "red" : ['红兵','红砲','红車','红马','红相','红仕','红帅'],
            "black" : ['黑車','黑马','黑相','黑仕','黑将','黑砲','黑卒']
        }
        if(//传入数据fall是符合规则的
            //象棋棋盘x9y10
            fall.type === '落子' && 
            (fall.color === 'red' || fall.color === 'black') && 
            (fall.from && (fall.from instanceof Array) && fall.from.length === 2 && ( fall.from[0] >= 0 && fall.from[0] <= 8) && ( fall.from[1] >= 0 && fall.from[1] <= 10)) &&
            (fall.to && (fall.to instanceof Array) && fall.to.length === 2 && ( fall.to[0] >= 0 && fall.to[0] <= 8) && ( fall.to[1] >= 0 && fall.to[1] <= 10)) && 
            (pieceArr[fall.color].indexOf(fall.piece) !== -1 ) 
        ){
            condition1 = true
        }
        
        if(this.rooms[roomNum].turn === fall.color && //到你就能下
            fall.nickname === this.rooms[roomNum][fall.color]    //名字是对的
        ){
            condition2 = true
        }

        let currentSituation = this.rooms[roomNum].currentSituation
        let fromPiece = {
            name : fall.piece,
            pos:{
                x : fall.from[0],
                y : fall.from[1]
            }
        }
        let toPos = [fall.to[0],fall.to[1]]
        let canfalls = chessFun.canFallArr(currentSituation,fromPiece)
        canfalls.map(function(pos){
            if(pos[0] === toPos[0] && pos[1] === toPos[1]){
                condition3 = true
            }
        })

        let mycolor = fall.piece[0]
        condition4 = !chessFun.nextKingWillBeEaten(currentSituation,fall,mycolor)//这么走，你的老将会不会被吃，不会被吃，condition4-true

        result = condition1 && condition2 && condition3 && condition4
        return result
    }

  
}//这个括号是chess（rooms、getRoomsNum（nickName、roomName））


module.exports = chess
