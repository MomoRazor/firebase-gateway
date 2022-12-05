import { IPageRepo, IPermissionRepo, IRoleRepo, IServiceRepo } from '../data'
import { PROJECT_ID } from '../env'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	console.log(PROJECT_ID)
	console.log(permissionRepo, roleRepo, pageRepo, serviceRepo)
}
