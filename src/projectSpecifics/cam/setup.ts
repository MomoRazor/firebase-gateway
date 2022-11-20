import { IPageRepo } from '../../data/PageRepo'
import { IPermissionRepo } from '../../data/PermissionRepo'
import { IRoleRepo } from '../../data/RoleRepo'
import { IServiceRepo } from '../../data/ServiceRepo'
import { PROJECT_ID } from '../../env'

export const camSetup = async (
	permissionRepo: IPermissionRepo,
	roleRepo: IRoleRepo,
	pageRepo: IPageRepo,
	serviceRepo: IServiceRepo
) => {
	console.log(PROJECT_ID)
	console.log(permissionRepo, roleRepo, pageRepo, serviceRepo)
}
