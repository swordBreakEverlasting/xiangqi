// var currentSituation = require("./currentSituation.js")
const defaultSituation = [
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
]




function getSelfPiece(currentSituation,color){
    return Object.keys(currentSituationObj(currentSituation)).filter(function(item){
        return item[0] === color
    })
}



function currentSituationObj(currentSituation){
    let resultObj = {}
    for(let y = 0; y < currentSituation.length; y++){
        for(let x = 0; x < currentSituation[y].length; x++ ){
            let item = currentSituation[y][x]
            if(item === '')continue
            let itemPos = [x,y]
            if(resultObj[item]){
                resultObj[item].num++
                resultObj[item].pos.push(itemPos)
                continue
            }
            resultObj[item] = {
                num : 1,
                pos : [itemPos],
            }
        }
    }
    return resultObj
}

//[[name,[x,y]],[name,[x,y]],[name,[x,y]],[name,[x,y]]]
function currentSituationArr(currentSituation){
    let resultArr = []
    for(let y = 0; y < currentSituation.length; y++){
        for(let x = 0; x < currentSituation[y].length; x++ ){
            let name = currentSituation[y][x]
            if(name === '')continue
            resultArr.push([name,[x,y]])
        }
    }
    return resultArr
}

// console.log(currentSituationArr(currentSituation))


// console.log(currentSituationObj(currentSituation))
// let obj = currentSituationObj(currentSituation)
// Object.keys(obj).forEach(key => {
//     console.log("name:"+key)
//     console.log("num:"+obj[key].num,"pos:"+obj[key].pos.length)
// })
// var piece = {
//     name:'黑車',
//     pos:{
//         x:0,
//         y:0
//     }
// }

// canEatPiece

function isEnemyPiece(currentSituation,pos,selfColor){//piece是落点
    let mycolor = selfColor
    let enemyColor = mycolor === '红' ? '黑' : '红'
    if(currentSituation[pos[1]][pos[0]][0] === enemyColor){
        return true
    }
    return false
}

// let pos = [0,9]
// let selfColor = '黑'
// console.log(isEnemyPiece(currentSituation,pos,selfColor))


function canGoArr(currentSituation,piece){
    return canFallArr(currentSituation,piece).filter(function(pos){
        return currentSituation[pos[1]][pos[0]] === ''
    })
}

// var piece = {
//     name:'黑車',
//     pos:{
//         x:0,
//         y:0
//     }
// }
// console.log(canGoArr(currentSituation,piece))

//服务器棋盘不换方向，黑上红下x0-8，y0-9
function canFallArr(currentSituation,piece){//[[x,y],[x,y],[x,y]]
    let result = []
    if(piece && currentSituation && currentSituation[piece.pos.y][piece.pos.x] === piece.name){
        if(piece.name[1] === '兵' || piece.name[1] === '卒'){//肯定是红方
            result = bingArr(currentSituation,piece)
        }else if(piece.name[1] === '砲'){
            result = paoArr(currentSituation,piece)
        }else if(piece.name[1] === '車'){
            result = jvArr(currentSituation,piece)
        }else if(piece.name[1] === '马'){//拌马脚，还没算
            result = maArr(currentSituation,piece)
        }else if(piece.name[1] === '相'){//不能过河
            result = xiangArr(currentSituation,piece)
        }else if(piece.name[1] === '仕'){
            result = shiArr(currentSituation,piece)
        }else if(piece.name[1] === '将' || piece.name[1] === '帅'){//肯定是黑方
            result = kingArr(currentSituation,piece)
        }else{
            console.log("输入棋子错误！")
        }
    }else{
        console.log("输入参数错误！")
    }  
    return result
}

// let piece = {
//     name:'红砲',
//     pos:{
//         x:4,
//         y:7
//     }
// }
// console.log(canFallArr(currentSituation,piece))



function isCrossRiver(piece){
    if(piece.name[0] === '黑'){
        if(piece.pos.y <= 4){//小于4没过河，大于4已过河
            return false
        }
    }
    if(piece.name[0] === '红'){
        if(piece.pos.y >= 5){//大于5没过河，小于5已过河
            return false
        }
    }
    return true
}

function isInBoard(pos){//pos是数组[0,0]
    if(pos[0] >= 0 && pos[0] <= 8 && pos[1] >= 0 && pos[1] <= 9)
    return true
    return false
}

