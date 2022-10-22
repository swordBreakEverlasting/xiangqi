var express = require('express');
var path = require("path")
var router = express.Router();
var mysql = require('mysql');
var moduleDB = require('./db/db')  // 引入数据模型
var $sql = require('./db/mySQL')   // 引入sql语句对象
// 连接 mysql 数据库
var conn = mysql.createConnection(moduleDB.mysql);
var chess = require("./chess.js");
conn.connect();

// 注册
router.post('/register', (req, res) => {
  // res.send("纳米好")
  // 1、获取表单提交数据
  const user = req.body;
  // console.log(user.username);
  // 获取对于的sql语句
  // select: 'select * from user'
  const selUser_sql = $sql.usersql.select + " where username = '" + user.username + "' or email = '" + user.email + "' or nickname = '" + user.nickname + "' "
  // console.log(selUser_sql,"sql语句");
  const addUser_sql = $sql.usersql.add;
  // 2、 先查询是否存在该用户名
  conn.query(selUser_sql, user, (error, result1) => {
    if (error) {
      // console.log(error);
      res.send({
        "meta": {
          "msg": "请求错误！",
          "status": 400
        }
      })
      return;
    }
    // console.log(user);
    if (result1.length != 0 && user.username === result1[0].username) {
      res.send({
        "meta": {
          "msg": "用户名已存在",
          "status": 403
        }
      });  // 表示用户名已存在
    }
    else if (result1.length != 0 && user.email === result1[0].email) {
      res.send({
        "meta": {
          "msg": "邮箱已存在",
          "status": 403
        }
      });  // 表示邮箱已存在
    }
    else if (result1.length != 0 && user.nickname === result1[0].nickname) {
      res.send({
        "meta": {
          "msg": "昵称已存在",
          "status": 403
        }
      });  // 表示昵称已存在
    }
    else {
      // 如果不存在就进行 插入数据
      conn.query(addUser_sql, [user.username, user.email, user.password, user.nickname], (err, result2) => {
        if (err) {
          // console.log(err);
          res.send({
            "meta": {
              "msg": "请求错误！",
              "status": 400
            }
          })
        } else {
          // console.log(result2);
          res.send({
            "data": {
              "username": user.username,
              "email": user.email,
              "password": user.password,
              "nickname": user.nickname
            },
            "meta": {
              "msg": "注册成功",
              "status": 200
            }
          });
        }
      })
    }
  })
})

// 登录：
router.post('/login', (req, res) => {

  const getUser = req.body;
  // 根据username查询用户进行登录
  // console.log(getUser);
  const selUser_sql = $sql.usersql.select + " where username = '" + getUser.username + "'";
  // console.log();
  // 进行数据查询
  conn.query(selUser_sql, getUser.username, (error, results1) => {
    if (error) {
      // console.log(error);
      res.send({
        "meta": {
          "msg": "请求错误！",
          "status": 400
        }
      })
      return
    }
    if (results1[0] === undefined) {// 如果查询不到登录用户
      // console.log("用户不存在！")
      res.send({
        "meta": {
          "msg": "邮箱或者密码错误",
          "status": 403
        }
      })
      return 
    }
    else {
      if (results1[0].username == getUser.username && results1[0].password == getUser.password ) {// 用户存在且邮箱和密码都输入正确
        
        let user = {
          username:results1[0].username,
          password:results1[0].password,
          nickname:results1[0].nickname,
        }
        if(chess.loggedPeople.indexOf(user.nickname) === -1){//避免重复登录，非重复登录
          req.session.user = user
          chess.login(user.nickname)
          console.log("登录成功，玩家：---"+user.nickname)
          
          res.send({
            "data": results1[0],
            "meta": {
              "msg": "登录成功",
              "status": 200
            }
          })
          chess.playerMsg[user.nickname].push({
            type:'位置',
            from:'',
            to:'大厅',
            roomName:'',
          })
          
        }else{//避免重复登录，重复登录
          res.send({
            "data": "请勿重复登录！",
            "meta": {
              "msg": "重复登录",
              "status": 204
            }
          })
        }
      } else {
        // console.log("账号或密码错误")
        res.send({
          "meta": {
            "msg": "邮箱或者密码错误",
            "status": 403
          }
        })
      }
    }
  })
})

