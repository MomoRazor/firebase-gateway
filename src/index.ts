import express from 'express'
import morgan from 'morgan'
import admin from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT, MONGO_URL, PORT } from './env'
import mongoose from 'mongoose'
import { Mache } from './cache'
import Axios from 'axios'
import cors from 'cors'
import { SetupApi, AuthApi, RbacApi, UserApi, ProxyApi } from './api'
import {
	UserRepo,
	PermissionRepo,
	RoleRepo,
	ServiceRepo,
	PageRepo,
} from './data'
import { AuthSvc, RbacSvc, ProxySvc, UserSvc } from './svc'

const main = async () => {
	// Init firebase auth
	admin.initializeApp({
		credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
	})

	const firebaseAuthentication = admin.auth()

	// Init database
	const databaseConnection = mongoose.createConnection(MONGO_URL)

	// Init cache
	const cache = new Mache()

	// Init HTTP Client
	const axios = Axios.create({})

	const firestore = await admin.firestore()

	const prefix = `/auth`

	// Init repositories
	const userRepo = await UserRepo(databaseConnection)
	const permissionRepo = await PermissionRepo(databaseConnection)
	const roleRepo = await RoleRepo(databaseConnection)
	const serviceRepo = await ServiceRepo(databaseConnection)
	const pageRepo = await PageRepo(databaseConnection)

	// Init services
	const authSvc = AuthSvc(firebaseAuthentication)
	const rbacSvc = RbacSvc(
		userRepo,
		roleRepo,
		permissionRepo,
		pageRepo,
		firestore,
		cache
	)
	const proxySvc = ProxySvc(serviceRepo, axios, cache)
	const userSvc = UserSvc(userRepo, firebaseAuthentication)

	// Init web server
	const app = express()
	app.use(express.json({ limit: '1mb' }))
	app.use(cors())
	app.use(morgan('dev'))

	// Init setup routes
	SetupApi(app, roleRepo, pageRepo, permissionRepo, serviceRepo)

	// Init Auth and RBAC
	AuthApi(app, authSvc)
	RbacApi(app, rbacSvc, prefix)

	// Init routes
	UserApi(app, userSvc, prefix)
	ProxyApi(app, proxySvc)

	// Start application
	app.listen(PORT, () => {
		console.log(`Firebase Gateway Initialised! - ${PORT}`)
		console.log(`========================`)
	})
}

main()
