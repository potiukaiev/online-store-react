import React from 'react'
import styles from './navbar.css'
import {Link} from 'react-router-dom'
import LogForm from '../../logform/logform'
import {connect} from 'react-redux'
import {actionLogOut} from '../../../actions/actions'



export default class Navbar extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className='Nav-bar-wrapper'>
				{this.props.links && this.props.links.map(i => <Link to={'/' + i.toLowerCase().replace(" ", "-")} className={'Nav-item'}>{i}</Link>)}
				{this.props.storeState.token.token && <button onClick={() => this.props.logOut()} className={'Nav-item log-out-button'}>Log out</button> || <LogForm className={'Nav-item'}/>}
			</div>
		)
	}
}


Navbar = connect(state => ({storeState: state}), {logOut: actionLogOut})(Navbar);
