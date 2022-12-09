import { IPageRepo, IPermissionRepo, IServiceRepo } from '../data'

export const mailSetup = async (
	permissionRepo: IPermissionRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	console.log(permissionRepo, pageRepo)
	// Permissions Setup ----------------------------------------------------------------------

	// Pages Setup -----------------------------------------------------------------------------

	// Services Setup -----------------------------------------------------------------------------

	//TODO change this url
	const mailUrl = 'https://api.fuelorder.enemed.com.mt'

	try {
		await serviceRepo.create({
			name: `mail`,
			url: mailUrl,
			enabled: true,
		})
	} catch (e) {}
}
