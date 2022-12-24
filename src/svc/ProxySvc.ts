import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Mache } from '../cache'
import { IServiceRepo } from '../data'
import { RBAC_SECRET, LOCAL } from '../env'
import { sign } from 'jsonwebtoken'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

// Build test

export interface IProxySvc {
	proxyRequest: (
		service: string,
		endpoint: string,
		method: string,
		userData: DecodedIdToken,
		body: object | undefined
	) => Promise<any>
}

export const ProxySvc = (
	serviceRepo: IServiceRepo,
	axios: AxiosInstance,
	cache: Mache
): IProxySvc => {
	// Listeners
	if (!LOCAL) {
		serviceRepo.watch().on(`change`, () => {
			cache.invalidate(`proxyMap`)
		})
	}

	const getServiceUrl = async (serviceName: string) => {
		let proxyCache: { [name: string]: string } | undefined =
			cache.get('proxyMap')

		if (!proxyCache) {
			const services = await serviceRepo.find(
				{ enabled: true },
				'name url'
			)

			const serviceMap: { [name: string]: string } = {}

			for (const service of services) {
				serviceMap[service.name] = service.url
			}

			cache.set('proxyMap', serviceMap)

			proxyCache = cache.get('proxyMap')
		}

		if (!proxyCache) return undefined
		if (!proxyCache[serviceName]) return undefined
		return proxyCache[serviceName]
	}

	const proxyRequest = async (
		service: string,
		endpoint: string,
		method: string,
		userData: DecodedIdToken,
		body: object | undefined
	) => {
		if (![`GET`, `POST`, `DELETE`, `PUT`, `PATCH`].includes(method)) {
			throw new Error(`Invalid method ${method}!`)
		}

		let url = await getServiceUrl(service)

		if (!url) {
			throw new Error(`Service ${service} could not be found!`)
		}

		if (url[url.length - 1] === '/') {
			url = url.substring(0, url.length - 1)
		}

		if (endpoint[0] !== '/') {
			endpoint = '/' + endpoint
		}

		const fullUrl = `${url}${endpoint}`

		let request: AxiosRequestConfig = {
			method,
			url: fullUrl,
			headers: {
				'x-token': sign(userData, RBAC_SECRET),
			},
		}

		if (method !== `GET`) {
			request.data = body
		}

		const result = await axios.request(request)

		return result
	}

	return { proxyRequest }
}
