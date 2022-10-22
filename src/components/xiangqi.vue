
<template>
    <el-container>
        
        <el-container>
            <el-header height="100px"><h1 class="title">中国象棋</h1></el-header>
            <el-main>
                <!-- 棋盘 -->
                <div class="roomTime">
                    <div class="roomTimeBox" style="flex:2;">
                        <div class="wordBox" style="flex:1;">
                            <h2>黑方</h2>
                        </div>
                        <div class="wordBox" style="flex:1;">
                            <h3>局时：{{isInRoom ? roomMsg.blackGameTimer : '0'}}</h3>
                        </div>
                        <div  class="wordBox" style="flex:1;">
                            <h3>步时：{{isInRoom ? roomMsg.blackStepTimer : '0'}}</h3>
                        </div>
                    </div>
                    <div class="roomTimeBox" style="flex:6;"></div>
                    <div class="roomTimeBox" style="flex:2;">
                        <div class="wordBox" style="flex:1;">
                            <h2>红方</h2>
                        </div>
                        <div  class="wordBox" style="flex:1;">
                            <h3>局时：{{isInRoom ? roomMsg.redGameTimer : '0'}}</h3>
                        </div>
                        <div  class="wordBox" style="flex:1;">
                            <h3>步时：{{isInRoom ? roomMsg.redStepTimer : '0'}}</h3>
                        </div>
                    </div>
                </div>
                <div class="mainBox" @click="clickchess">
                    <!-- 棋盘里面的元素 -->
                    <img
                    class="qizi"
                    v-show="roomMsg.gameState === '已开始'"
                    v-for="(item,index) in renderarr" 
                    :key="index"
                    :src="getimg(item.name)"
                    :style="`left:${item.x*68+10}px;top:${item.y*68+10}px;`"
                    >
                    
                    <!-- <img class="qizi" :src="getimg('红車')" style="left:100px;top:100px;">
                    <img class="qizi" src="../assets/红兵.png" style="left:50px;top:50px;"> -->
                </div>
            </el-main>
            <el-footer height="100px">
                <div>
                    <el-button type="primary" class="btn" @click="fallPiece">落子</el-button>
                    <el-button type="primary" class="btn" @click="prepare"
                    v-show="whereUser === '房间' && selfGameState === '未开始' && roomMsg.gameState === '未开始' && $store.state.update.isPrepare === false"
                    >准备</el-button>
                    <el-button type="primary" class="btn" @click="unPrepare"
                    v-show="whereUser === '房间' && selfGameState === '未开始' && roomMsg.gameState === '未开始' && $store.state.update.isPrepare === true"
                    >取消准备</el-button>
                    <el-button type="primary" class="btn" v-show="whereUser === '房间' && roomMsg.gameState === '已开始'"
                    >悔棋</el-button>
                    <el-button type="primary" class="btn" v-show="whereUser === '房间' && roomMsg.gameState === '已开始'"
                    >认输</el-button>
                    <el-button type="primary" class="btn" v-show="whereUser === '房间' && roomMsg.gameState === '已开始'"
                    >求和</el-button>
                </div>
            </el-footer>
        </el-container>
        <el-aside width="500px" style="line-height:30px;">
            <h1 style="color:#db752d;font-size:40px;line-height:80px;">游戏大厅</h1> <br>
            <div>
                <h3>所有人</h3>
                <p v-for="item in $store.state.update.allLoggedPlayers">{{item}}</p><br>
            </div>
            <div>
                <h3>大厅玩家</h3>
                <p v-for="item in $store.state.update.hallPlayers">
                    {{item}} 
                    <button @click="invite(selfName,item,roomMsg.roomName)" v-if="whereUser === '房间' && ($store.state.idMsg.nickname !== item)" class="btn2">邀请</button> 
                </p> <br>
            </div>
            <div>
                <h3>所有房间</h3>
                <button class="btn1" v-if="whereUser === '大厅'" @click="createroom()">创建房间</button>
                <button class="btn1" v-if="whereUser === '房间'" @click="exitroom()">退出房间</button>
                <p v-for="item in $store.state.update.allRooms">
                    {{item}} 
                    <button v-if="whereUser === '大厅'" @click="gotoroom(item)" class="btn2">进入</button> 
                </p> <br>
            </div>
            <div v-show=" isInRoom ? $store.state.update.roomMsg :false">
                <h3>当前房间：{{ isInRoom ? roomMsg.roomName : ''}}</h3>
                <p v-for="(item,index) in (isInRoom ? roomMsg.person : [])">{{item}}</p>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import chessFun from '../funs/chessFun.js'