function posIsMyPiece(currentSituation,pos,selfColor){//'红','黑'
    if(currentSituation[pos[1]][pos[0]] === ''){ return false}
    if(currentSituation[pos[1]][pos[0]][0] === selfColor){
        return true
    }
    return false
}

function posIsEnemyPiece(currentSituation,pos,selfColor){//'红','黑'
    if(currentSituation[pos[1]][pos[0]] === ''){ return false}
    if(currentSituation[pos[1]][pos[0]][0] === selfColor){
        return true
    }
    return false
}

function posHasPiece(currentSituation,pos){
    if(currentSituation[pos[1]][pos[0]] === ''){ return false}
    return true
}

function posInRedGrid(pos){
    if(pos[0] >=3 && pos[0] <=5 && pos[1] >=7 && pos[1] <= 9)
    {return true}
    return false
}

function posInBlackGrid(pos){
    if(pos[0] >=3 && pos[0] <=5 && pos[1] >=0 && pos[1] <= 2)
    {return true}
    return false
}

function newPosIsBack(selfColor,newpos,oldpos){//[x,y]
    let result = false
    if(selfColor === '红'){
        result = (newpos[0] === oldpos[0]  && newpos[1] === oldpos[1]+1)
    }else if(selfColor === '黑'){
        result = (newpos[0] === oldpos[0]  && newpos[1] === oldpos[1]-1)
    }else{
        console.log("newposIsBack函数出错，请按照规则输入！")
    }
    return result
}

function newPosIsLeftRight(newpos,oldpos){
    return newpos[1] === oldpos[1]
}

function bingArr(currentSituation,piece){
    if(piece.name !== '红兵' && piece.name !== '黑卒'){
        console.log("您使用paoFireArr函数错误！")
        return undefined
    }
    let result = []
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'
    let crossRiver = isCrossRiver(piece)

    let oldpos = [piece.pos.x,piece.pos.y]
    result = [
        [oldpos[0],oldpos[1]-1],
        [oldpos[0],oldpos[1]+1],
        [oldpos[0]-1,oldpos[1]],
        [oldpos[0]+1,oldpos[1]],
    ].filter(function(pos){
        return (isInBoard(pos) && !posIsMyPiece(currentSituation,pos,mycolor) && !newPosIsBack(mycolor,pos,oldpos) )
    }).filter(function(pos){
        if(crossRiver){
            return true
        }else{
            return !newPosIsLeftRight(pos,oldpos)
        }
    })
    
    return result
}

