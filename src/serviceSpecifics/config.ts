import { IServiceRepo } from '../data'
import { camName } from './camSetup'

const coreServices = [camName]

export const checkForOtherCoreService = async (
	currentCoreService: string,
	serviceRepo: IServiceRepo
) => {
	const otherCores = coreServices.filter(
		(serviceName) => serviceName !== currentCoreService
	)

	const currentServices = await serviceRepo.find({
		name: {
			$in: otherCores,
		},
	})

	if (currentServices.length > 0) {
		throw new Error(
			'Different Core Service already installed. Core Services cannot co-habitate in same database'
		)
	}
}
