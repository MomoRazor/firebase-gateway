import { config } from 'dotenv'
import { ServiceAccount } from 'firebase-admin'

config()

if (!process.env.FIREBASE_PROJECT_ID)
	throw new Error(`Missing environment variable FIREBASE_PROJECT_ID!`)

if (!process.env.FIREBASE_CLIENT_EMAIL)
	throw new Error(`Missing environment variable FIREBASE_CLIENT_EMAIL!`)

if (!process.env.FIREBASE_PRIVATE_KEY)
	throw new Error(`Missing environment variable FIREBASE_PRIVATE_KEY!`)

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
}

if (!process.env.MONGO_URL)
	throw new Error(`Missing environment variable MONGO_URL!`)

export const MONGO_URL = process.env.MONGO_URL

if (!process.env.PORT) throw new Error(`Missing environment variable PORT!`)

export const PORT = process.env.PORT

export const LOCAL = process.env.LOCAL === 'true' ? true : false

if (!process.env.APP_ENV) {
	throw new Error('Missing environment variable APP_ENV!')
}
export const APP_ENV = process.env.APP_ENV

if (!process.env.RBAC_SECRET)
	throw new Error(`Missing environment variable RBAC_SECRET!`)

export const RBAC_SECRET = process.env.RBAC_SECRET

export const MAIL_SERVICE_URL = process.env.MAIL_SERVICE_URL
export const MAIL_PROJECT_NAME = process.env.MAIL_PROJECT_NAME
export const MAIL_PROJECT_LINK = process.env.MAIL_PROJECT_LINK
export const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL
export const MAIL_SUPPORT_EMAIL = process.env.MAIL_SUPPORT_EMAIL
export const MAIL_SIGNOFF = process.env.MAIL_SIGNOFF

export const CAM_SERVICE_URL = process.env.CAM_SERVICE_URL
