import { Schema, Model, Connection } from 'mongoose'

export interface Permission {
	name: string
	method: `GET` | `POST` | `DELETE` | `PUT` | `PATCH` | '*'
	endpoint: string
	open: boolean
	system: boolean
}

export type IPermissionRepo = Model<Permission>

const PermissionSchema = new Schema<Permission>({
	name: { type: Schema.Types.String, required: true },
	method: {
		type: Schema.Types.String,
		required: true,
		enum: [`GET`, `POST`, `DELETE`, `PUT`, `PATCH`, '*'],
	},
	endpoint: { type: Schema.Types.String, required: true },
	open: { type: Schema.Types.Boolean, required: true, default: false },
	system: { type: Schema.Types.Boolean, required: true, default: false },
})

PermissionSchema.index({ name: 1 }, { unique: true })

export const PermissionRepo = async (
	connection: Connection
): Promise<IPermissionRepo> => {
	const permissionRepo = connection.model<Permission>(
		'permission',
		PermissionSchema
	)
	await permissionRepo.syncIndexes()
	return permissionRepo
}
