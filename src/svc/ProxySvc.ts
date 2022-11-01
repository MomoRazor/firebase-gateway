import { AxiosInstance } from 'axios'
import { IServiceRepo } from '../data/ServiceRepo'

// Build test

export interface IProxySvc {
	proxyRequest: (
		service: string,
		endpoint: string,
		method: string,
		uid: string,
		data: object | undefined,
		params: object | undefined
	) => Promise<any>
}

export const ProxySvc = (
	serviceRepo: IServiceRepo,
	axios: AxiosInstance
): IProxySvc => {
	const getServiceUrl = async (serviceName: string) => {
		const services = await serviceRepo.find({ enabled: true }, 'name url')

		const serviceMap: { [name: string]: string } = {}

		for (const service of services) {
			serviceMap[service.name] = service.url
		}

		if (!serviceMap) return undefined
		if (!serviceMap[serviceName]) return undefined
		return serviceMap[serviceName]
	}

	const proxyRequest = async (
		service: string,
		endpoint: string,
		method: string,
		uid: string,
		data: object | undefined,
		params: object | undefined
	) => {
		if ([`GET`, `POST`, `DELETE`, `PUT`, `PATCH`].includes(method)) {
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

		const result = await axios.request({
			method,
			url: `${url}${endpoint}`,
			data,
			params,
			headers: {
				'x-uid': uid,
			},
		})

		return result
	}

	return { proxyRequest }
}
