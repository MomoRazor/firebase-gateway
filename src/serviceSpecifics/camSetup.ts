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
				? 'https://cam-portal.onrender.com'
				: 'https://cam-staging-portal.onrender.com'

		try {
			await pageRepo.create({
				name: 'Super Portal',
				domain: portal,
				endpoint: '*',
				permissionNames: ['Super Permission'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Profile',
				domain: portal,
				endpoint: '/profile',
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'User List',
				domain: portal,
				endpoint: '/users',
				permissionNames: ['Get User Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'User View',
				domain: portal,
				endpoint: '/users/:id',
				permissionNames: ['Get User'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Team List',
				domain: portal,
				endpoint: '/teams',
				permissionNames: ['Get Team Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Team View',
				domain: portal,
				endpoint: '/teams/:id',
				permissionNames: ['Get Team', 'Get User Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Community View',
				domain: portal,
				endpoint: '/communities/:id',
				permissionNames: ['Get Community', 'Get User Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Community List',
				domain: portal,
				endpoint: '/communities',
				permissionNames: ['Get Community Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'My Teams',
				domain: portal,
				endpoint: '/my-teams',
				permissionNames: ['Get Team Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'My Team View',
				domain: portal,
				endpoint: '/my-teams/:id',
				permissionNames: ['Get Team', 'Get User Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'My Communities',
				domain: portal,
				endpoint: '/my-communities',
				permissionNames: ['Get Community Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'My Community View',
				domain: portal,
				endpoint: '/my-communities/:id',
				permissionNames: ['Get Community', 'Get User Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Guiding Communities',
				domain: portal,
				endpoint: '/guide-communities',
				permissionNames: ['Get Community Table'],
			})
		} catch (e) {}

		try {
			await pageRepo.create({
				name: 'Guiding Community View',
				domain: portal,
				endpoint: '/guide-communities/:id',
				permissionNames: ['Get Community', 'Get User Table'],
			})
		} catch (e) {}

		// Role Setup -----------------------------------------------------------------------------

		try {
			await roleRepo.create({
				name: 'Administrator',
				permissionNames: ['Login'],
				pageNames: ['Super Portal'],
			})
		} catch (e) {}

		try {
			await roleRepo.create({
				name: 'Member',
				permissionNames: ['Login'],
				pageNames: [
					'Profile',
					'My Teams',
					'My Team View',
					'My Communities',
					'My Community View',
					'Guiding Communities',
					'Guiding Community View',
				],
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
