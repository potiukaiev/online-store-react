import React from 'react';
import {Link} from 'react-router-dom'
import logo from './logo.png';
import styles from './logo.css'



export default class Logo extends React.Component {
		constructor(props){
			super(props);
		}

		render() {
			return (
					<div className="Logo-wrapper">
						<Link to={'/ad'}><img src={logo} className="Logo-img" style={styles['Logo-img']}/><h2 className="Logo-name">DreamStore</h2></Link>
					</div>
				)
		}
}

