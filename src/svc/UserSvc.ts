import { AutocompleteFilter, PaginationFilter } from '../data/general'
import { IUserRepo, User } from '../data/UserRepo'
import { Auth } from 'firebase-admin/lib/auth/auth'
import { UpdateRequest } from 'firebase-admin/lib/auth/auth-config'
// import { Topic } from '@google-cloud/pubsub'

export interface IUserSvc {
	getTable: (
		pagination: PaginationFilter
	) => Promise<{ data: User[]; total: number }>
	getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: User[] }>
	getById: (userId: string) => Promise<User>
	getByUid: (uid: string) => Promise<User>
	update: (userId: string, data: Partial<User>) => Promise<User>
	create: (data: User) => Promise<User>
	deleteOne: (userId: string) => Promise<void>
	blockOne: (userId: string) => Promise<void>
	unblockOne: (userId: string) => Promise<void>
}

export const UserSvc = (
	userRepo: IUserRepo,
	firebaseAuth: Auth
	// userUpdatesTopic: Topic
): IUserSvc => {
	// userRepo
	// 	.watch([], {
	// 		fullDocument: `updateLookup`,
	// 	})
	// 	.on(`change`, (data) => {
	// 		// userUpdatesTopic.publishMessage({
	// 		// 	json: {
	// 		// 		operation: data.operationType,
	// 		// 		document: (data as any).fullDocument,
	// 		// 	},
	// 		// })
	// 	})

	const getTable = async (pagination: PaginationFilter) => {
		const data = await userRepo
			.find(pagination.filter, pagination.projection)
			.sort(pagination.sort)
			.skip((pagination.page - 1) * pagination.limit)
			.limit(pagination.limit)
			.lean()

		const total = await userRepo.countDocuments(pagination.filter)

		return {
			data,
			total,
		}
	}

	const getAutocomplete = async (info: AutocompleteFilter) => {
		const { filter, search, limit } = info

		const autoFilter = {
			...filter,
			$or: [
				{
					email: {
						$regex: search,
						$options: 'ig',
					},
				},
				{
					displayName: {
						$regex: search,
						$options: 'ig',
					},
				},
			],
		}

		const data = await userRepo.find(autoFilter).limit(limit).lean()

		return {
			data,
		}
	}

	const getById = async (id: string) => {
		const user = await userRepo.findById(id).lean()

		if (!user) {
			throw new Error('Could not find User')
		}

		return user
	}

	const getByUid = async (uid: string) => {
		const user = await userRepo
			.findOne({
				uid,
			})
			.lean()

		if (!user) {
			throw new Error('Could not find User')
		}

		return user
	}

	const update = async (userId: string, data: Partial<User>) => {
		const currentUser = await userRepo.findById(userId).lean()

		if (!currentUser) {
			throw new Error('Could not find User')
		}

		const { displayName, email, ...userInfo } = data

		if (email || displayName) {
			const updateRequest: UpdateRequest = {}

			if (email) {
				updateRequest.email = email
			}

			if (displayName) {
				updateRequest.displayName = displayName
			}

			await firebaseAuth.updateUser(currentUser.uid, updateRequest)
		}

		const fullData = {
			...currentUser,
			...userInfo,
			email,
			displayName,
		}

		await userRepo.validate(fullData)

		const user = await userRepo.findByIdAndUpdate(
			userId,
			{ $set: fullData },
			{ new: true }
		)

		if (!user) throw new Error(`User ${userId} does not exist!`)

		return user.toObject()
	}

	const create = async (data: User) => {
		const { displayName, email, ...userInfo } = data

		//TODO password needs changing obviously
		const firebaseUser = await firebaseAuth.createUser({
			email,
			displayName,
			password: '000000',
		})

		const user = await userRepo.create({
			...userInfo,
			email,
			displayName,
			uid: firebaseUser.uid,
		})

		if (!user) throw new Error(`Could not create User`)

		return user.toObject()
	}

	const blockOne = async (userId: string) => {
		const currentUser = await userRepo.findById(userId).lean()

		if (!currentUser) {
			throw new Error('Could not find User')
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: true,
		})

		await userRepo.findByIdAndUpdate(userId, {
			$set: {
				blocked: true,
			},
		})
	}

	const unblockOne = async (userId: string) => {
		const currentUser = await userRepo.findById(userId).lean()

		if (!currentUser) {
			throw new Error('Could not find User')
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: false,
		})

		await userRepo.findByIdAndUpdate(userId, {
			$set: {
				blocked: false,
			},
		})
	}

	const deleteOne = async (userId: string) => {
		const currentUser = await userRepo.findById(userId).lean()

		if (!currentUser) {
			throw new Error('Could not find User')
		}

		await firebaseAuth.deleteUser(currentUser.uid)

		await userRepo.findByIdAndDelete(userId)
	}

	return {
		deleteOne,
		getTable,
		getAutocomplete,
		getById,
		getByUid,
		update,
		create,
		blockOne,
		unblockOne,
	}
}