router.post('/forcedexit',(req,res) => {//待写------------------------------------------------
  const getUser = req.body;
  // 根据username查询用户进行登录
  // console.log(getUser);
  const selUser_sql = $sql.usersql.select + " where username = '" + getUser.username + "'";
  // console.log();
  // 进行数据查询
  conn.query(selUser_sql, getUser.username, (error, results1) => {
    if (error) {
      // console.log(error);
      res.send({
        "meta": {
          "msg": "请求错误！",
          "status": 400
        }
      })
      return
    }
    if (results1[0] === undefined) {// 如果查询不到登录用户
      // console.log("用户不存在！")
      res.send({
        "meta": {
          "msg": "邮箱或者密码错误",
          "status": 403
        }
      })
      return 
    }else {// 查询到了用户
      if (results1[0].username == getUser.username && results1[0].password == getUser.password ) {// 用户存在且邮箱和密码都输入正确
        let user = {
          username:results1[0].username,
          password:results1[0].password,
          nickname:results1[0].nickname,
        }
        if(chess.loggedPeople.indexOf(user.nickname) !== -1){//查看是否已登录，在已登录列表
          chess.login(user.nickname)
          console.log("您果然在已登录列表！")
        
          let result = chess.logout(user.nickname)//退出登录函数
          if(result){
            //已经退出登录
            chess.playerMsg[user.nickname].push({
              type:'msg',
              msg:"成功强行登出！"
            })
            res.send({
              "data": {
                msg: user.nickname+"，强退成功！"
              },
              "meta": {
                "msg": "api调用成功！",
                "status": 200
              }
            })
          }else{
            res.send({
              "data": {
                msg:"强退失败"
              },
              "meta": {
                "msg": "强退失败！",
                "status": 202
              }
            })
          }
          
        }else{//查看是否已登录，不在已登录列表，还未登录
          res.send({
            "data": "您还未登录！",
            "meta": {
              "msg": "本账号尚未登录，请不要进行这个页面的请求",
              "status": 204
            }
          })
        }
      } else {
        // console.log("账号或密码错误")
        res.send({
          "meta": {
            "msg": "邮箱或者密码错误",
            "status": 403
          }
        })
      }
    }
  })
})



