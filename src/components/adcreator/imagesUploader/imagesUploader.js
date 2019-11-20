import React from 'react';
import {connect} from 'react-redux';
import {actionAddImage, actionUploadImage} from '../../../actions/actions.js';



export default class ImageUploader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            goodValue: "",
        };

        this.onchangePhoto = this.onchangePhoto.bind(this)
    }

    onchangeGood = e => this.setState({goodValue: e.target.value})
    onchangePhoto = () => this.props.upload(this.form)


    render(){
        return(
            <div>
                <form action='/upload' method= 'post' encType="multipart/form-data" ref={e => this.form = e}>
                    <input type='file' name="photo" onChange= {this.onchangePhoto} id= 'photo'/>
                </form>
            </div>
        )
    }
}

ImageUploader = connect(state => ({goods: state && state.promise && state.promise.getGoods && state.promise.getGoods.payload && state.promise.getGoods.payload.GoodFind, uploadData: state && state.promise && state.promise.UPLOAD && state.promise.UPLOAD.payload}), {upload: actionUploadImage, addImg: actionAddImage}) (ImageUploader)
