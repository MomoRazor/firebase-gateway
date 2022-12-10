import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'

export const mailName = 'mail'

export const mailSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	console.log(permissionRepo, roleRepo, pageRepo)
	// Permissions Setup ----------------------------------------------------------------------

	// Pages Setup -----------------------------------------------------------------------------

	// Role Setup -----------------------------------------------------------------------------

	// Services Setup -----------------------------------------------------------------------------

	//TODO change this url
	const mailUrl = ''

	try {
		await serviceRepo.create({
			name: mailName,
			url: mailUrl,
			enabled: true,
		})
	} catch (e) {}
}
