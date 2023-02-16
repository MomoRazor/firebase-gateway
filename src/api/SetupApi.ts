import { Application } from 'express'
import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { camSetup, mailSetup } from '../serviceSpecifics'
import { RBACSetup } from '../setup'
import { googleGroupSetup } from '../serviceSpecifics/googleGroupSetup'

export const SetupApi = (
	app: Application,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	permissionRepo: IPermissionRepo,
	serviceRepo: IServiceRepo,
	authPrefix: string,
	camPrefix: string,
	mailPrefix: string,
	googleGroupPrefix: string
) => {
	app.get(`${authPrefix}/setup`, async (_, res) => {
		try {
			await RBACSetup(permissionRepo, roleRepo, pageRepo, authPrefix)

			console.info('RBAC Setup Successful!')

			return res.status(200).json({
				data: {},
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

	app.get(`${camPrefix}/setup`, async (_, res) => {
		try {
			await camSetup(
				permissionRepo,
				roleRepo,
				pageRepo,
				serviceRepo,
				camPrefix
			)

			console.info('CAM Setup Successful!')

			return res.status(200).json({
				data: {},
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

	app.get(`${mailPrefix}/setup`, async (_, res) => {
		try {
			await mailSetup(serviceRepo)

			console.info('Mail Setup Successful!')

			return res.status(200).json({
				data: {},
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

	app.get(`${googleGroupPrefix}/setup`, async (_, res) => {
		try {
			await googleGroupSetup(serviceRepo)

			console.info('Google Group Setup Successful!')

			return res.status(200).json({
				data: {},
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
