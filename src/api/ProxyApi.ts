import { Application } from 'express'
import { IProxySvc } from '../svc/ProxySvc'

export const ProxyApi = (app: Application, proxySvc: IProxySvc) => {
	app.use(`/api/v1/:service`, async (req, res, next) => {
		if (req.method.toUpperCase() !== 'POST') {
			return next()
		}

		if (!res.locals.uid) {
			return res.status(401).json({
				data: null,
				errors: ['Uid is missing!'],
			})
		}

		const { body, method, query } = req

		const { uid } = res.locals

		const { service } = req.params

		const endpoint = req.originalUrl.replace(`/api/v1/${service}`, '')

		console.log(`body:`, body)
		console.log(`uid:`, uid)
		console.log(`service:`, service)
		console.log(`endpoint:`, endpoint)

		try {
			const result = await proxySvc.proxyRequest(
				service,
				endpoint,
				method.toUpperCase(),
				uid,
				body,
				query
			)

			return res.json({
				data: result.data,
				errors: [],
			})
		} catch (e: any) {
			if (e.response?.data) {
				console.warn(e.response.data)
				return res.status(500).json({
					data: null,
					errors: [e.response.data],
				})
			} else {
				return res.status(500).json({
					data: null,
					errors: [`Could not reach ${service} microservice!`],
				})
			}
		}
	})
}
