import React from 'react'
import styles from './main.css'
import Search from './search/search.js'
import Header from '../../components/header/header.js'
import Footer from '../../components/footer/footer.js'
import GoodsWrapper from '../../components/goods/goods-wrapper.js'
import RegForm from '../../components/regform/regform.js'
import UserPage from '../../components/userpage/user-page.js'
import Store from '../../store/store.js'
import Single from '../goods/singlePageGood/singlePageGood'
import {actionLogIn} from "../../actions/actions";
import {Provider, connect} from 'react-redux'
import jwt_decode from "jwt-decode"
import AdCreator from '../../components/adcreator/adcreator'
import {BrowserRouter as Router,
    	Switch,
    	Route,
    	Link} from 'react-router-dom'

if (localStorage.authToken) {
    Store.dispatch(actionLogIn(localStorage.authToken))
}

Store.subscribe(()=> console.log(Store.getState()));

export default class Main extends React.Component {
	constructor(props){
		super(props)
	}



	render() {
		return (
		<section className={'main-component'}>
            <Router >
				<Header />
				<Search />
					<div className="wrapper">
						<Switch>

							<Route path={'/singleitem'} component={Single} />

							<Route path={'/singleitem/:'} component={Single} />
							
							<Route path={'/'} exact component={GoodsWrapper} />

							<Route path={'/ad'}>
								<GoodsWrapper />
							</Route>

							<Route path={'/user-page'}>
								<UserPage />
							</Route>

							<Route path={'/create-ad'}>
								<AdCreator />
							</Route>

							<Route path={'/registration'}>
								{this.props.storeState.registration.payload && <div>User {this.props.storeState.registration.payload.createUser.login} has been created</div> || <RegForm />}
							</Route>
						</Switch>
                    </div>
				<Footer />
            </Router>
		</section>

		)
	}
}

Main = connect(state => ({storeState: state}))(Main);