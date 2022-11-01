import { Application } from 'express'
import { IUserSvc } from '../svc/UserSvc'

const prefix = '/api/v1/auth'

export const UserApi = (app: Application, userService: IUserSvc) => {
	app.post(`${prefix}/create/user`, async (req, res) => {
		try {
			const body = req.body

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

	app.post(`${prefix}/update/user`, async (req, res) => {
		try {
			const { id, ...body } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id'],
				})
			}

			const newUser = await userService.update(id, body)

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

	app.post(`${prefix}/get/user`, async (req, res) => {
		try {
			const { uid } = req.body

			if (!uid) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Uid!'],
				})
			}

			const user = await userService.getByUid(uid)

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

	app.post(`${prefix}/delete/user`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.deleteOne(id)

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

	app.post(`${prefix}/block/user`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.blockOne(id)

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

	app.post(`${prefix}/unblock/user`, async (req, res) => {
		try {
			const { id } = req.body

			if (!id) {
				return res.status(400).json({
					data: null,
					errors: ['Missing Id!'],
				})
			}

			const user = await userService.unblockOne(id)

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
