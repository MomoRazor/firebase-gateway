import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { checkForOtherCoreService } from './config'

export const camName = 'cam-youths'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	//TODO change this url
	const camUrl = ''

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
				url: camUrl,
				enabled: true,
			})
		} catch (e) {}
	} catch (e) {}
}