function paoArr(currentSituation,piece){//piece.name必须是黑炮或者红炮
    if(piece.name !== '黑砲' && piece.name !== '红砲'){
        console.log("您使用paoFireArr函数错误！")
        return undefined
    }
    let result = []
    let tempArr = []//装 炮 和炮台 和 炮靶子----用于炮的发射
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    let goArr = []         //炮能行走的点位----用于炮的行走
    let flag = true         //遇到子了就不能走了
    let index = piece.pos.y                 //-----------------四条语句决定方向（上下左右）
    //遍历上下左右

    //循环的初始化
    tempArr = []//装 炮 和炮台 和 炮靶子----用于炮的发射
    flag = true         //遇到子了就不能走了
    index = piece.pos.y                 //-----------------四条语句决定方向（上下左右）
    while(true){
        index--                                //-----------------四条语句决定方向（上下左右）
        if(index < 0 || tempArr.length === 2){
            break
        }     //-----------------四条语句决定方向（上下左右）----上
        let newpos = [piece.pos.x,index]                //-----------------四条语句决定方向（上下左右）
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){ flag = false }//遇到子就不能走了
        if(newpiece === ''){//那个点没有子，炮就不能发射到这个点上，但是可以走到这个点
            if(flag){
                goArr.push(newpos)
            }
        }else{//那个点有子
            tempArr.push({
                name:newpiece,
                pos:{
                    x:newpos[0],
                    y:newpos[1]
                }
            })
        }
    }
    if(tempArr.length === 2 && tempArr[tempArr.length - 1].name[0] === enemyColor){
        let endItem = tempArr[tempArr.length - 1]
        result.push([ endItem.pos.x, endItem.pos.y])
    }

    //循环的初始化
    tempArr = []//装 炮 和炮台 和 炮靶子----用于炮的发射
    flag = true         //遇到子了就不能走了
    index = piece.pos.y                     //-----------------四条语句决定方向（上下左右）
    while(true){
        index++
        if(index > 9 || tempArr.length === 2){break}     //-----------------四条语句决定方向（上下左右）----下
        let newpos = [piece.pos.x,index]                //-----------------四条语句决定方向（上下左右）
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){ flag = false }//遇到子就不能走了
        if(newpiece === ''){//那个点没有子，炮就不能发射到这个点上，但是可以走到这个点
            if(flag){
                goArr.push(newpos)
            }
        }else{//那个点有子
            tempArr.push({
                name:newpiece,
                pos:{
                    x:newpos[0],
                    y:newpos[1]
                }
            })
        }
                                       //-----------------四条语句决定方向（上下左右）
    }
    if(tempArr.length === 2 && tempArr[tempArr.length - 1].name[0] === enemyColor){
        let endItem = tempArr[tempArr.length - 1]
        result.push([ endItem.pos.x, endItem.pos.y])
    }

    //循环的初始化
    tempArr = []//装 炮 和炮台 和 炮靶子----用于炮的发射
    flag = true         //遇到子了就不能走了
    index = piece.pos.x                     //-----------------四条语句决定方向（上下左右）
    while(true){
        index--
        if(index < 0 || tempArr.length === 2){break}     //-----------------四条语句决定方向（上下左右）----左
        let newpos = [index,piece.pos.y]                //-----------------四条语句决定方向（上下左右）
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){ flag = false }//遇到子就不能走了
        if(newpiece === ''){//那个点没有子，炮就不能发射到这个点上，但是可以走到这个点
            if(flag){
                goArr.push(newpos)
            }
        }else{//那个点有子
            tempArr.push({
                name:newpiece,
                pos:{
                    x:newpos[0],
                    y:newpos[1]
                }
            })
        }
         
    }
    if(tempArr.length === 2 && tempArr[tempArr.length - 1].name[0] === enemyColor){
        let endItem = tempArr[tempArr.length - 1]
        result.push([ endItem.pos.x, endItem.pos.y])
    }

    //循环的初始化
    tempArr = []//装 炮 和炮台 和 炮靶子----用于炮的发射
    flag = true         //遇到子了就不能走了
    index = piece.pos.x                     //-----------------四条语句决定方向（上下左右）
    while(true){
        index++                                //-----------------四条语句决定方向（上下左右）
        if(index > 8 || tempArr.length === 2){break}     //-----------------四条语句决定方向（上下左右）----右
        let newpos = [index,piece.pos.y]                //-----------------四条语句决定方向（上下左右）
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){ flag = false }//遇到子就不能走了
        if(newpiece === ''){//那个点没有子，炮就不能发射到这个点上，但是可以走到这个点
            if(flag){
                goArr.push(newpos)
            }
        }else{//那个点有子
            tempArr.push({
                name:newpiece,
                pos:{
                    x:newpos[0],
                    y:newpos[1]
                }
            })
        }
        
    }
    if(tempArr.length === 2 && tempArr[tempArr.length - 1].name[0] === enemyColor){
        let endItem = tempArr[tempArr.length - 1]
        result.push([ endItem.pos.x, endItem.pos.y])
    }

    //最后
    result = result.concat(goArr)
    return result
}

