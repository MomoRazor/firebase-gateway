import { Application } from 'express'
import { IRoleSvc } from '../svc'

export const RoleApi = (
	app: Application,
	roleService: IRoleSvc,
	prefix: string
) => {
	app.post(`${prefix}/create/roles`, async (req, res) => {
		try {
			const body = req.body

			const newRole = await roleService.create(body)

			return res.status(200).json({
				data: newRole,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})

	app.post(`${prefix}/update/roles`, async (req, res) => {
		try {
			const { id, ...body } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id'],
				})
			}

			const newRole = await roleService.update(id, body)

			return res.status(200).json({
				data: newRole,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})

	app.post(`${prefix}/get/roles`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const role = await roleService.getById(id)

			return res.status(200).json({
				data: role,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})

	app.post(`${prefix}/get/roles/table`, async (req, res) => {
		try {
			const body = req.body

			const roleTable = await roleService.getTable(body)

			return res.status(200).json({
				data: roleTable,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})

	app.post(`${prefix}/get/roles/autocomplete`, async (req, res) => {
		try {
			const body = req.body

			const roleTable = await roleService.getAutocomplete(body)

			return res.status(200).json({
				data: roleTable,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})

	app.post(`${prefix}/delete/roles`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const role = await roleService.deleteOne(id)

			return res.status(200).json({
				data: role,
				errors: [],
			})
		} catch (e: any) {
			console.error(e)
			return res.status(500).json({
				data: null,
				errors: [e.message],
			})
		}
	})
}