// const chessFun = require('')

export default({
    data(){
        return {
            // 棋子名称：
            // 红兵、红砲、红車、红马、红相、红仕、红帅
            // 黑卒、黑砲、黑車、黑马、黑相、黑仕、黑将
            jvmian:[
                ['黑車','黑马','黑相','黑仕','黑将','黑仕','黑相','黑马','黑車'],
                ['','','','','','','','',''],
                ['','黑砲','','','','','','黑砲',''],
                ['黑卒','','黑卒','','黑卒','','黑卒','','黑卒'],
                ['','','','','','','','',''],
                ['','','','','','','','',''],
                ['红兵','','红兵','','红兵','','红兵','','红兵'],
                ['','红砲','','','','','','红砲',''],
                ['','','','','','','','',''],
                ['红車','红马','红相','红仕','红帅','红仕','红相','红马','红車'],
            ],
            updataTimerId:233,
            roomMsgIndex : 0,
            hallPlayers : [],
            allPlayers : [],
            rooms : [],
            getMsg : [],
            chooseState : '未选择',//未选择棋子，已选择棋子，未选择，已选择
            fallPieceMsg : undefined,//到自己落子时，传给服务器的落子信息
            currentSelectPiece : undefined,//到自己落子时，选中的棋子节点
        }
    },
    methods:{
        getimg(name){
            if(name !== ''){
                return require(`../assets/${name}.png`)
            }
            return
        },
        async update(){
            const { data: res11 } = await this.$http.post("/api/update",this.$store.state.idMsg)
            if(res11.meta.status === 200){
                // console.log("使用update接口成功！！！！！")
                this.$store.commit("setUpdate",res11.data)
                // console.log( this.$store.state.update,'update')
                let gameMsg = this.$store.state.update.roomMsg ? this.$store.state.update.roomMsg.gameMsg : undefined//[{},{}]//房间内下棋信息
                
                // console.log(gameMsg)
                if(gameMsg && (gameMsg.length !== 0)){//this.roomMsgIndex-1
                    var msgTimer = setInterval(() => {
                        if(this.roomMsgIndex < gameMsg.length-1){
                            this.roomMsgIndex++
                            let msg = gameMsg[this.roomMsgIndex]
                            console.log(msg.type+"，接收到一个后端返回的msg信息，------")
                            console.log(msg)
                            if(msg.type === 'msg'){
                                let that = this
                                this.msgBox('success',msg.msg)
                                if(msg.msg === '游戏结束'){
                                    if(this.$store.state.idMsg === msg.winner){
                                        setTimeout(() => {
                                            that.msgBox('success',msg.winnerColor + "方:" + msg.winner + "，恭喜您，获得胜利！")
                                        }, 2000);
                                    }else if(this.$store.state.idMsg === msg.loser){
                                        setTimeout(() => {
                                            that.msgBox('warming',msg.loserColor + "方:" + msg.loser + "，很遗憾，请再接再厉！")
                                        }, 2000);
                                    }else{
                                        setTimeout(() => {
                                        that.msgBox('success',msg.winnerColor + "方:" + msg.winner + "获得了胜利！") 
                                        }, 2000);
                                    }
                                }
                            }else if(msg.type === '落子'){
                                let color = msg.color === 'red' ? '红方' : '黑方'
                                this.msgBox('success',color+'落子')
                            }else if(msg.type === '将军'){
                                // {
                                //     type : '将军',
                                //     msg  :color + '方被将军！',
                                //     beGeneralColor : color,
                                //     beGeneralEnglishColor : 'black',
                                // }
                                if(this.mycolor === msg.beGeneralColor){
                                    this.msgBox('warming',"您被将了一军！")
                                }else{
                                    this.msgBox('success','您将了对手一军')
                                }
                            }else if(msg.type === '绝杀'){
                                // {
                                //     type : '绝杀',
                                //     msg : loserColor + '方已被绝杀！',
                                //     winnerColor : winnerColor,
                                //     winnerEnglishColor : winnerEnglishColor,
                                //     loserColor : loserColor,
                                //     loserEnglishColor : loserEnglishColor,
                                // }
                                if(this.mycolor === msg.winnerColor){
                                    this.msgBox('success',"您已将对面绝杀！")
                                }else if(this.mycolor === msg.loserColor){
                                    this.msgBox('success','您被对面绝杀了！')
                                }else{
                                    this.msgBox('success',msg.msg)//观战玩家
                                }
                            }else{
                                console.log("不可能出现这种情况！")
                            }
                        }else{
                            clearInterval(msgTimer)
                        }
                    }, 1000);
                }
                this.$store.state.update.selfMsg.map((item) => {//遍历自己的消息
                    if(item.type === '邀请'){
                        //弹出窗口
                        if(this.$store.state.update.whereUser === '大厅'){//在大厅才能接受邀请
                            this.invitationMsg(item.inviter,item.roomName)
                        }
                    }else if(item.type === 'msg'){
                        console.log("msg:",item.msg)
                    }else if(item.type === '胜负'){
                        //弹出窗口
                        this.isWinTips(item.result)
                    }else if(item.type === '位置改变'){
                        //弹出窗口
                        this.msgBox('success',"from:"+item.from+"---to:" + item.to)
                    }
                })
                // console.log(this.$store.state.update,'更新信息完成')
            }else{
                console.log("使用update接口失败！",res11)
            }
        },
        invitationMsg(name,roomName) {
            let that = this
            this.$confirm(name+'邀请您加入房间《'+ roomName +'》', '邀请提示', {
                confirmButtonText: '加入',
                cancelButtonText: '拒绝',
                // type: 'warning'
                }).then(() => {
                    //进入房间-----------------
                    this.$http.post("/api/gotoroom",{
                        nickname:this.$store.state.idMsg.nickname,
                        roomName:roomName
                    }).then(function(res){
                        console.log(res,'加入房间res')
                        that.$message({
                            type: 'success',
                            message: '加入成功!'
                        });
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已拒绝邀请'
                });          
            });
        
        },
        isWinTips(result) {
            let msg
            let type
            if(result === '胜利'){
                msg = "恭喜您获得胜利！"
                type = "success"
            }else if(result === '失败'){
                msg = "很遗憾，您输掉了比赛。"
                type = "info"
            }
            this.$alert(msg, '比赛结果', {
            confirmButtonText: '确定',
            callback: () => {
                this.$message({
                type: type,
                message: msg
                });
            }
            });
        },
        async invite(from,to,roomName){
            //invitation={from:'小明',to:"小李",roomName:"楚汉争霸"}
            this.$http.post("/api/invitation",{
                from:from,
                to:to,
                roomName:roomName
            })
            this.msgBox('success',"已对"+ to +"发起邀请")
        },
        msgBox(type,msg){//success / info / warning / error
            this.$message({
                type: type,
                message: msg
            })
        },
        
        createroom(){
            let nickname = this.$store.state.idMsg.nickname
            this.$prompt('请输入您将创建的房间名称：', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.$http.post("/api/createroom",{
                        nickname:nickname,
                        roomName:value
                    }).then((res) => {
                        if(res.data.meta.status === 200){
                            this.$message({
                                type: 'success',
                                message: '房间创建成功，房间名: ' + value
                            });
                        }else{
                            console.log("创建房间失败")
                            console.log(res)
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
            
        },
        async exitroom(){
            let nickname = this.$store.state.idMsg.nickname
            const { data: res } = await this.$http.post("/api/exitroom",{
                nickname:nickname,
            })
            if(res.meta.status === 200){
                this.$message({
                    type: 'success',
                    message: '您已退出房间！'
                });
                console.log(this.$store.state.update.whereUser,'exitroom成功')
            }else{
                console.log("退出房间失败")
                console.log(res)
            }
            
        },
        async gotoroom(roomName){
            let nickname = this.$store.state.idMsg.nickname
            const { data: res } = await this.$http.post("/api/gotoroom",{
                nickname : nickname,
                roomName : roomName
            })
            if(res.meta.status === 200){
                console.log(res.data.msg)
                this.$message({
                    type: 'success',
                    message: '您已进入房间！'
                });
                console.log(this.$store.state.update.whereUser,'gotoroom成功！')
            }else{
                this.$message({
                    showClose: true,
                    message: '进入房间失败',
                    type: 'error'
                });
            }
            
        },
        async prepare(){
            const { data: res } = await this.$http.post("/api/prepare",this.$store.state.idMsg)
            if(res.meta.status === 200){
                this.msgBox('success',res.data.msg)
            }else{
                this.msgBox('warming',res.meta.msg)
            }
        },
        async unPrepare(){
            const { data: res } = await this.$http.post("/api/unprepare",this.$store.state.idMsg)
            if(res.meta.status === 200){
                this.msgBox('success',res.data.msg)
            }else{
                this.msgBox('warming',res.meta.msg)
            }
        },
        async fallPiece(fall){
            let idMsg = this.$store.state.idMsg
            console.log(fall.color+":"+idMsg.nickname+"落子----")
            let data = {
                idMsg : idMsg,
                fall : fall
            }
            console.log("您将"+fall.piece+"从x:"+fall.from[0]+"-y:"+fall.from[1]+"移动到x:"+fall.to[0]+"-y:"+fall.to[1])
            const { data: res } = await this.$http.post("/api/fallpiece",data)
            if(res.meta.status === 200){
                console.log("落子成功")
            }else{
                this.msgBox('warming',"后端警告，"+res.meta.msg)
                console.log("落子失败，请重新落子")
            }
            console.log("落子响应",res)
        },

        vuexRoomMsgInit(){
            this.$store.commit('clearGameMsg')
            this.$store.commit('clearCurrentRoom')
            this.$store.commit('clearSameRoomPlayers')
            this.$store.commit('clearRoomTime')
        },

        msgBox(type,msg){//success / info / warning / error
            this.$message({
                type: type,
                message: msg
            })
        },
        thereIsMyPiece(x,y,mycolor){//mycolor,'红'、'黑'
            if(this.currentSituation && (mycolor === '红' || mycolor === '黑')){
                return this.currentSituation[y][x][0] === mycolor
            }
            console.log("this.currentSituation不存在，请注意函数的使用！thereIsMyPiece")
            return  false
        },
        clickchess(e){
            let x = e.pageX-e.currentTarget.offsetLeft-10
            let y = e.pageY-e.currentTarget.offsetTop-10
            let xIndex = parseInt(x/68)
            let yIndex = parseInt(y/68)
            //fall
            // {
            //     type:'落子',
            //     color:'red',
            //     nickname:'小红',
            //     from: [0,0],
            //     to: [0,1],
            //     piece:'红車',
            // },
            let nickname = this.$store.state.idMsg.nickname
            let mycolor = this.mycolor === '红' ? 'red' : 'black'
            if(this.fallPieceMsg === undefined){
                this.fallPieceMsg = {
                    type : "落子",
                    color : mycolor,
                    nickname : nickname,
                }
            }
            if(0 <= xIndex && xIndex <= 8 && 0 <= yIndex && yIndex <=9 && this.playingState === '落子中'){
                if(this.currentSituation !== undefined){
                    if(this.thereIsMyPiece(xIndex,yIndex,this.mycolor)){//选中那个点是自己的子
                        if(this.currentSelectPiece){
                            this.currentSelectPiece.classList.remove('shadow')
                        }
                        this.currentSelectPiece = e.target
                        this.currentSelectPiece.classList.add('shadow') //这几行代码给选中棋子一个阴影
                        //选择成功
                        this.chooseState = '已选择'
                        this.fallPieceMsg.piece = this.currentSituation[yIndex][xIndex]
                        this.fallPieceMsg.from = [xIndex,yIndex]

                        console.log("您选中了："+this.fallPieceMsg.piece)

                    }else if(!this.thereIsMyPiece(xIndex,yIndex,this.mycolor)){//选中那个点不是自己的子
                        if(this.chooseState === '已选择'){
                            // var piece = {
                            //     name:'黑車',
                            //     pos:{
                            //         x:0,
                            //         y:0
                            //     }
                            // }
                            let name = this.fallPieceMsg.piece
                            let x = this.fallPieceMsg.from[0]
                            let y = this.fallPieceMsg.from[1]
                            let piece = {
                                name:name,
                                pos:{
                                    x:x,
                                    y:y
                                }
                            }
                            let canFall = false
                            let to = {
                                x:xIndex,
                                y:yIndex
                            }
                            chessFun.canFallArr(this.currentSituation,piece).map(function(pos){
                                if(pos[0] === to.x && pos[1] === to.y){
                                    canFall = true
                                }
                            })
                            if(canFall === true){
                                this.fallPieceMsg.to = [xIndex,yIndex]//进行提交fall对象的完整赋值，再调用函数
                                if(chessFun.nextKingWillBeEaten(this.currentSituation,this.fallPieceMsg,this.mycolor)){//下一步这么走，老将会被吃，就不能这么走
                                    canFall = false
                                    console.log("亲，您这么走，老将会被吃哦！")
                                    this.msgBox('warming',"亲，您这么走，老将会被吃哦！")
                                }
                            }
                            

                            if(canFall){
                                
                                console.log("落子成功，发送axios请求")
                                //axios提交
                                this.fallPiece(this.fallPieceMsg)//落子函数封装有axios

                                //重置选择棋子的样式
                                this.fallPieceMsg = undefined
                                this.currentSelectPiece.classList.remove('shadow')
                                this.currentSelectPiece = undefined
                                this.chooseState = '未选择'
                            }
                            
                        }
                    }
                }else{
                    console.log("不可能的")
                }
            }
        }
    },
    computed:{
        renderarr(){
            let situation = this.currentSituation
            let result = []
            if(situation === undefined){return []}
            for(let i = 0; i < situation.length; i++){
                for(let j = 0 ; j < situation[i].length; j++){
                    let name = situation[i][j]
                    if( name != ''){
                        result.push({
                            name:name,
                            x:j,
                            y:i,
                        })
                    }
                }
            }
            // situation.map(function(arr){
            //     arr.map(function(item){

            //     })
            // })
            // console.log(result)
            return result
        },
        selfName(){
            return this.$store.state.idMsg.nickname
        },
        isInRoom(){
            if(this.$store.state.update.roomMsg){
                return true
            }
            return false
        },
        roomMsg(){
            if(this.$store.state.update.roomMsg){
                return this.$store.state.update.roomMsg
            }
            return {}
        },
        selfGameState(){
            
            if(this.$store.state.update.roomMsg && (this.$store.state.update.roomMsg.red === this.$store.state.idMsg.nickname || this.$store.state.update.roomMsg.black === this.$store.state.idMsg.nickname)){
                return '已开始'
            }
            return '未开始'
        },
        whereUser(){
            return this.$store.state.update.whereUser
        },
        isMyTurn(){
            return this.isInRoom ? (this.myEnglishColor === this.$store.state.update.roomMsg.turn) : false
        },
        isPlaying(){
            return this.isInRoom ? this.selfGameState === '已开始' : false
        },
        playingState(){
            if(this.isInRoom){
                if(this.isPlaying){//在房间里，游戏未开始和游戏开始都有这个状态
                    if(this.isMyTurn){
                        return '落子中'
                    }else{
                        return '等待落子中'
                    }
                }else{
                    return '观战中'
                }
            }else{
                return '游玩中'
            }
        },
        currentSituation(){
            return this.isInRoom ? this.$store.state.update.roomMsg.currentSituation : undefined
        },
        mycolor(){
            if(this.isInRoom && this.selfGameState === '已开始'){
                if(this.$store.state.idMsg.nickname === this.$store.state.update.roomMsg.red){
                    return '红'
                }else if(this.$store.state.idMsg.nickname === this.$store.state.update.roomMsg.black){
                    return '黑'
                }
            }
            return undefined
        },
        myEnglishColor(){
            if(this.mycolor){
                if(this.mycolor === '红'){
                    return 'red'
                }else{
                    return 'black'
                }
            }
            return undefined
        }
        // chessState(){
        //     if(this.playingState === '落子中'){
        //         //捕捉鼠标按下

        //         //选中一个自己的棋子
        //         //选择落点
        //         //落点可以
        //         //提交到后端
        //         //后端更新局内信息
        //         //判断自己是否落子成功
        //         //不成功，把状态初始化，继续落子
        //     }else if(this.chessState === '等待落子中'){
        //         // 不准落子操作
        //     }else{
        //         //不处理这个情况
        //     }
        // }

    },
    mounted(){
        this.updataTimerId = setInterval(() => {
            this.update()
        }, 1000);//等待时间
    },

})
</script>

<style scoped>


.contain {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
.mainBox{
    position: relative;
    top:0;
    left:0;
    width: 629px;
    height: 710px;
    margin: auto auto;
    background: url("../assets/棋盘.png");
}
.mainright{
    float: right;
    width: 50px;
    height: 100%;
    background-color: yellow;
}
.title{
    font-size: 60px;
    line-height: 100px;
}
.btn{
    width: 100px;
    height: 50px;
    font-size: 16px;
    border-radius: 10px;
}
.btn1{
    width: 80px;
    height: 30px;
    font-size: 10px;
    border-radius: 15px;
    border: 0px;
    color: #fff;
    background-color: #16bbb3;
}
.btn1:hover{
    cursor: pointer;
    background-color: #56cbc5;
}
.btn2{
    width: 60px;
    height: 25px;
    border: 0px;
    border-radius: 12px;
    color: #fff;
    background-color: #15bf90;
}
.btn2:hover{
    cursor: pointer;
    background-color: #69cfb3;
}
.qizi{
    position: absolute;
}
.shadow{
    box-shadow: 3px 3px 5px  #555;
}
.roomTime{
    display: flex;
    overflow: hidden;
    flex-direction: column;
    line-height: 40px;
    margin: 0;
    padding: 0;
    width: 400px;
    height:710px;
    border-radius: 20px;
    color:#49a4d9;
    background-color: #aed6d7;
    float: left;
    margin-left: 150px;
}
.roomTimeBox{
    display: flex;
    flex-direction: column;
}
.wordBox{
    display: flex;
    justify-content: center;
    align-items:center;
}

.el-header, .el-footer {
background-color: #e7e5e1;
color: #16bbb3;
text-align: center;
display: flex;
justify-content: center;
align-items: center;
}

.el-aside {
background-color: #d3e8f5;
color: #16bbb3;
text-align: center;
line-height: 200px;
}

.el-main {
background-color: #E9EEF3;
color: #333;
text-align: center;
line-height: 160px;
}



</style>
