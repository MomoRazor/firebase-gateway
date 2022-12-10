import { Application } from 'express'
import { IUserSvc } from '../svc'

export const UserApi = (
	app: Application,
	userService: IUserSvc,
	prefix: string
) => {
	app.post(`${prefix}/get/users`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.getById(id)

			return res.status(200).json({
				data: user,
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

	app.post(`${prefix}/get/users/table`, async (req, res) => {
		try {
			const body = req.body

			const userTable = await userService.getTable(body)

			return res.status(200).json({
				data: userTable,
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

	app.post(`${prefix}/get/users/autocomplete`, async (req, res) => {
		try {
			const body = req.body

			const userTable = await userService.getAutocomplete(body)

			return res.status(200).json({
				data: userTable,
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

	app.post(`${prefix}/create/users`, async (req, res) => {
		try {
			const { body } = req

			const newUser = await userService.create(
				body,
				res.locals.userData?.uid
			)

			return res.status(200).json({
				data: newUser,
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

	app.post(`${prefix}/update/users`, async (req, res) => {
		try {
			const newUser = await userService.update(
				req.body,
				res.locals.userData?.uid
			)

			return res.status(200).json({
				data: newUser,
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

	app.post(`${prefix}/delete/users`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.deleteOne(
				id,
				res.locals.userData?.uid
			)

			return res.status(200).json({
				data: user,
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

	app.post(`${prefix}/block/users`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.blockOne(
				id,
				res.locals.userData?.uid
			)

			return res.status(200).json({
				data: user,
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

	app.post(`${prefix}/unblock/users`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.unblockOne(
				id,
				res.locals.userData?.uid
			)

			return res.status(200).json({
				data: user,
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
