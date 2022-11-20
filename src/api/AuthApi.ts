import { Application } from 'express'
import { IAuthSvc } from '../svc/AuthSvc'

export const AuthApi = (app: Application, authSvc: IAuthSvc) => {
	app.use(`*`, async (req, res, next) => {
		const { headers } = req
		const { authorization } = headers

		if (!authorization) {
			return res.status(401).json({
				data: null,
				errors: ['Missing authorisation header!'],
			})
		}

		const user = await authSvc.authenticateUser(authorization)

		if (!user) {
			return res.status(401).json({
				errors: ['Invalid token!'],
				data: null,
			})
		}

		res.locals.userData = user

		return next()
	})
}
