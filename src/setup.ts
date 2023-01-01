import { IPageRepo, IPermissionRepo, IRoleRepo } from './data'

export const authName = 'auth'

export const RBACSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	prefix: string
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

	try {
		await permissionRepo.create({
			name: `Create Roles`,
			method: `POST`,
			endpoint: `${prefix}/create/roles`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Update Roles`,
			method: `POST`,
			endpoint: `${prefix}/update/roles`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Get Roles By Id`,
			method: `POST`,
			endpoint: `${prefix}/get/roles`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Get Roles Table`,
			method: `POST`,
			endpoint: `${prefix}/get/roles/table`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Get Roles Autocomplete`,
			method: `POST`,
			endpoint: `${prefix}/get/roles/autocomplete`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Delete Roles`,
			method: `POST`,
			endpoint: `${prefix}/delete/roles`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Create Users`,
			method: `POST`,
			endpoint: `${prefix}/create/users`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Update Users`,
			method: `POST`,
			endpoint: `${prefix}/update/users`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Delete Users`,
			method: `POST`,
			endpoint: `${prefix}/delete/users`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Block Users`,
			method: `POST`,
			endpoint: `${prefix}/block/users`,
		})
	} catch (e) {}

	try {
		await permissionRepo.create({
			name: `Unblock Users`,
			method: `POST`,
			endpoint: `${prefix}/unblock/users`,
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
