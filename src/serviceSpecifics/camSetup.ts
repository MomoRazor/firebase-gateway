import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { CAM_SERVICE_URL } from '../env'
import { checkForOtherCoreService } from './config'

export const camName = 'cam-youths'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	if (!CAM_SERVICE_URL) {
		throw new Error('No CAM_SERVICE_URL environment variable set')
	}

	try {
		await checkForOtherCoreService(camName, serviceRepo)

		console.log(permissionRepo, pageRepo, roleRepo)
		// Permissions Setup ----------------------------------------------------------------------

		// Pages Setup --------------------------------------------------------------------------

		// Role Setup -----------------------------------------------------------------------------

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
