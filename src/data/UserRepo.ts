import { Schema, Connection, Model } from 'mongoose'

export interface User {
	uid: string
	displayName: string
	email: string
	roleNames: string[]
	blocked: boolean
}

export type IUserRepo = Model<User>

const UserSchema = new Schema<User>({
	uid: { type: Schema.Types.String, required: true },
	displayName: { type: Schema.Types.String, required: true },
	email: { type: Schema.Types.String, required: true },
	roleNames: { type: [Schema.Types.String], required: true, default: [] },
	blocked: { type: Schema.Types.Boolean, required: true, default: false },
})

UserSchema.index({ uid: 1 }, { unique: true })

export const UserRepo = async (connection: Connection): Promise<IUserRepo> => {
	const userModel = connection.model<User>('user', UserSchema)
	await userModel.syncIndexes()
	return userModel
}