//游戏api↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
router.get('/api/hallplayers',(req,res) => {//目前大厅的玩家
  if(req.session.user){
    res.send({
      "data": {
        data:chess.getAllHallPlayers()
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.get('/api/allplayers',(req,res) => {//目前登录的玩家
  if(req.session.user){
    res.send({
      "data": {
        data:chess.loggedPeople
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})


router.get('/api/allrooms',(req,res) => {//目前有哪些房间
  if(req.session.user){
    res.send({
      "data": {
        data:chess.getAllRoomNames()
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/msg',(req,res) => {//获取信息（包括邀请之类的）
  if(req.session.user){
    const getUser = req.body;
    res.send({
      "data": {
        data:chess.getPlayerMsg(getUser.nickname)//-----------------
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
    chess.playerMsg[getUser.nickname] = []//发了就清空
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})


//invitation={from:'小明',to:"小李",roomName:"楚汉争霸"}
router.post('/api/invitation',(req,res) => {//发送邀请
  if(req.session.user){
    const invitation = req.body;
    console.log("invite",invitation)
    let condition1 = typeof invitation.from === 'string'
    let condition2 = typeof invitation.to === 'string'
    let condition3 = typeof invitation.roomName === 'string'
    if(condition1 && condition2 && condition3){
      let msg = {
        type:'邀请',
        inviter:invitation.from,
        roomName:invitation.roomName
      }
      if(chess.playerMsg[invitation.to].indexOf(msg) === -1){
        chess.playerMsg[invitation.to].push(msg)
        console.log("成功添加到队列")
      }
      res.send({
        "data": {
          data:"成功邀请"+invitation.to
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 200
        }
      })
    }
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/whereuser',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let where = chess.whereUser(data.nickname)//需要传递玩家的nickname
    res.send({
      "data": {
        where:where//玩家此时的位置，大厅还是房间
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/createroom',(req,res) => {
  if(req.session.user){
    const data = req.body;
    chess.createRoom(data.nickname,data.roomName)//创建房间
    chess.playerMsg[data.nickname].push({
      type:'位置',
      from:'大厅',
      to:'房间',
      roomName:data.roomName,
    })
    res.send({
      "data": {
        msg:"房间创建成功，房间名："+data.roomName//-----------------
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/exitroom',(req,res) => {//也叫返回大厅
  if(req.session.user){
    const data = req.body;
    chess.gotoHall(data.nickname)//退出房间
    chess.playerMsg[data.nickname].push({
      type:'位置',
      from:'房间',
      to:'大厅',
      roomName:'',
    })
    res.send({
      "data": {
        msg:"退出房间成功"//-----------------
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/gotoroom',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.gotoRoom(data.nickname,data.roomName)//进入房间
    if(result){
      //进入成功
      chess.playerMsg[data.nickname].push({
        type:'位置',
        from:'大厅',
        to:'房间',
        roomName:data.roomName,
      })
      res.send({
        "data": {
          msg:"进入房间成功:"+data.roomName//-----------------
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg:"进入房间失败"//-----------------
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 202
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})


router.post('/api/currentroom',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getCurrentRoom(data.nickname)
    if(result){
      
      res.send({
        "data": {
          msg:"获取房间名成功!",
          currentRoom:result
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg:"玩家不在房间里,获取房间名失败!"
        },
        "meta": {
          "msg": "玩家不在房间里,获取房间名失败!",
          "status": 204
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/sameroomplayers',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getSameRoomPlayers(data.nickname)//进入房间
    if(result){
      //进入成功
      res.send({
        "data": {
          msg:"获取相同房间玩家成功!",
          sameRoomPlayers:result
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg:"获取相同房间玩家失败!!"
        },
        "meta": {
          "msg": "获取相同房间玩家失败!!",
          "status": 202
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/roomgamestate',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getRoomGameState(data.nickname)//进入房间
    if(result !== ''){
      //进入成功
      res.send({
        "data": {
          msg:"获取房间状态成功!",
          state:result
        },
        "meta": {
          "msg": "api调用成功！",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg:"获取房间状态失败!"
        },
        "meta": {
          "msg": "获取房间状态失败!",
          "status": 202
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/preparestate',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getPreParestate(data.nickname)//进入房间
    //进入成功
    res.send({
      "data": {
        msg:"获取准备状态成功!",
        prepareState:result
      },
      "meta": {
        "msg": "获取准备状态成功!",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/prepare',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.playerPrepare(data.nickname)//进入房间
    let msg
    if(result){
      console.log(data.nickname+"准备成功！！")
      msg = '准备成功!'
    }else{
      console.log(data.nickname+"无需准备！！")
      msg = '您无需准备!'
    }
    res.send({
      "data": {
        msg:msg,
      },
      "meta": {
        "msg": "成功进行准备操作!",
        "status": 200
      }
    })
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/unprepare',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.playerUnPrepare(data.nickname)//进入房间
    let msg
    if(result){
      msg = '取消准备成功!'
    }else{
      msg = '您无需取消准备!'
    }
    res.send({
      "data": {
        msg:msg,
      },
      "meta": {
        "msg": "成功进行准备操作!",
        "status": 200
      }
    })
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/roomtime',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getRoomTime(data.nickname)
    res.send({
      "data": {
        msg : "获取时间成功!",
        roomTime : result
      },
      "meta": {
        "msg": "获取时间成功!",
        "status": 200
      }
    })
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

router.post('/api/gamemsg',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = chess.getGameMsg(data.nickname)
    if(result){
      res.send({
        "data": {
          msg : "房间信息获取成功!",
          gameMsg : result
        },
        "meta": {
          "msg": "房间信息获取成功!",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg : "房间信息获取失败!",
          gameMsg : {}
        },
        "meta": {
          "msg": "房间信息获取成功!",
          "status": 204
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})


//请求发送
// {
//   require:{
//     hallPlayers : true,
//     allLoggedPlayers : true,
//     allRooms : true,
//     whereUser : true,
//     roomMsg : true,
//     selfMsg : true,
//   },
//   userId:this.$store.state.idMsg,
// }
//响应


router.post('/api/update',(req,res) => {
  if(req.session.user){
    // console.log("使用了update接口")
    const userId = req.body;
    let hallPlayers = chess.getAllHallPlayers()
    let allRooms = chess.getAllRoomNames()
    let allLoggedPlayers = chess.loggedPeople
    let whereUser = chess.whereUser(userId.nickname)
    let selfMsg = chess.getPlayerMsg(userId.nickname)
    let roomNum = chess.getRoomsNum.nickName[userId.nickname]
    
    let isPrepare = chess.isPrepare(userId.nickname)
    let roomMsg
    if((roomNum !== undefined) && chess.rooms[roomNum]){
      roomMsg = {
        roomName : chess.rooms[roomNum].name,
        personNum: chess.rooms[roomNum].personNum,
        person : chess.rooms[roomNum].person,
        currentSituation : chess.rooms[roomNum].currentSituation,//象棋局面
        gameState : chess.rooms[roomNum].gameState,//游戏状态，三个状态是，未开始，已开始，已结束（这个是很短暂的状态）
        preparePeople : chess.rooms[roomNum].preparePeople,//准备的人，在未开始时判断，如果小于2，所有人都能准备，等于2，游戏开始，其他玩家不能再准备
        red : chess.rooms[roomNum].red,//红方是哪个玩家，游戏开始自动分配
        black : chess.rooms[roomNum].black,//黑方是哪个玩家，游戏开始自动分配
        turn : chess.rooms[roomNum].turn,//轮到哪一方,''是还未开始，'red'是红方，'black'是黑方，游戏开始先红方
        redBeGeneral : chess.rooms[roomNum].redBeGeneral,//红方现在是否被将军
        blackBeGeneral : chess.rooms[roomNum].blackBeGeneral,//黑方现在是否被将军
        redGameTimer : chess.rooms[roomNum].redGameTimer,//局时
        blackGameTimer : chess.rooms[roomNum].blackGameTimer,//局时
        redStepTimer : chess.rooms[roomNum].redStepTimer,//步时
        blackStepTimer : chess.rooms[roomNum].blackStepTimer,//步时
        winner : chess.rooms[roomNum].winner,//red或black，或''
        gameMsg: chess.rooms[roomNum].gameMsg,//房间游戏信息，游戏开始、落子、游戏结束
      }
    }else{
      roomMsg = undefined
    }
    res.send({
      "data": {
        hallPlayers : hallPlayers,
        allRooms : allRooms,
        allLoggedPlayers : allLoggedPlayers,
        whereUser : whereUser,
        selfMsg : selfMsg,
        roomMsg : roomMsg,
        isPrepare : isPrepare,
      },
      "meta": {
        "msg": "api调用成功！",
        "status": 200
      }
    })
    // 发送之后清除自己的信息列表
    chess.playerMsg[userId.nickname] = []

  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})

//fall
// {
//     type:'落子',
//     color:'red',
//     nickName:'小红',
//     from: [0,0],
//     to: [0,1],
//     piece:'車',
// },

router.post('/api/fallpiece',(req,res) => {
  if(req.session.user){
    const data = req.body;
    let result = false
    if(data.idMsg.nickname === data.fall.nickname){
      result = chess.fallPiece(data.fall)
    }
    console.log(data.idMsg.nickname+"落子-----")
    if(result ){
      res.send({
        "data": {
          msg : data.idMsg.nickname+"，落子成功!",
        },
        "meta": {
          "msg": data.idMsg.nickname+"，落子成功!",
          "status": 200
        }
      })
    }else{
      res.send({
        "data": {
          msg : data.idMsg.nickname+"，落子失败!",
        },
        "meta": {
          "msg": data.idMsg.nickname+"，落子失败!",
          "status": 204
        }
      })
    }
    
  }else{
    res.send({
      "data": {
        data:"没有数据！"
      },
      "meta": {
        "msg": "请登录！",
        "status": 302
      }
    })
  }
})




// conn.end()
module.exports = router