import { IPageRepo, IPermissionRepo, IRoleRepo } from './data'

export const RBACSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo
) => {
	// Permissions Setup ----------------------------------------------------------------------

	try {
		await permissionRepo.create({
			name: `Super Permission`,
			method: `*`,
			endpoint: `*`,
			system: true,
		})
	} catch (e) {}

	// Pages Setup --------------------------------------------------------------------------
	try {
		await pageRepo.create({
			name: `Super Page`,
			domain: '*',
			endpoint: '*',
			system: true,
			permissionNames: ['Super Permission'],
		})
	} catch (e) {}

	// Role Setup -----------------------------------------------------------------------------
	try {
		await roleRepo.create({
			name: `Super Role`,
			permissionNames: [`Super Permission`],
			pageNames: [`Super Page`],
			system: true,
		})
	} catch (e) {}
}
