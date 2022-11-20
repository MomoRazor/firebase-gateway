import { Schema, Model, Connection } from 'mongoose'

export interface Page {
	name: string
	domain: string
	endpoint: string
	open: boolean
	system: boolean
	permissionNames: string[]
}

export type IPageRepo = Model<Page>

const PageSchema = new Schema<Page>({
	name: { type: Schema.Types.String, required: true },
	domain: { type: Schema.Types.String, required: true },
	endpoint: { type: Schema.Types.String, required: true },
	system: { type: Schema.Types.Boolean, required: true, default: false },
	open: { type: Schema.Types.Boolean, required: true, default: false },
	permissionNames: {
		type: [Schema.Types.String],
		required: true,
		defualt: [],
	},
})

PageSchema.index({ name: 1 }, { unique: true })

export const PageRepo = async (connection: Connection): Promise<IPageRepo> => {
	const pageRepo = connection.model<Page>('page', PageSchema)
	await pageRepo.syncIndexes()
	return pageRepo
}
