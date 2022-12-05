import { firestore } from 'firebase-admin'
import { Mache } from '../cache'
import { IPageRepo, IPermissionRepo, IRoleRepo, IUserRepo, User } from '../data'
import { LOCAL } from '../env'

export interface IRbacSvc {
	authorizeCall: (
		uid: string,
		method: string,
		url: string
	) => Promise<Boolean>
}

export const RbacSvc = (
	userRepo: IUserRepo,
	roleRepo: IRoleRepo,
	permissionRepo: IPermissionRepo,
	pageRepo: IPageRepo,
	db: firestore.Firestore,
	cache: Mache
): IRbacSvc => {
	if (!LOCAL) {
		// Listeners
		userRepo
			.watch([], {
				fullDocument: `updateLookup`,
			})
			.on(`change`, async (data: any) => {
				if (data.operationType === 'delete') {
					// TODO: Get deleted document and invalidate its uids
					return
				}

				const { uid } = data.fullDocument
				updateFirebaseAccess([uid])
				cache.invalidate(`${uid}:permissions`)
			})

		roleRepo
			.watch([], {
				fullDocument: `updateLookup`,
			})
			.on(`change`, async (data: any) => {
				if (data.operationType === 'delete') {
					// TODO: Get deleted document and invalidate its uids
					return
				}

				const { name } = data.fullDocument

				const users = await userRepo.find({ roleNames: name })
				if (users.length === 0) return

				updateFirebaseAccess(users.map((user) => user.uid))
				for (const user of users) {
					cache.invalidate(`${user.uid}:permissions`)
				}
			})

		permissionRepo
			.watch([], {
				fullDocument: `updateLookup`,
			})
			.on(`change`, async (data: any) => {
				if (data.operationType === 'delete') {
					// TODO: Get deleted document and invalidate its uids
					return
				}

				const { name } = data.fullDocument

				const roles = await roleRepo.find({ permissionNames: name })
				if (roles.length === 0) return

				const users = await userRepo.find({
					roleNames: roles.map((role) => role.name),
				})
				if (users.length === 0) return

				updateFirebaseAccess(users.map((user) => user.uid))
				for (const user of users) {
					cache.invalidate(`${user.uid}:permissions`)
				}
			})

		pageRepo
			.watch([], {
				fullDocument: `updateLookup`,
			})
			.on(`change`, async (data: any) => {
				if (data.operationType === 'delete') {
					// TODO: Get deleted document and invalidate its uids
					return
				}

				const { name } = data.fullDocument

				const roles = await roleRepo.find({ pageNames: name })
				if (roles.length === 0) return

				const users = await userRepo.find({
					roleNames: roles.map((role) => role.name),
				})
				if (users.length === 0) return

				updateFirebaseAccess(users.map((user) => user.uid))
				for (const user of users) {
					cache.invalidate(`${user.uid}:permissions`)
				}
			})
	}

	// Functions
	const updateRbacPermissionCache = async (uids: string[]) => {
		if (uids?.length === 0) return

		let users: User[] = []

		if (uids) {
			users = await userRepo.find({ uid: { $in: uids } })
		} else {
			users = await userRepo.find({})
		}

		for (const user of users) {
			const roles = await roleRepo.find({ name: { $in: user.roleNames } })
			if (roles.length === 0) continue

			const pages = await pageRepo.find({
				$or: [
					{
						name: {
							$in: roles.map((role) => role.pageNames).flat(),
						},
					},
					{
						open: true,
					},
				],
			})

			let permissionNames = roles
				.map((role) => role.permissionNames)
				.flat()

			for (let j = 0; j < pages.length; j++) {
				permissionNames = permissionNames.concat(
					pages[j].permissionNames
				)
			}

			const permissions = await permissionRepo.find({
				$or: [
					{
						name: {
							$in: permissionNames,
						},
					},
					{
						open: true,
					},
				],
			})

			if (permissions.length === 0) continue

			const userPermissions: string[] = []

			for (const permission of permissions) {
				let cleanedEndpoint = ''
				if (
					permission.endpoint[permission.endpoint.length - 1] === '/'
				) {
					cleanedEndpoint = permission.endpoint.substring(
						0,
						permission.endpoint.length - 1
					)
				} else {
					cleanedEndpoint = permission.endpoint
				}

				userPermissions.push(`${permission.method}:${cleanedEndpoint}`)
			}

			cache.invalidate(`${user.uid}:permissions`)
			cache.set(`${user.uid}:permissions`, userPermissions)
		}
	}

	const updateFirebaseAccess = async (uids: string[]) => {
		if (uids?.length === 0) return

		let users: User[] = []

		if (uids) {
			users = await userRepo.find({ uid: { $in: uids } })
		} else {
			users = await userRepo.find({})
		}

		for (const user of users) {
			const access: {
				portals: {
					[domain: string]: string[]
				}
				permissions: {
					[method: string]: string[]
				}
			} = {
				portals: {},
				permissions: {},
			}

			const roles = await roleRepo.find({ name: { $in: user.roleNames } })
			if (roles.length === 0) continue

			const pages = await pageRepo
				.find({
					$or: [
						{
							name: {
								$in: roles.map((role) => role.pageNames).flat(),
							},
						},
						{
							open: true,
						},
					],
				})
				.lean()

			let permissionNames = roles
				.map((role) => role.permissionNames)
				.flat()

			for (const page of pages) {
				if (access.portals[page.domain]) {
					if (!access.portals[page.domain].includes(page.endpoint)) {
						access.portals[page.domain].push(page.endpoint)
					}
				} else {
					access.portals[page.domain] = [page.endpoint]
				}

				permissionNames = permissionNames.concat(page.permissionNames)
			}

			const permissions = await permissionRepo
				.find({
					$or: [
						{
							name: {
								$in: permissionNames,
							},
						},
						{
							open: true,
						},
					],
				})
				.lean()

			if (permissions.length === 0) continue

			for (const permission of permissions) {
				let cleanedEndpoint = ''
				if (
					permission.endpoint[permission.endpoint.length - 1] === '/'
				) {
					cleanedEndpoint = permission.endpoint.substring(
						0,
						permission.endpoint.length - 1
					)
				} else {
					cleanedEndpoint = permission.endpoint
				}

				if (access.permissions[permission.method]) {
					if (
						!access.permissions[permission.method].includes(
							cleanedEndpoint
						)
					) {
						access.permissions[permission.method].push(
							cleanedEndpoint
						)
					}
				} else {
					access.permissions[permission.method] = [cleanedEndpoint]
				}
			}

			await db.collection('access').doc(user.uid).set(access)
		}
	}

	const checkPermission = (
		userPermissions: string[],
		method: string,
		endpoint: string
	) => {
		if (
			userPermissions.includes(`*:*`) ||
			userPermissions.includes(`${method}:*`)
		) {
			return true
		} else {
			for (let i = 0; i < userPermissions.length; i++) {
				if (userPermissions[i] === `${method}:${endpoint}`) {
					return true
				} else {
					const splitPermissionA = userPermissions[i]
						.split('/')
						.filter((perm) => perm)
					const splitPermissionB = `${method}:${endpoint}`
						.split('/')
						.filter((perm) => perm)

					const max =
						splitPermissionA.length > splitPermissionB.length
							? splitPermissionA.length
							: splitPermissionB.length

					let failed = false
					for (let j = 0; j < max; j++) {
						if (splitPermissionA[j] === '*') {
							return true
						} else if (
							!splitPermissionA[j] ||
							(splitPermissionA[j][0] !== ':' &&
								splitPermissionA[j] !== splitPermissionB[j])
						) {
							failed = true
							break
						}
					}

					if (!failed) {
						return true
					}
				}
			}

			return false
		}
	}

	const authorizeCall = async (
		uid: string,
		method: string,
		endpoint: string
	) => {
		// TODO: Socket to FE

		let userPermissions: string[] | undefined = cache.get(
			`${uid}:permissions`
		)

		if (!userPermissions) {
			await updateRbacPermissionCache([uid])
			userPermissions = cache.get(`${uid}:permissions`)
		}

		if (!userPermissions) {
			console.log('No Permissions found')
			return false
		}

		if (checkPermission(userPermissions, method, endpoint)) {
			return true
		} else {
			console.log(
				'Wrong Permission',
				userPermissions,
				`${method}:${endpoint}`
			)
		}

		return false
	}

	return {
		authorizeCall,
	}
}
