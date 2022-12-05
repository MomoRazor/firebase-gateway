import { Application } from 'express'
import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { camSetup } from '../projectSpecifics'
import { RBACSetup } from '../setup'

export const SetupApi = (
	app: Application,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	permissionRepo: IPermissionRepo,
	serviceRepo: IServiceRepo,
	prefix: string
) => {
	app.get(`${prefix}/rbac/setup`, async (_, res) => {
		try {
			await RBACSetup(permissionRepo, roleRepo, pageRepo)

			console.info('Setup Successful!')

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

	app.get(`${prefix}/cam/setup`, async (_, res) => {
		try {
			await camSetup(permissionRepo, roleRepo, pageRepo, serviceRepo)

			console.info('Setup Successful!')

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
