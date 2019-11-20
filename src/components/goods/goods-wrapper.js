import React from 'react'
import Good from './good/good-component.js'
import tokenChecker from '../../functions/tokenChecker'
import {connect} from 'react-redux'
import {actionGetAd} from '../../actions/actions'
import styles from './goods-wrapper.css'
import {getAllGoods} from '../../actions/actions'



export default class GoodsWrapper extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount(){
		this.props.getAllGoods();
	}

    render(){
		console.log(this.storeState)
		if (!localStorage.authToken){
			return <div>You have yo be loged in to see ads</div>
		}
		else {
		console.log(this.props.storeState.AdFind)
        return (
        	<div>
				<h3>Found Ads:: </h3>
				<div className={'recently-added-goods-wrapper'}>

					{this.props.storeState.AdFind && this.props.storeState.AdFind.map(item => <Good itemInfo={item}/> || <div>Looking for goods</div>)}
				</div>
            </div>
        )
    	}
    }
}

GoodsWrapper = connect(state => ({storeState: {state:state.token.token , AdFind:state.adReducer && state.adReducer.payload && state.adReducer.payload.AdFind && state.adReducer.payload.AdFind.reverse()}}), {getAllGoods: getAllGoods})(GoodsWrapper);



