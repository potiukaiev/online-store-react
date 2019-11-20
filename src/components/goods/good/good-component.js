import React from 'react'
import styles from './good-component.css'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {actionGetSingleAd} from '../../../actions/actions'
import Store from '../../../store/store'

export default class GoodComponent extends React.Component {
       constructor(props){
           super(props)

       }
       render() {
           return (
               <div className={'good-wrapper'}>
                   <img src={this.props.itemInfo.images && this.props.itemInfo.images[0].url || "https://static.wixstatic.com/media/2a8c1e_2319f1bd810145539f6d7b947d62f62e~mv2.jpg/v1/fill/w_853,h_853,al_c,q_85/2a8c1e_2319f1bd810145539f6d7b947d62f62e~mv2.jpg"} alt=""/>
                   <h3>{this.props.itemInfo.title}</h3>
				   <div className={'button-wrapper'}>
                   <p>Price: {this.props.itemInfo.price + '$'}</p>
                   <Link className={'good-button'} to={'singleitem/:' + this.props.itemInfo._id} onClick={() => Store.dispatch(actionGetSingleAd(this.props.itemInfo))}>Take a look</Link>
					</div>
			   </div>
           )
       }
}