function jvArr(currentSituation,piece){
    if(piece.name !== '黑車' && piece.name !== '红車'){
        console.log("您使用paoFireArr函数错误！")
        return undefined
    }
    let result = []
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    //遍历上下左右

    let index = piece.pos.y     //-----------上
    let flag = false  //遇到棋子时，flag=true
    while(true){
        index--
        if(index < 0){break}
        if(flag){break}
        let newpos = [piece.pos.x,index] 
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){
            if(newpiece[0] === enemyColor){
                result.push(newpos)
            }
            flag = true
        }else if(newpiece === ''){
            result.push(newpos)
        }
    }

    index = piece.pos.y     //-----------下
    flag = false  //遇到棋子时，flag=true
    while(true){
        index++
        if(index > 9){break}
        if(flag){break}
        let newpos = [piece.pos.x,index] 
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){
            if(newpiece[0] === enemyColor){
                result.push(newpos)
            }
            flag = true
        }else if(newpiece === ''){
            result.push(newpos)
        }
    }

    index = piece.pos.x     //-----------左
    flag = false  //遇到棋子时，flag=true
    while(true){
        index--
        if(index < 0){break}
        if(flag){break}
        let newpos = [index,piece.pos.y] 
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){
            if(newpiece[0] === enemyColor){
                result.push(newpos)
            }
            flag = true
        }else if(newpiece === ''){
            result.push(newpos)
        }
    }

    index = piece.pos.x     //-----------右
    flag = false  //遇到棋子时，flag=true
    while(true){
        index++
        if(index > 8){break}
        if(flag){break}
        let newpos = [index,piece.pos.y] 
        let newpiece = currentSituation[newpos[1]][newpos[0]]
        if(newpiece !== ''){
            if(newpiece[0] === enemyColor){
                result.push(newpos)
            }
            flag = true
        }else if(newpiece === ''){
            result.push(newpos)
        }
    }

    return result
}

function isTrapped(currentSituation,piece,newpos){//piece对象包含原来位置的信息，newpos是新位置
    let oldpos = [piece.pos.x,piece.pos.y]
    if(piece.name === '红马' || piece.name === '黑马' || piece.name === '红相' || piece.name === '黑相'){
        let unableArr = []
        let result = false
        if(piece.name[1] === '马'){
            trap = [
                [oldpos[0]-1,oldpos[1]],//上下左右
                [oldpos[0],oldpos[1]-1],
                [oldpos[0]+1,oldpos[1]],
                [oldpos[0],oldpos[1]+1],
            ].filter(function(pos){
                return isInBoard(pos) && (currentSituation[pos[1]][pos[0]] !== '')
            })
            trap.map(function(pos){
                if(pos[1] === oldpos[1]){
                    if(pos[0] === oldpos[0]-1){//左边
                        unableArr.push([pos[0]-1,pos[1]+1])
                        unableArr.push([pos[0]-1,pos[1]-1])
                    }else if(pos[0] === oldpos[0]+1){//右边
                        unableArr.push([pos[0]+1,pos[1]+1])
                        unableArr.push([pos[0]+1,pos[1]-1])
                    }
                }else if(pos[0] === oldpos[0]){
                    if(pos[1] === oldpos[1]-1){//上边
                        unableArr.push([pos[0]-1,pos[1]-1])
                        unableArr.push([pos[0]+1,pos[1]-1])
                    }else if(pos[1] === oldpos[1]+1){//下边
                        unableArr.push([pos[0]-1,pos[1]+1])
                        unableArr.push([pos[0]+1,pos[1]+1])
                    }
                }
            })
            unableArr.map(function(pos){
                if(JSON.stringify(pos) === JSON.stringify(newpos)){
                    result = true
                }
            })
            return result
        }else if(piece.name[1] === '相'){
            unableArr = [
                [oldpos[0]-2,oldpos[1]-2],//四个角
                [oldpos[0]+2,oldpos[1]-2],
                [oldpos[0]+2,oldpos[1]+2],
                [oldpos[0]-2,oldpos[1]+2],
            ].filter(function(pos){
                return isInBoard(pos) && (currentSituation[(pos[1]+oldpos[1])/2][(pos[0]+oldpos[0])/2] !== '')
            })
            unableArr.map(function(pos){
                if(JSON.stringify(pos) === JSON.stringify(newpos)){
                    result = true
                }
            })
            return result
        }
    }
    console.log("函数使用错误：isTrapped")
    console.log("现在，名称是："+piece.name)
    return undefined
}

function maArr(currentSituation,piece){
    if(piece.name !== '黑马' && piece.name !== '红马'){
        console.log("您使用paoFireArr函数错误！")
        return undefined
    }
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    let pos = piece.pos
    //直接写出马的8个位点，然后filter
    let result = [
        [pos.x-1,pos.y-2],//上
        [pos.x+1,pos.y-2],
        [pos.x-1,pos.y+2],//下
        [pos.x+1,pos.y+2],
        [pos.x-2,pos.y-1],//左
        [pos.x-2,pos.y+1],
        [pos.x+2,pos.y-1],//右
        [pos.x+2,pos.y+1],
    ]
    result = result.filter(function(pos){
        return (isInBoard(pos) && !posIsMyPiece(currentSituation,pos,mycolor) && !isTrapped(currentSituation,piece,pos) )//在棋盘内且不是自己的子且没被绊住
    })
    return result
}

