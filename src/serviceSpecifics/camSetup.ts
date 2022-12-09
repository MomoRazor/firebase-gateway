import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	console.log(permissionRepo, roleRepo, pageRepo)
	// Permissions Setup ----------------------------------------------------------------------

	// Pages Setup --------------------------------------------------------------------------

	// Role Setup -----------------------------------------------------------------------------

	// Services Setup -----------------------------------------------------------------------------

	//TODO change this url
	const camUrl = 'https://api.fuelorder.enemed.com.mt'

	try {
		await serviceRepo.create({
			name: `cam`,
			url: camUrl,
			enabled: true,
		})
	} catch (e) {}
}
