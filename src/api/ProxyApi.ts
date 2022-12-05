import { Application } from 'express'
import { IProxySvc } from '../svc'

export const ProxyApi = (
	app: Application,
	proxySvc: IProxySvc,
	prefix: string
) => {
	app.use(`${prefix}/:service`, async (req, res) => {
		if (!res.locals.userData?.uid) {
			return res.status(401).json({
				data: null,
				errors: ['Uid is missing!'],
			})
		}

		const { body, method } = req

		const { userData } = res.locals

		const { service } = req.params

		const endpoint = req.originalUrl.replace(`${prefix}/${service}`, '')

		console.log(`body:`, body)
		console.log(`user data:`, userData)
		console.log(`service:`, service)
		console.log(`endpoint:`, endpoint)

		try {
			const result = await proxySvc.proxyRequest(
				service,
				endpoint,
				method.toUpperCase(),
				userData,
				body
			)

			return res.json(result.data)
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
