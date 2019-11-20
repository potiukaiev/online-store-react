import React from 'react'
import {connect} from 'react-redux'
import styles from './singlePageGood.css'
import {actionGetSingleAd} from "../../../actions/actions";
import tokenChecker from '../../../functions/tokenChecker'



export default class SinglePageGood extends React.Component{
    constructor(props){
        super(props);
        this.date = new Date();
    }

    componentDidMount(){
		this.id = this.props.location.pathname.slice(13) || this.props.storeState._id;
        this.props.getSingleGood(this.id);
    }

    render(){
        if(this.props.storeState && this.props.storeState.AdFindOne){
            return(
                <section className={'single-good'}>
                    <h1>{this.props.storeState.AdFindOne.title}</h1>
                    <img src={this.props.storeState.AdFindOne.images && this.props.storeState.AdFindOne.images[0].url && "/" + this.props.storeState.AdFindOne.images[0].url || "https://static.wixstatic.com/media/2a8c1e_2319f1bd810145539f6d7b947d62f62e~mv2.jpg/v1/fill/w_853,h_853,al_c,q_85/2a8c1e_2319f1bd810145539f6d7b947d62f62e~mv2.jpg"} alt=""/>
                    <p className={'description'}>{this.props.storeState.AdFindOne.description}</p>
                    <p className={'price'}>Price: {this.props.storeState.AdFindOne.price}$</p>
                    <div className={'author-info-wrapper'}>
                        <div className={'nickname'}>
                            <p>Author: <b>{this.props.storeState.AdFindOne.owner.login}</b></p>
                        </div>
                        
                        <div className={'phones'}>
                            <p>Phones: +380-50-000-00</p>
                        </div>
                    </div>
                </section>
            )
        }
        else {
            return (
                <div>Loading...</div>
            )
        }

    }
}

SinglePageGood = connect(state => ({storeState: state.adReducer && state.adReducer.payload}), {getSingleGood: getSingleGood})(SinglePageGood);

function getSingleGood(id){
	let gql = tokenChecker();
    let promise;
    if(localStorage.authToken) {
        promise = gql.request(`query goods{
			AdFindOne(query: "[{\\"_id\\": \\"${id}\\"}]") {
				_id, 
				title, 
				description, 
				price,
				images {
				    _id,
				    url,
				},
				createdAt, 
				owner {
					_id,
					login,
					phones,
					addresses,
					createdAt	
				}
			}
		}`)
    }

    return async dispatch => {
        let payload = await promise
        payload && dispatch(actionGetSingleAd(payload))
    }
}