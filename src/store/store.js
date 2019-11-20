import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import jwt_decode from "jwt-decode";



const tokenReducer = (state, action) => {
    if (state === undefined) {
        return {}
    }
    if (action.type === 'LOG_IN') {
        localStorage.authToken = action.token;
        return {token: action.token, data: jwt_decode(action.token)}
    }

    if (action.type === 'LOG_OUT') {
        console.log('Loged out')
        localStorage.authToken = "";
        return {}
    }
    return state;
}

const changePasswordReducer = (state, action) => {
    if (state === undefined) {
        return {}
    }
    if (action.type === 'LOG_IN') {
        localStorage.authToken = action.token;
        return {token: action.token, data: jwt_decode(action.token)}
    }

    if (action.type === 'LOG_OUT') {
        console.log('Loged out')
        localStorage.authToken = "";
        return {}
    }
    return state;
}

const registrationReducer = (state, action) => {
    if (state === undefined){
        return {}
    }

    if (action.type === "REGISTRATION") {
        return {payload: action.payload}
    }
 
    return state;
}

const changePassReducer = (state, action) => {
    if (state === undefined){
        return {}
    }

    if (action.type === "CHANGE_PASSWORD") {
        return {payload: action.payload}
    }
 
    return state;
}

const promiseReducer = (state, action) => {
    const actions = {
        PROMISE() {
            const {status, payload, error, name} = action;
            return {
                ...state,
                [name]:{status, payload, error}
            }
        }
    }

    if (state === undefined) {
        return {}
    }
    if (action.type in actions) {
        return actions[action.type]()
    }
    return state
}

const adReducer = (state, action) => {
    if (state === undefined){
        return {}
    }
    if (action.type === "AD_ADD"){
        console.log('add-ad')
        return {payload: action.payload}
    }
    if (action.type === "GET_AD"){
        console.log('get-add')
        return {payload: action.payload}
    }
    if (action.type === "GET_SINGLE_AD"){

        return {payload: action.payload}
    }

    return state;
}

const store = createStore(combineReducers({
    token: tokenReducer,
    promise: promiseReducer,
    registration: registrationReducer,
    adReducer: adReducer,
    changePass: changePassReducer


}), applyMiddleware(thunk));

export default store