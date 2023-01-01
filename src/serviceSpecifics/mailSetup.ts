import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { MAIL_SERVICE_URL } from '../env'

export const mailName = 'mail'

export const mailSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo,
	prefix: string
) => {
	if (!MAIL_SERVICE_URL) {
		throw new Error('No MAIL_SERVICE_URL environment variable set')
	}

	console.log(permissionRepo, roleRepo, pageRepo, prefix)
	// Permissions Setup ----------------------------------------------------------------------

	// Pages Setup -----------------------------------------------------------------------------

	// Role Setup -----------------------------------------------------------------------------

	// Services Setup -----------------------------------------------------------------------------

	try {
		await serviceRepo.create({
			name: mailName,
			url: MAIL_SERVICE_URL,
			enabled: true,
		})
	} catch (e) {}
}