function xiangArr(currentSituation,piece){
    if(piece.name !== '黑相' && piece.name !== '红相'){
        console.log("您使用xiangArr函数错误！")
        return undefined
    }
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    let pos = piece.pos
    //直接写出相的4个位点，然后filter
    let result = [
        [pos.x-2,pos.y-2],
        [pos.x+2,pos.y-2],
        [pos.x-2,pos.y+2],
        [pos.x+2,pos.y+2],
    ]
    result = result.filter(function(pos){
        let newpiece = {
            name:piece.name,
            pos:{
                x:pos[0],
                y:pos[1]
            }
        }
        return (isInBoard(pos) && !posIsMyPiece(currentSituation,pos,mycolor) && !isCrossRiver(newpiece) && !isTrapped(currentSituation,piece,pos) )//比马多了不能过河的规则
    })
    return result
}

function shiArr(currentSituation,piece){
    if(piece.name !== '黑仕' && piece.name !== '红仕'){
        console.log("您使用xiangArr函数错误！")
        return undefined
    }
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    let pos = piece.pos
    //直接写出仕的4个位点，然后filter
    let result = [
        [pos.x-1,pos.y-1], //左上右上左下右下
        [pos.x+1,pos.y-1],
        [pos.x-1,pos.y+1],
        [pos.x+1,pos.y+1],
    ]
    result = result.filter(function(pos){
        let condition = mycolor === '红' ? posInRedGrid(pos) : posInBlackGrid(pos)//这个位置在九宫格？
        return (isInBoard(pos) && !posIsMyPiece(currentSituation,pos,mycolor) && condition)
    })
    return result
}

function canSeeEnemyKing(currentSituation,selfColor,pos){//从自己的位置起，往对面king的位置找第一个敌人，如果是对面的king，那就cansee
    let firstPiece
    if(selfColor === '红'){
        let index = pos[1]
        while(true){
            if(index < 0){
                firstPiece = "完全没子"
                break
            }
            let piece = currentSituation[index][pos[0]]
            if(piece !== '' && piece !== '红帅'){
                firstPiece = piece
                break
            }
            index--
        }
    }else if(selfColor === '黑'){
        let index = pos[1]
        while(true){
            if(index > 9){
                firstPiece = '完全没子'
                break
            }
            let piece = currentSituation[index][pos[0]]
            if(piece !== '' && piece !== '黑将'){
                firstPiece = piece
                break
            }
            index++
        }
    }
    if(firstPiece){
        return false
    }else{
        return true
    }
}

function kingArr(currentSituation,piece){
    if(piece.name !== '黑将' && piece.name !== '红帅'){
        console.log("您使用xiangArr函数错误！")
        return undefined
    }
    let mycolor = piece.name[0]
    let enemyColor = mycolor === '红' ? '黑' : '红'

    let pos = piece.pos
    //直接写出将的4个位点，然后filter
    let result = [
        [pos.x-1,pos.y], //上下左右
        [pos.x+1,pos.y],
        [pos.x,pos.y+1],
        [pos.x,pos.y-1],
    ]
    result = result.filter(function(pos){
        let condition
        let condition1
        if(isInBoard(pos)){//防止数组超出索引
            // condition = mycolor === '红' ? posInRedGrid(pos) : posInBlackGrid(pos)//这个位置在九宫格？
            condition = (posInRedGrid(pos) || posInBlackGrid(pos))
            condition1 = !canSeeEnemyKing(currentSituation,mycolor,pos)//直面对面boss
            
        }
        return (isInBoard(pos) && !posIsMyPiece(currentSituation,pos,mycolor) && condition && condition1)
    })

    result = result.filter(function(pos){//求不被吃的点
        let oldSituation = JSON.parse(JSON.stringify(currentSituation))
        let oldpos = [piece.pos.x,piece.pos.y]
        let newpos = pos
        oldSituation[newpos[1]][newpos[0]] = oldSituation[oldpos[1]][oldpos[0]]
        oldSituation[oldpos[1]][oldpos[0]] = ''
        let futureSituation = oldSituation
        return !kingWillBeEaten(futureSituation,mycolor)
    })

    return result
}


