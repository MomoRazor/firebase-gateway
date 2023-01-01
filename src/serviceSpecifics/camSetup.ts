import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { CAM_SERVICE_URL } from '../env'
import { checkForOtherCoreService } from './config'

export const camName = 'cam-youths'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo,
	prefix: string
) => {
	if (!CAM_SERVICE_URL) {
		throw new Error('No CAM_SERVICE_URL environment variable set')
	}

	try {
		await checkForOtherCoreService(camName, serviceRepo)

		console.log(permissionRepo, pageRepo, prefix)
		// Permissions Setup ----------------------------------------------------------------------

		// Pages Setup --------------------------------------------------------------------------

		// Role Setup -----------------------------------------------------------------------------

		try {
			await roleRepo.create({
				name: 'Administrator',
				permissionsNames: [],
				pageNames: [],
			})
		} catch (e) {}

		try {
			await roleRepo.create({
				name: 'Members',
				permissionsNames: [],
				pageNames: [],
			})
		} catch (e) {}

		// Services Setup -----------------------------------------------------------------------------

		try {
			await serviceRepo.create({
				name: camName,
				url: CAM_SERVICE_URL,
				enabled: true,
			})
		} catch (e) {}
	} catch (e) {}
}
