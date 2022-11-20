import { DateTime } from 'luxon'
import AVLTree from 'avl'

interface NodeData {
	value: any
	expiry?: DateTime
}

export class Mache {
	tree = new AVLTree<string, NodeData>()

	constructor() {}

	set(key: string, value: any, expiryInSeconds?: number) {
		this.tree.insert(key, {
			value,
			expiry: expiryInSeconds
				? DateTime.now().plus({
						seconds: expiryInSeconds,
				  })
				: undefined,
		})

		return value
	}

	get(key: string) {
		const data = this.tree.find(key)?.data

		if (!data) {
			return undefined
		}

		if (data.expiry && data.expiry <= DateTime.now()) {
			this.tree.remove(key)
			return undefined
		}

		return data.value
	}

	invalidate(key: string) {
		const data = this.tree.find(key)?.data

		if (!data) {
			return undefined
		}

		this.tree.remove(key)

		return data
	}
}
