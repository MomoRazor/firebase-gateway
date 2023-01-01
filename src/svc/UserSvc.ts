import { AutocompleteFilter, IUserRepo, PaginationFilter, User } from '../data'
import { Auth } from 'firebase-admin/lib/auth/auth'
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config'
import { createHash } from 'crypto'
import { MAIL_SERVICE_URL, RBAC_SECRET } from '../env'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { sign } from 'jsonwebtoken'

export interface IUserSvc {
	getTable: (
		pagination: PaginationFilter
	) => Promise<{ data: User[]; total: number }>
	getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: User[] }>
	getById: (userId: string) => Promise<User>
	getByUid: (uid: string) => Promise<User>
	create: (userData: User & CreateRequest, byUid?: string) => Promise<User>
	update: (
		userData: Partial<User & CreateRequest>,
		byUid?: string
	) => Promise<User>
	deleteOne: (userId: string, byUid?: string) => Promise<void>
	blockOne: (userId: string, byUid?: string) => Promise<User>
	unblockOne: (userId: string, byUid?: string) => Promise<User>
}

export const UserSvc = (
	userRepo: IUserRepo,
	firebaseAuth: Auth,
	axios: AxiosInstance
): IUserSvc => {
	const getTable = async (pagination: PaginationFilter) => {
		const fullFilter = {
			...pagination.filter,
			system: false,
		}

		const data = await userRepo
			.find(fullFilter, pagination.projection)
			.sort(pagination.sort)
			.skip((pagination.page - 1) * pagination.limit)
			.limit(pagination.limit)
			.lean()

		const total = await userRepo.countDocuments(fullFilter)

		return {
			data,
			total,
		}
	}

	const getAutocomplete = async (info: AutocompleteFilter) => {
		const { filter, search, limit } = info

		const autoFilter = {
			...filter,
			displayName: {
				$regex: search || '',
				$options: 'ig',
			},
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

	const create = async (userData: User & CreateRequest, byUid?: string) => {
		if (!MAIL_SERVICE_URL && !userData.password) {
			throw new Error(
				'No Mail Service set, so password cannot be generated and sent to user'
			)
		}

		const userInformation = {
			...userData,
			password:
				userData.password ||
				createHash('sha256')
					.update(Date.now().toString() + 'hard-coded-salt')
					.digest('hex')
					.substring(0, 8),
			disabled: false,
		}

		if (!userInformation.email) {
			throw new Error(`Email is required!`)
		}

		if (!userInformation.displayName) {
			throw new Error(`Display name is required!`)
		}

		const firebaseUser = await firebaseAuth.createUser({
			...userInformation,
		})

		try {
			const user = await userRepo.create({
				...firebaseUser,
				...userInformation,
			})

			if (!user) {
				throw new Error('User was not created!')
			}

			const aggregatedUserInformation = {
				...firebaseUser,
				...user.toObject(),
			}

			if (!userData.password) {
				let currentUser = await userRepo.findOne({ uid: byUid }).lean()

				if (!currentUser) {
					throw new Error('Could not find Current User in system')
				}

				let request: AxiosRequestConfig = {
					method: 'POST',
					url: `${MAIL_SERVICE_URL}/mailjet/send`,
					headers: {
						'x-token': sign(currentUser, RBAC_SECRET),
					},
					data: {},
				}

				try {
					await axios.request(request)
				} catch (e) {
					console.error('Failed to send email - ' + JSON.stringify(e))
				}
			}

			return aggregatedUserInformation
		} catch (e) {
			console.warn(e)

			await firebaseAuth.deleteUser(firebaseUser.uid)
			throw new Error(`Failed to create user ${firebaseUser.uid}!`)
		}
	}

	const update = async (userData: Partial<User & CreateRequest>) => {
		const { uid } = userData

		if (!uid) {
			throw new Error(`UID is required!`)
		}

		let currentUser = await userRepo.findOne({ uid })

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}`)
		}

		await firebaseAuth.updateUser(uid, userData)

		const fullData = {
			...currentUser,
			...userData,
		}

		await userRepo.validate(fullData)

		const user = await userRepo.findOneAndUpdate(
			{ uid },
			{ $set: fullData },
			{ new: true }
		)

		if (!user) throw new Error(`User ${uid} does not exist!`)

		return user.toObject()
	}

	const blockOne = async (uid: string) => {
		const currentUser = await userRepo.findOne({ uid }).lean()

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}!`)
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: true,
		})

		const user = await userRepo.findOneAndUpdate(
			{ uid },
			{
				$set: {
					blocked: true,
				},
			},
			{ new: true }
		)

		if (!user) throw new Error(`User ${uid} does not exist!`)

		return user.toObject()
	}

	const unblockOne = async (uid: string) => {
		const currentUser = await userRepo.findOne({ uid }).lean()

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}!`)
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: false,
		})

		const user = await userRepo.findOneAndUpdate(
			{ uid },
			{
				$set: {
					blocked: false,
				},
			},
			{ new: true }
		)

		if (!user) throw new Error(`User ${uid} does not exist!`)

		return user.toObject()
	}

	const deleteOne = async (uid: string) => {
		const currentUser = await userRepo.findOne({ uid }).lean()

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}!`)
		}

		await firebaseAuth.deleteUser(currentUser.uid)

		await userRepo.findOneAndDelete({ uid })
	}

	return {
		getTable,
		getAutocomplete,
		getById,
		getByUid,
		deleteOne,
		update,
		create,
		blockOne,
		unblockOne,
	}
}
