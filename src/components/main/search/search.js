import React from 'react'
import styles from './search.css'
import {connect} from 'react-redux'
import {actionGetAd} from '../../../actions/actions'
import tokenChecker from '../../../functions/tokenChecker'

export default class Search extends React.Component {
	constructor(props) {
		super(props);
		this.searchRegExp = function(str){
			return ( 
				JSON.stringify([{$or:[
				{title: "/" + str.trim().split(/\s+/).join('|') + "/"},
				{description: "/" + str.trim().split(/\s+/).join('|') + "/"}
				]}])
			)
		}
	}

	state = {
		searchValue: this.props.defaultValue || '',
		placeholderValue: this.props.placeholderValue || 'What are you searching for?'
	}

	render() {
		return (
			<div className={'Search'}>
				<input className={'Search-input'} placeholder={this.state.placeholderValue}onChange={(e) => this.setState({searchValue:e.target.value})} />
				<button className={'Search-button'} onClick={() => this.props.findGoods(this.searchRegExp(this.state.searchValue))}>SEARCH</button>
			</div>
		)
	}
}

Search = connect(state => ({storeState: state}), {findGoods: findGoods})(Search)

function findGoods(str){
	let gql = tokenChecker();
	let promise;
		promise = gql.request(`query goods ($query: String) {
			AdFind(query: $query) {
				_id, 
				title, 
				description, 
				price,
				createdAt,
				images {
					_id,
					url
				} 
				owner {
					_id,
					login,
					phones,
					createdAt	
				}
			}
		}`, {query: str});
	return async dispatch => {
		let payload = await promise;
		 payload && dispatch(actionGetAd(payload))
	}
}