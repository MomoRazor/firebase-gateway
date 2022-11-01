import { Schema, Connection, Model } from 'mongoose'

export interface Service {
	name: string
	url: string
	enabled: boolean
}

export const ServiceSchema = new Schema<Service>({
	name: { type: Schema.Types.String, required: true },
	url: { type: Schema.Types.String, required: true },
	enabled: { type: Schema.Types.Boolean, required: true },
})

ServiceSchema.index({ name: 1 }, { unique: true })

export type IServiceRepo = Model<Service>

export const ServiceRepo = async (
	connection: Connection
): Promise<IServiceRepo> => {
	const serviceRepo = connection.model<Service>('service', ServiceSchema)
	await serviceRepo.syncIndexes()
	return serviceRepo
}
