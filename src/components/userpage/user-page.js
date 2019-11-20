import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import styles from './user-page.css'
import {GraphQLClient} from "graphql-request";
import {actionChangePassword} from '../../actions/actions.js'
import tokenChecker from '../../functions/tokenChecker';

export default class UserPage extends React.Component {
    constructor(props){
        super(props);
		this.state = {
			password: '',
			newPassword: '',
			email: '',
			phone: ''
		}
    }
  
    render() {
        if(!localStorage.authToken){
        return (
            <Redirect to={'/registration'} />
            )
        }
        else  {
        return (
            <section className="user-page">
				<div className={'add-info'}>
					<label>
					<p>Phone: </p>
						<input onChange={(e) => this.setState({phone:e.target.value})} />
					</label>

					<label>
						<p>E-mail: </p>
						<input onChange={(e) => this.setState({email:e.target.value})} />
					</label>

					<button onClick={updateUserInfo([this.state.phone], [this.state.email])}>Add</button>
				</div>
				

				<div className={'change-password'}>
					<span>Change password: </span>
					<label>
					  <p>Old password:</p> 
					  <input type="password" onChange={(e) => this.setState({password:e.target.value})} />
					</label>
					<br/>
					<label>
					  <p>New password:</p>
					  <input type="password" onChange={(e) => this.setState({newPassword:e.target.value})} />
					</label>
					<br/ >
					<button onClick={() => this.props.changePassword(this.props.storeState.sub && this.props.storeState.sub.login, this.state.password, this.state.newPassword)}>Change password</button>
				</div>
            </section>
        )
        }
    }
}

UserPage = connect(state => ({storeState: state.token.data}), {changePassword: changePassword})(UserPage);

function updateUserInfo(phonenumber, email) {
let gql = tokenChecker()
  let res = gql.request(`mutation updateUserInfo($input: UserInput){
      UserUpsert(user: $input){
        _id,
        login
      }
    }`, {input: {phones: phonenumber, addresses: email}});

	console.log(res);
}

function changePassword(login, password, newPassword){
    console.log('click')
   let promise;
   let gql = new GraphQLClient("/graphql", {headers: {}});
   promise = gql.request(`mutation changePassword($login: String!, $password: String!, $newPassword: String!){
    changePassword(login: $login, password: $password, newPassword: $newPassword){
      login
    }
  }
  `,{login: login, password: password, newPassword: newPassword})

  return async dispatch => {
        let payload = await promise;
         payload && dispatch(actionChangePassword(payload))
    }
} 