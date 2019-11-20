import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk'; // позволяет передать функцию в dispatch
import jwt_decode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request';


// Использовать actionPromise для всех запросов

let gql =  tokenChecker();

console.log(gql)


const actionLogIn = token => ({type: 'LOG_IN', token: token});
const actionLogOut = () => ({type: 'LOG_OUT'});
const actionRegistration = token => ({type: 'REGISTRATION', token: token});


function actionPromise(name, promise) {
    const actionPending = () => ({type: 'PROMISE',
        status: 'PENDING',
        payload: null,
        name,
        error: null });
    const actionResolved = payload => ({type: 'PROMISE',
        status: 'RESOLVED',
        payload,
        name,
        error: null });
    const actionRejected = error => ({type: 'PROMISE',
        status: 'REJECTED',
        payload: null,
        name,
        error});

    return async dispatch => {
        dispatch(actionPending());
        try{
            let payload = await promise;
            dispatch(actionResolved(payload))
        }
        catch(e) {
            dispatch(actionRejected(e))
        }
    }
}

// if(localStorage.authToken) {
//     promise = gql.request(`query goods ($id: String!){
// 			AdFindOne(query: "[{\\"_id\\": \\"5dc9e5cdef38433c6c85e7c0\\"}]") {
// 				_id,
// 				title,
// 				description,
// 				price,
// 				createdAt,
// 				owner {
// 					_id,
// 					login,
// 					phones,
// 					createdAt
// 				}
// 			}
// 		}`, {id});
// }

export function actionPromiseFindMusic (str) {
    // let gql = createGql ()
    // console.log(gql)
    const name = 'FIND_MUSIC'
    const promise = createGql().request(`query findTrackByName($smth: String){
  TrackFind(query: $smth){
    _id, originalFileName, owner {login}, id3{title, album}
  }
}`, {smth: searchRegExp(str)})

function getAllUsers(){
    gql = tokenChecker();
    const users = gql.request (`query getUsers {
      UserFind(query: "[{}]"){
        _id, login
      }
  }`);

    console.log(users);
}

function dive(obj, arr, iter = 0) {
    if (obj[arr[iter]]) {
        dive(obj[arr[iter]], arr, iter + 1);
        console.log(obj);
    }
    else {
        return (obj[arr[iter]]);
    }
}

function tokenChecker() {
    let gql;
    if (localStorage.authToken){
        gql = new GraphQLClient("/graphql", {headers: {Authorization: "Bearer " + localStorage.authToken}})
    } else {
        gql = new GraphQLClient("/graphql", {headers: {}});
    }
    return gql;
}



function loginActionPromise(login, password) {
    const name = 'login';
    const promise = gql.request(`query login($login:String!, $password:String!){
  login(login:$login,password:$password)
}`, {login: login, password: password});

    const actionPending = () => ({type: 'PROMISE',
        status: 'PENDING',
        payload: null,
        name,
        error: null });
    const actionResolved = payload => ({type: 'PROMISE',
        status: 'RESOLVED',
        payload,
        name,
        error: null });
    const actionRejected = error => ({type: 'PROMISE',
        status: 'REJECTED',
        payload: null,
        name,
        error});
    return async dispatch => {
        dispatch(actionPending());
        try{
            let payload = await promise;
            dispatch(actionResolved(payload));

            payload.login && dispatch(actionLogIn(payload.login))
        }
        catch(e) {
            dispatch(actionRejected(e))
        }
    }
}

const tokenReducer = (state, action) => {
    if (state === undefined) {
        return {}
    }
    if (action.type === 'LOG_IN') {
        localStorage.authToken = action.token;
        return {token: action.token, data: jwt_decode(action.token)}
    }

    if (action.type === 'LOG_OUT') {
        localStorage.authToken = "";
        return {}
    }
    return state;
}

const registrationReducer = (state, action) => {
    if (state === undefined){
        return {}
    }

    if (action.type == "REGISTRATION") {
        return {token: action.token, data: jwt_decode(action.token)}
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

const store = createStore(combineReducers({
    token: tokenReducer,
    promise: promiseReducer,
    registration: registrationReducer

}), applyMiddleware(thunk));

store.subscribe(()=> console.log(store.getState()));

if (localStorage.authToken) {
    store.dispatch(actionLogIn(localStorage.authToken))
}

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        nickname: '',
        password: ''
    };
    componentDidMount(){
        console.log(this.props.storeState)

        // if (localStorage.authToken) {
        //   this.setState({displayForm: false});
        // }
        // else {
        //   this.setState({displayForm: true})
        // }
    }

    render() {
        return (
            <div style={{"width": "300px"}}>
                {this.props.storeState.token.token && <div className="log-out" style={{"display": "flex",
                    "flexDirection": "column"}}>
                    <label style={{"display": "flex",
                        "flexDirection": "column"}}>
                        Old password
                        <input type="password"/>
                    </label>

                    <label style={{"display": "flex",
                        "flexDirection": "column"}}>
                        New password
                        <input type="password"/>
                    </label>

                    <button>Change password</button>
                    <br/>
                    <button onClick={() => this.props.logOut()}>Log out</button>
                </div>}

                {!this.props.storeState.token.token && <div style={{"display": "flex",
                    "flexDirection": "column"}}>
                    <label>Log in</label>
                    <input id={"log-in"} onChange={(e) => this.setState({nickname:e.target.value})} /> <br />
                    <label>Password</label>
                    <input id={"password"}  onChange={(e) => this.setState({password:e.target.value})} />
                    <button  onClick={() => this.props.reg(this.state.nickname, this.state.password)}>Registration</button>
                    <button onClick={() => this.props.logIn(this.state.nickname, this.state.password)}>Log in</button>
                </div>}
            </div>
        )
    }
}

RegistrationForm = connect(state => ({storeState: state}), {logIn: loginActionPromise, logOut: actionLogOut, reg: regNewUser})(RegistrationForm);

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <RegistrationForm />
            </Provider>
        </div>

    );
}

function changePassword(login, password, newPassword){
    let gql = new GraphQLClient("/graphql", {headers: {}});
    gql.request(`mutation changePassword($login: String!, $password: String!, $newPassword: String!){
    changePassword(login: $login, password: $password, newPassword: $newPassword){

    }
  }
  `)
}

function regNewUser(nickname, password) {
    let promise;
    if (!localStorage.authToken) {
        promise = gql.request(`mutation userCreate($login: String!, $password: String!){
      createUser(login:$login, password:$password){
        _id,
        login
      }
    }`, {login: nickname, password: password});

        return async dispatch => {
            let payload = await promise;
            payload.login && dispatch(actionRegistration(payload.login))
        }
    }
}

export default App;