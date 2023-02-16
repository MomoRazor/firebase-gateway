import { IServiceRepo } from '../data'
import { MAIL_SERVICE_URL } from '../env'

export const mailName = 'mail'

export const mailSetup = async (serviceRepo: IServiceRepo) => {
	if (!MAIL_SERVICE_URL) {
		throw new Error('No MAIL_SERVICE_URL environment variable set')
	}

	try {
		await serviceRepo.create({
			name: mailName,
			url: MAIL_SERVICE_URL,
			enabled: true,
		})
	} catch (e) {}
}
