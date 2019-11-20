import React from 'react'
import styles from './adcreator.css'
import {connect} from 'react-redux'
import tokenChecker from '../../functions/tokenChecker'
import {actionAd} from '../../actions/actions'
import ImagesUploader from './imagesUploader/imagesUploader'
import {Link, Redirect} from 'react-router-dom'



export default class AdCreator extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            title: '',
            about: '',
            price: '',
            images: {
                _id: null && this.props.storeState.promise.UPLOAD.payload._id
            }
        }
    }

    render(){
        if(!localStorage.authToken){
            return <Redirect to={'/registration'} />
        }
        else {
            return (
                <div className={'ad-creator'}>
					<p>Ad title: </p>
                    <label>                       
                        <input className={'ad-creator-input'} type="text" onChange={e => this.setState({title: e.target.value})}/>
                    </label>
					<p>Description: </p>
                    <label>
                        <textarea name="about" id="" cols="30" rows="10" onChange={e => this.setState({about: e.target.value})}>
                        </textarea>
                    </label>
					<p>Price:</p>
                    <label>
                        <input className={'ad-creator-input'}type="number" onChange={e => this.setState({price: e.target.value})}/>
                    </label>
                    <br/>
					<p>Attach a photo:</p>
                    <ImagesUploader />
					<br/>
                    <button onClick={() => {
                        if (this.props.storeState.promise.UPLOAD.payload._id) {
                            this.props.createAd(this.state.title, this.state.about, this.state.price, [{_id:this.props.storeState.promise.UPLOAD.payload._id}])
                        }
                        else {
                            this.props.createAd(this.state.title, this.state.about, this.state.price)
                        }
                    }
                    }>Create ad</button>
                </div>
            )
        }
    }
}

AdCreator = connect(state => ({storeState: state}), {createAd: createNewAd})(AdCreator);

function createNewAd(title, description, price, images){
    let gql = tokenChecker();
    let promise;
    if(localStorage.authToken){
        promise = gql.request(`mutation createAd($input: AdInput!){
            AdUpsert(ad: $input) {
                _id,
                title,
                description,
                price,
                images {
                    _id,
                    url
                }
            }
        }`, {input:{title: title, description: description, price: +price, images:images}});

        return async dispatch => {
            let payload = await promise;
            payload && dispatch(actionAd(payload));
        }

    }

}