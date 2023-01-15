import { Application } from 'express'
import { IUserSvc } from '../svc'

export const UserApi = (
	app: Application,
	userService: IUserSvc,
	prefix: string
) => {
	app.post(`${prefix}/create/users`, async (req, res) => {
		try {
			const { body } = req

			const newUser = await userService.create(body)

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
