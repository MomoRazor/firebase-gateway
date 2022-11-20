import { IUserRepo, User } from '../data/UserRepo'
import { Auth } from 'firebase-admin/lib/auth/auth'
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config'
import { createHash } from 'crypto'

export interface IUserSvc {
	create: (userData: User & CreateRequest, byUid?: string) => Promise<User>
	update: (
		userData: Partial<User & CreateRequest>,
		byUid?: string
	) => Promise<User>
	deleteOne: (userId: string, byUid?: string) => Promise<void>
	blockOne: (userId: string, byUid?: string) => Promise<void>
	unblockOne: (userId: string, byUid?: string) => Promise<void>
}

export const UserSvc = (userRepo: IUserRepo, firebaseAuth: Auth): IUserSvc => {
	const create = async (userData: User & CreateRequest) => {
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

			// TODO: STRICTLY REMOVE BEFORE GOING TO PRODUCTION
			console.log(
				new Date().toISOString(),
				userInformation.uid,
				userInformation.password
			)

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

		let user = await userRepo.findOne({ uid })

		if (!user) {
			throw new Error(`Could not find User with uid ${uid}`)
		}

		const firebaseUser = await firebaseAuth.updateUser(uid, userData)

		// TODO: Update if adding new user fields
		if (userData.roleNames) {
			user = await userRepo.findOneAndUpdate(
				{ uid },
				{
					$set: {
						roleNames: userData.roleNames,
					},
				},
				{ new: true }
			)
		}

		if (!user) {
			throw new Error(`Could not find User with uid ${uid}`)
		}

		const aggregatedUserInformation = {
			...firebaseUser,
			...user.toObject(),
		}

		return aggregatedUserInformation
	}

	const blockOne = async (uid: string) => {
		const currentUser = await userRepo.findOne({ uid }).lean()

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}!`)
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: true,
		})
	}

	const unblockOne = async (uid: string) => {
		const currentUser = await userRepo.findOne({ uid }).lean()

		if (!currentUser) {
			throw new Error(`Could not find User with uid ${uid}!`)
		}

		await firebaseAuth.updateUser(currentUser.uid, {
			disabled: false,
		})
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
		deleteOne,
		update,
		create,
		blockOne,
		unblockOne,
	}
}
