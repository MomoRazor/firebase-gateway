import { Schema, Model, Connection } from 'mongoose'

export interface Role {
	name: string
	permissionNames: string[]
	pageNames: string[]
	system: boolean
}

export type IRoleRepo = Model<Role>

const RoleSchema = new Schema<Role>({
	name: { type: Schema.Types.String, required: true },
	permissionNames: {
		type: [Schema.Types.String],
		required: true,
		default: [],
	},
	pageNames: {
		type: [Schema.Types.String],
		required: true,
		default: [],
	},
	system: { type: Schema.Types.Boolean, required: true, default: false },
})

RoleSchema.index({ name: 1 }, { unique: true })

export const RoleRepo = async (connection: Connection): Promise<IRoleRepo> => {
	const roleRepo = connection.model<Role>('role', RoleSchema)
	await roleRepo.syncIndexes()
	return roleRepo
}
