import { Auth } from 'firebase-admin/lib/auth/auth'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export interface IAuthSvc {
	authenticateUser: (
		authorizationHeader: string
	) => Promise<DecodedIdToken | undefined>
}

export const AuthSvc = (auth: Auth): IAuthSvc => {
	const getFirebaseUser = async (token: string) => {
		try {
			return await auth.verifyIdToken(token)
		} catch (e: any) {
			console.warn(e.message)
			return undefined
		}
	}

	const authenticateUser = async (authorizationHeader: string) => {
		try {
			const headerParts = authorizationHeader.split(' ')

			if (headerParts[0].toLowerCase() !== 'bearer') {
				throw new Error(`Invokation not using OAuth authentication!`)
			}

			if (!headerParts[1]) {
				throw new Error(`Missing token!`)
			}

			return getFirebaseUser(headerParts[1])
		} catch (e: any) {
			console.warn(e.message)
			return undefined
		}
	}

	return {
		authenticateUser,
	}
}
