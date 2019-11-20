import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {actionLogIn} from '../../actions/actions'
import tokenChecker from '../../functions/tokenChecker'
import styles from './logform.css'



export default class LogForm extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            nickname: '',
            password: ''
        }
    }


    render(){
        return (
            <div className={'log-form'}>
                <label>
                    <p>log in:</p>
                    <input type="text" onChange={e => this.setState({nickname: e.target.value})}/>
                </label>

                <label>
                    <p>password:</p>
                    <input type="password" onChange={e => this.setState({password: e.target.value})}/>
                </label>
                <div className="reg-button-wrapper">
                    <button onClick={() => this.props.logIn(this.state.nickname, this.state.password)}>Log in</button>
                    <Link className={'reg-link'} to={'/registration'}>Registration</Link>
                </div>
            </div>
        )
    }
}

LogForm = connect(state => ({storeState: state}),{logIn: loginActionPromise})(LogForm);

function loginActionPromise(login, password) {
    let gql = tokenChecker();
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