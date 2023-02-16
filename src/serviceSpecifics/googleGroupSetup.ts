import { IServiceRepo } from '../data'
import { GOOGLE_GROUP_SERVICE_URL } from '../env'

export const googleGroupName = 'google-group'

export const googleGroupSetup = async (serviceRepo: IServiceRepo) => {
	if (!GOOGLE_GROUP_SERVICE_URL) {
		throw new Error('No GOOGLE_GROUP_SERVICE_URL environment variable set')
	}

	try {
		await serviceRepo.create({
			name: googleGroupName,
			url: GOOGLE_GROUP_SERVICE_URL,
			enabled: true,
		})
	} catch (e) {}
}