// var piece = {
//     name:'黑車',
//     pos:{
//         x:0,
//         y:0
//     }
// }
// console.log(canGoArr(currentSituation,piece))

//服务器棋盘不换方向，黑上红下x0-8，y0-9

//[[name,[x,y]],[name,[x,y]],[name,[x,y]],[name,[x,y]]]
function kingWillBeEaten(currentSituation,selfColor){

    let mycolor = selfColor
    let enemyColor = mycolor === '红' ? '黑' : '红'
    let allPieceAll = currentSituationArr(currentSituation)
    let myKingName = mycolor === '红' ? '红帅' : '黑将'
    let myKing = allPieceAll.filter(function(item){
        return item[0] === myKingName
    })[0]
    let enemyArr = allPieceAll.filter(function(item){
        return item[0][0] === enemyColor
    })
    let willGeneralArr = enemyArr.filter(function(item){
        let result = true
        let lastname = item[0][1]
        if(lastname === '相' || lastname === '仕' || lastname === '将' || lastname === '帅'){
            result = false
        }
        return result
    })

    let enemyAllCanFall = []
    let piece = {
        name:'黑車',
        pos:{
            x:0,
            y:0
        }
    }
    willGeneralArr.map(function(item){
        piece.name = item[0]
        piece.pos.x = item[1][0]
        piece.pos.y = item[1][1]
        enemyAllCanFall = enemyAllCanFall.concat(canFallArr(currentSituation,piece))
    })

    let myKingPos = myKing[1]
    let result = false
    enemyAllCanFall.map(function(pos){
        if(pos[0] === myKingPos[0] && pos[1] === myKingPos[1]){
            result = true
        }
    })
    return result
}

//fall
    // {
    //     type:'落子',
    //     color:'red',
    //     nickname:'小红',
    //     from: [0,0],
    //     to: [0,1],
    //     piece:'红車',
    // },
function nextKingWillBeEaten(currentSituation,fall,selfColor){//此函数不做能否落子的验证
    let mycolor = selfColor
    let oldSituation = JSON.parse(JSON.stringify(currentSituation))
    let oldpos = fall.from
    let newpos = fall.to
    oldSituation[newpos[1]][newpos[0]] = oldSituation[oldpos[1]][oldpos[0]]
    oldSituation[oldpos[1]][oldpos[0]] = ''
    let nextSituation = oldSituation
    return kingWillBeEaten(nextSituation,mycolor)
}



function isBeKill(currentSituation,selfColor){//判断自己是否被绝杀的函数，每回合开始之前
    let mycolor = selfColor
    let enemyColor = mycolor === '红' ? '黑' : '红'
    //[[name,[x,y]],[name,[x,y]],[name,[x,y]],[name,[x,y]]]
    let allPieceAll = currentSituationArr(currentSituation)
    let allMypiece = allPieceAll.filter(function(item){
        return item[0][0] === mycolor
    })
    let fall = {
        type:'落子',//这个属性用不上
        color:'red',//这个属性用不上
        nickname:'小红',//这个属性用不上
        from: [0,0],
        to: [0,1],
        piece:'红車',
    }
    let piece = {
        name:'黑車',
        pos:{
            x:0,
            y:0
        }
    }
    let result = true
    allMypiece.map(function(item){
        piece.name = item[0]
        piece.pos.x = item[1][0]
        piece.pos.y = item[1][1]
        canFallArr(currentSituation,piece).map(function(pos){
            fall.from = item[1]
            fall.to = pos
            fall.piece = item[0]
            if(!nextKingWillBeEaten(currentSituation,fall,selfColor)){
                result = false
            }
        })
        
    })

    return result
//检测自己所有棋子能走的下一步
//求出所有下一步的结果
//kingWillBeEaten(nextSituation,mycolor)
}


module.exports = {
    currentSituationObj : currentSituationObj,
    getSelfPiece : getSelfPiece,
    canFallArr : canFallArr,
    isEnemyPiece : isEnemyPiece,
    defaultSituation : defaultSituation,
    kingArr : kingArr,
    kingWillBeEaten : kingWillBeEaten,
    nextKingWillBeEaten : nextKingWillBeEaten,
    isBeKill : isBeKill
}