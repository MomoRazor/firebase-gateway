import express from 'express'
import morgan from 'morgan'
import admin from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT, MONGO_URL, PORT } from './env'
import mongoose from 'mongoose'
import { AuthSvc } from './svc/AuthSvc'
import { AuthApi } from './api/AuthApi'
import Axios from 'axios'
import { ProxySvc } from './svc/ProxySvc'
import { ProxyApi } from './api/ProxyApi'
import cors from 'cors'
import { UserApi } from './api/UserApi'
import { UserSvc } from './svc/UserSvc'
import { ServiceRepo } from './data/ServiceRepo'

const main = async () => {
	// Init firebase auth
	admin.initializeApp({
		credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
	})

	const firebaseAuthentication = admin.auth()

	// Init database
	const databaseConnection = mongoose.createConnection(MONGO_URL)

	// Init HTTP Client
	const axios = Axios.create({})

	// Init repositories
	const serviceRepo = await ServiceRepo(databaseConnection)

	// Init services
	const authSvc = AuthSvc(firebaseAuthentication)
	const proxySvc = ProxySvc(serviceRepo, axios)
	const userSvc = UserSvc(firebaseAuthentication)

	// Init web server
	const app = express()
	app.use(express.json({ limit: '1mb' }))
	app.use(cors())
	app.use(morgan('dev'))

	// Init routes
	AuthApi(app, authSvc)
	UserApi(app, userSvc)
	ProxyApi(app, proxySvc)

	// Start application
	app.listen(PORT, () => {
		console.log(`Firebase Gateway Initialised!`)
		console.log(`========================`)
	})
}

main()
