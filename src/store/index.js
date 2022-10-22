import Vue from "vue"
import Vuex from "vuex" //引入vuex
Vue.use(Vuex) //使用vuex
 
export default new Vuex.Store({
    state:{//JSON.parse(sessionStorage.getItem("COMPANY_AUTH_INFO")) || {}
        idMsg :  sessionStorage.getItem("idMsg") ? JSON.parse(sessionStorage.getItem("idMsg")) : {},
        currentRoom : sessionStorage.getItem("currentRoom") ? JSON.parse(sessionStorage.getItem("currentRoom")) : undefined,
        sameRoomPlayers : sessionStorage.getItem("sameRoomPlayers") ? JSON.parse(sessionStorage.getItem("sameRoomPlayers")) : undefined,
        userWhere : sessionStorage.getItem("userWhere") || '大厅',//在 大厅 还是在 房间
        roomGameState : sessionStorage.getItem("roomGameState") || '',//'未开始'  '已开始' ''
        selfGameState : sessionStorage.getItem("selfGameState") || '未开始',//'未开始'  '已开始'
        prepareState : sessionStorage.getItem("prepareState") || '未准备',//'未准备' '已准备'
        roomTime : sessionStorage.getItem("rooTime") ? JSON.parse(sessionStorage.getItem("rooTime")) : {},
        gameMsg: sessionStorage.getItem("gameMsg") ? JSON.parse(sessionStorage.getItem("gameMsg")) : [],
        update : sessionStorage.getItem("update") ? JSON.parse(sessionStorage.getItem("update")) : {},

    },
    mutations:{
        clearGameMsg(state){
            state.gameMsg = []
            sessionStorage.removeItem("gameMsg")
        },
        clearCurrentRoom(state){
            state.currentRoom = undefined
            sessionStorage.removeItem("currentRoom")
        },
        clearSameRoomPlayers(state){
            state.currentRoom = undefined
            sessionStorage.removeItem("sameRoomPlayers")
        },
        clearRoomTime(state){
            state.currentRoom = {}
            sessionStorage.removeItem("roomTime")
        },
        pushGameMsg(state,newval){
            let oldval = JSON.parse(JSON.stringify(state.gameMsg))
            newval = JSON.parse(JSON.stringify(newval))
            let newlen = newval.length
            let oldlen = oldval.length
            let newMsg = []
            if( newlen > oldlen ){
                for(let index = oldlen; index < newlen; index++){
                    oldval.push(newval[index])
                }
            }
            let copy = [...oldval,...newMsg]
            state.gameMsg = [...copy]
            sessionStorage.setItem("gameMsg", JSON.stringify(copy))
        },
        
        updataIdMsg(state,val){
            state.idMsg = val
            sessionStorage.setItem("idMsg", JSON.stringify(val))
        },
        setUserWhere(state,val){
            if(val === '大厅' || val === '房间'){
                state.userWhere = val
                sessionStorage.setItem("userWhere",val)
            }
        },
        setRoomGameState(state,val){
            if(val === '已开始' || val === '未开始'){
                state.roomGameState = val
                sessionStorage.setItem("roomGameState",val)
            }
        },
        setSelfGameState(state,val){
            if(val === '已开始' || val === '未开始'){
                state.selfGameState = val
                sessionStorage.setItem("selfGameState",val)
            }
        },
        setPrepareState(state,val){
            if(val === '已准备' || val === '未准备'){
                state.prepareState = val
                sessionStorage.setItem("prepareState",val)
            }
        },
        setRoomTime(state,val){
            state.roomTime = val
            sessionStorage.setItem("roomTime", JSON.stringify(val))
        },
        setCurrentRoom(state,val){
            state.currentRoom = val
            sessionStorage.setItem("currentRoom", JSON.stringify(val))
        },
        setSameRoomPlayers(state,val){
            state.sameRoomPlayers = val
            sessionStorage.setItem("sameRoomPlayers", JSON.stringify(val))
        },

        setUpdate(state,val){
            state.update = val
            sessionStorage.setItem("update", JSON.stringify(val))
        },
    },
    
})