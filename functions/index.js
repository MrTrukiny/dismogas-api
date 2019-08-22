const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const createNotification = (notification => {
	return admin.firestore().collection('notifications')
		.add(notification)
		.then(doc => console.log('notification added', doc));
})

exports.serviceCreated = functions.firestore
	.document('services/{serviceId}')
	.onCreate(doc => {

		const service = doc.data();
		const notification = {
			content: 'ha creado un nuevo servicio',
			user: `${service.authorFirstName} ${service.authorLastName}`,
			time: admin.firestore.FieldValue.serverTimestamp()
		}

		return createNotification(notification);
})

exports.userJoined = functions.auth.user()
	.onCreate(user => {

		return admin.firestore().collection('users')
			.doc(user.uid).get().then(doc => {

				const newUser = doc.data();
				const notification = {
					content: 'se ha unido a Dismogas',
					user: `${newUser.firstName} ${newUser.lastName}`,
					time: admin.firestore.FieldValue.serverTimestamp()
				}

				return createNotification(notification);

			})

})
