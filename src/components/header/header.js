import React from 'react';
import Logo from './logo/logo.js'
import Navbar from './navbar/navbar.js'
import styles from './header.css'


export default class Header extends React.Component {
		constructor(props){
			super(props);
		}

		state = {
			links: ['Ad','User page', 'Create ad']
		};

        componentDidMount() {
			if (!localStorage.authToken){
				this.setState({links: [...this.state.links]});
			}
		}

		render() {
			return (
					<div className="Header">
						<div className="Wrapper">
							<Logo />
							<Navbar links={this.state.links}/>
						</div>
					</div>
				)
		}
} 