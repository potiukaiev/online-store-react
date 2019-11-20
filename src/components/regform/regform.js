import React from 'react'
import styles from './regform.css'
import validator from './validator'
import Store from '../../store/store'
import {connect} from 'react-redux'
import {actionRegistration} from "../../actions/actions";
import tokenChecker from '../../functions/tokenChecker';
import {Link, Redirect} from 'react-router-dom'



export default class RegForm extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            nickname: '',
            firstname: '',
            surname: '',
            password: '',
            email: '',
            emailValid: false,
            passwordValid: false,
            nicknameValid: false,
            firstNameValid: false,
            formErrors: {},
            isFormValid: false
        };

        this.handleUserInput = this.handleUserInput.bind(this)
        this.validator = validator.bind(this);
    }

    handleUserInput(e) {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({[name]: value}, () => this.validator(name, value, this.state.formErrors));
    }

    render() {
        if(localStorage.authToken){
            return <Redirect to={'/ad'} />
        }
        else {
        return (
            <section className={'reg-form'}>
                <p> Fields with <span className={'required'}>*</span> are required</p>
                <label className={'reg-input'}>
                    <p><span className={'required'}>*</span>Nick name: </p>
                    <input type="text" name="nickname"  onChange={this.handleUserInput}/>
                    <p className={'error-field'}>{this.state.formErrors.nickname}</p>
                </label>
                <label className={'reg-input'}>
                    <p><span className={'required'}>*</span>First name: </p>
                    <input type="text" name="firstname"  onChange={this.handleUserInput}/>
                    <p className={'error-field'}>{this.state.formErrors.firstname}</p>
                </label>
                <label className={'reg-input'}>
                    <p>Surname: </p>
                    <input type="text" name="surname"  onChange={this.handleUserInput}/>
                    <p className={'error-field'}>{this.state.formErrors.surname}</p>
                </label>
                <label className={'reg-input'}>
                    <p><span className={'required'}>*</span>Password: </p>
                    <input type="password" name="password"  onChange={this.handleUserInput}/>
                    <p className={'error-field'}>{this.state.formErrors.password}</p>
                </label>
                <label className={'reg-input'}>
                    <p><span className={'required'}>*</span>E-mail: </p>
                    <input type="email" name="email" onChange={this.handleUserInput}/>
                    <p className={'error-field'}>{this.state.formErrors.email}</p>
                </label>
                {this.state.isFormValid && <button onClick={() => this.props.reg(this.state.nickname, this.state.password)} className={'reg-button-valid'}>Sign in</button> || <button className={'reg-button-invalid'}>Sign in</button>}
            </section>
        )
        }
    }
}

RegForm = connect(state => ({storeState: state}), {reg: regNewUser})(RegForm);

function regNewUser(nickname, password) {
	let gql = tokenChecker();
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
            payload && dispatch(actionRegistration(payload))
        }
    }
}