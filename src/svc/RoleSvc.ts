import { AutocompleteFilter, PaginationFilter, IRoleRepo, Role } from '../data'

export interface IRoleSvc {
	getTable: (
		pagination: PaginationFilter
	) => Promise<{ data: Role[]; total: number }>
	getAutocomplete: (info: AutocompleteFilter) => Promise<{ data: Role[] }>
	getById: (roleId: string) => Promise<Role>
	update: (roleId: string, data: Partial<Role>) => Promise<Role>
	create: (data: Role) => Promise<Role>
	deleteOne: (roleId: string) => Promise<void>
}

export const RoleSvc = (roleRepo: IRoleRepo): IRoleSvc => {
	const getTable = async (pagination: PaginationFilter) => {
		const fullFilter = {
			...pagination.filter,
			system: false,
		}

		const data = await roleRepo
			.find(fullFilter, pagination.projection)
			.sort(pagination.sort)
			.skip((pagination.page - 1) * pagination.limit)
			.limit(pagination.limit)
			.lean()

		const total = await roleRepo.countDocuments(fullFilter)

		return {
			data,
			total,
		}
	}

	const getAutocomplete = async (info: AutocompleteFilter) => {
		const { filter, search, limit } = info

		const autoFilter = {
			...filter,
			system: false,
			name: {
				$regex: search || '',
				$options: 'ig',
			},
		}

		const data = await roleRepo.find(autoFilter).limit(limit).lean()

		return {
			data,
		}
	}

	const getById = async (id: string) => {
		const role = await roleRepo.findById(id).lean()

		if (!role) {
			throw new Error('Could not find Role')
		}

		return role
	}

	const update = async (roleId: string, data: Partial<Role>) => {
		const currentRole = await roleRepo.findById(roleId).lean()

		if (!currentRole) {
			throw new Error('Could not find Role')
		}

		const fullData = {
			...currentRole,
			...data,
		}

		await roleRepo.validate(fullData)

		const role = await roleRepo.findByIdAndUpdate(
			roleId,
			{ $set: fullData },
			{ new: true }
		)

		if (!role) throw new Error(`Role ${roleId} does not exist!`)

		return role.toObject()
	}

	const create = async (data: Role) => {
		const role = await roleRepo.create(data)

		if (!role) throw new Error(`Could not create Role`)

		return role.toObject()
	}

	const deleteOne = async (roleId: string) => {
		const currentRole = await roleRepo.findById(roleId).lean()

		if (!currentRole) {
			throw new Error('Could not find Role')
		}

		await roleRepo.findByIdAndDelete(roleId)
	}

	return {
		deleteOne,
		getTable,
		getAutocomplete,
		getById,
		update,
		create,
	}
}
