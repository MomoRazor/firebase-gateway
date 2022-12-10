import { Application } from 'express'
import { IRbacSvc } from '../svc'

export const RbacApi = (
	app: Application,
	rbacSvc: IRbacSvc,
	prefix: string
) => {
	app.use(prefix, async (req, res, next) => {
		//TODO remove skipping RBAC
		// return next()
		const method = req.method.toUpperCase()
		const endpoint = req.originalUrl.replace(prefix, '')

		if (!res.locals.userData?.uid) {
			return res.status(401).json({
				data: null,
				errors: ['Uid is missing!'],
			})
		}

		const uid: string = res.locals.userData.uid

		const accessGranted = await rbacSvc.authorizeCall(uid, method, endpoint)

		if (!accessGranted) {
			return res.status(403).json({
				data: null,
				errors: [
					`User does not have permission to use ${method} ${endpoint}!`,
				],
			})
		}

		return next()
	})
}
