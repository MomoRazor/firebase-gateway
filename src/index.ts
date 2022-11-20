import express from 'express'
import morgan from 'morgan'
import admin from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT, MONGO_URL, PORT } from './env'
import mongoose from 'mongoose'
import { UserRepo } from './data/UserRepo'
import { AuthSvc } from './svc/AuthSvc'
import { AuthApi } from './api/AuthApi'
import { RbacSvc } from './svc/RbacSvc'
import { RbacApi } from './api/RbacApi'
import { PermissionRepo } from './data/PermissionRepo'
import { RoleRepo } from './data/RoleRepo'
import { Mache } from './cache'
import Axios from 'axios'
import { ServiceRepo } from './data/ServiceRepo'
import { ProxySvc } from './svc/ProxySvc'
import { ProxyApi } from './api/ProxyApi'
import { UserSvc } from './svc/UserSvc'
import { UserApi } from './api/UserApi'
import cors from 'cors'
import { PageRepo } from './data/PageRepo'
import { SetupApi } from './api/SetupApi'

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

	const prefix = '/wapo'
	const authServicePerfix = `${prefix}/auth`

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
	SetupApi(app, roleRepo, pageRepo, permissionRepo, serviceRepo, prefix)

	// Init Auth and RBAC
	AuthApi(app, authSvc)
	RbacApi(app, rbacSvc, prefix)

	// Init routes
	UserApi(app, userSvc, authServicePerfix)
	ProxyApi(app, proxySvc, prefix)

	// Start application
	app.listen(PORT, () => {
		console.log(`Firebase Gateway Initialised! - ${PORT}`)
		console.log(`========================`)
	})
}

main()
