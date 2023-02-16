import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { APP_ENV, CAM_SERVICE_URL } from '../env'
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

		// Permissions Setup ----------------------------------------------------------------------

		//User
		try {
			await permissionRepo.create({
				name: 'Login',
				method: 'POST',
				endpoint: `${prefix}/login`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get User',
				method: 'POST',
				endpoint: `${prefix}/get/users`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get User Table',
				method: 'POST',
				endpoint: `${prefix}/get/users/table`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get User Autocomplete',
				method: 'POST',
				endpoint: `${prefix}/get/users/autocomplete`,
			})
		} catch (e) {}

		//Teams
		try {
			await permissionRepo.create({
				name: 'Create Team',
				method: 'POST',
				endpoint: `${prefix}/create/teams`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Update Team',
				method: 'POST',
				endpoint: `${prefix}/update/teams`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Team',
				method: 'POST',
				endpoint: `${prefix}/get/teams`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Team Table',
				method: 'POST',
				endpoint: `${prefix}/get/teams/table`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Team Autocomplete',
				method: 'POST',
				endpoint: `${prefix}/get/teams/autocomplete`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Delete Team',
				method: 'POST',
				endpoint: `${prefix}/delete/teams`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Assign User to Team',
				method: 'POST',
				endpoint: `${prefix}/assign/member/:userId/team/:teamId`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Unassign User to Team',
				method: 'POST',
				endpoint: `${prefix}/unassign/member/:userId/team/:teamId`,
			})
		} catch (e) {}

		//Communties
		try {
			await permissionRepo.create({
				name: 'Create Community',
				method: 'POST',
				endpoint: `${prefix}/create/communities`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Update Community',
				method: 'POST',
				endpoint: `${prefix}/update/communities`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Community',
				method: 'POST',
				endpoint: `${prefix}/get/communities`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Community Table',
				method: 'POST',
				endpoint: `${prefix}/get/communities/table`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Get Community Autocomplete',
				method: 'POST',
				endpoint: `${prefix}/get/communities/autocomplete`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Delete Community',
				method: 'POST',
				endpoint: `${prefix}/delete/communities`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Assign Member to Community',
				method: 'POST',
				endpoint: `${prefix}/assign/member/:userId/community/:teamId`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Unassign Member to Community',
				method: 'POST',
				endpoint: `${prefix}/unassign/member/:userId/community/:teamId`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Assign Guide to Community',
				method: 'POST',
				endpoint: `${prefix}/assign/guide/:userId/community/:teamId`,
			})
		} catch (e) {}

		try {
			await permissionRepo.create({
				name: 'Unassign Guide to Community',
				method: 'POST',
				endpoint: `${prefix}/unassign/guide/:userId/community/:teamId`,
			})
		} catch (e) {}

		// Pages Setup --------------------------------------------------------------------------

		const portal =
			APP_ENV === 'production'
				? ''
				: 'https://cam-staging-portal.onrender.com'

		try {
			await pageRepo.create({
				name: 'Profile',
				domain: portal,
				endpoint: '/profile',
			})
		} catch (e) {}

		// Role Setup -----------------------------------------------------------------------------

		try {
			await roleRepo.create({
				name: 'Administrator',
				permissionsNames: ['Login'],
				pageNames: [],
			})
		} catch (e) {}

		try {
			await roleRepo.create({
				name: 'Members',
				permissionsNames: ['Login'],
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
