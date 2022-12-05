import { Schema, Connection, Model } from 'mongoose'

export interface User {
	uid: string
	roleNames: string[]
	displayName: string
	email: string
	phoneNumber?: string
	blocked: boolean
}

export type IUserRepo = Model<User>

const UserSchema = new Schema<User>({
	uid: { type: Schema.Types.String, required: true },
	roleNames: { type: [Schema.Types.String], required: true, default: [] },
	displayName: { type: Schema.Types.String, required: true },
	email: { type: Schema.Types.String, required: true },
	phoneNumber: { type: Schema.Types.String, required: false },
	blocked: {
		type: Schema.Types.Boolean,
		required: false,
		default: false,
	},
})

UserSchema.index({ uid: 1 }, { unique: true })

export const UserRepo = async (connection: Connection): Promise<IUserRepo> => {
	const userModel = connection.model<User>('user', UserSchema)
	await userModel.syncIndexes()
	return userModel
}
