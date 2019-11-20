import React from 'react'

export default class Link extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return <a href={'#'} className={this.props.className}>{this.props.linkName}</a>
	}
}