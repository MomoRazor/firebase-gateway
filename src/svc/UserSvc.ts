import { Auth } from 'firebase-admin/lib/auth/auth'
import { UserRecord, UserInfo } from 'firebase-admin/auth'

export interface IUserSvc {
	getByUid: (uid: string) => Promise<UserRecord>
	update: (userId: string, data: Partial<UserInfo>) => Promise<UserRecord>
	create: (data: UserInfo) => Promise<UserRecord>
	deleteOne: (userId: string) => Promise<void>
	blockOne: (userId: string) => Promise<void>
	unblockOne: (userId: string) => Promise<void>
}

export const UserSvc = (firebaseAuth: Auth): IUserSvc => {
	const getByUid = async (uid: string) => {
		const user = await firebaseAuth.getUser(uid)

		if (!user) {
			throw new Error('Could not find User')
		}

		return user
	}

	const update = async (userId: string, data: Partial<UserInfo>) => {
		const user = await firebaseAuth.updateUser(userId, data)

		return user
	}

	const create = async (data: UserInfo, passedPassword?: string) => {
		//TODO password needs generating
		const password = passedPassword || '000000'

		const user = await firebaseAuth.createUser({
			...data,
			password,
		})

		return user
	}

	const blockOne = async (userId: string) => {
		await firebaseAuth.updateUser(userId, {
			disabled: true,
		})
	}

	const unblockOne = async (userId: string) => {
		await firebaseAuth.updateUser(userId, {
			disabled: false,
		})
	}

	const deleteOne = async (userId: string) => {
		await firebaseAuth.deleteUser(userId)
	}

	return {
		deleteOne,
		getByUid,
		update,
		create,
		blockOne,
		unblockOne,
	}
}
