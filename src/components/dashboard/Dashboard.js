import React, { Component } from 'react';
import Notifications from './Notifications'
import ServiceList from '../services/ServiceList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom'

class Dashboard extends Component {
	render () {
		// console.log(this.props)
		const { services, auth, notifications } = this.props;
		if (!auth.uid) return <Redirect to='signin' />
		
		return (
			<div className="dashboard container">
				<div className="row">
					<div className="col s12 m6">
						<ServiceList services={services} />
					</div>
					<div className="col s12 m5 offset-m1">
						<Notifications notifications={notifications} />
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	console.log(state)
	return {
		services: state.firestore.ordered.services,
		auth: state.firebase.auth,
		notifications: state.firestore.ordered.notifications
	}
}

export default compose(
	connect(mapStateToProps),
	firestoreConnect([
		{ collection: 'services', orderBy: ['createdAt', 'desc'] },
		{ collection: 'notifications', limit: 4, orderBy: ['time', 'desc'] }
	])
)(Dashboard)