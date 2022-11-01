export interface PaginationFilter {
	filter: any
	page: number
	limit: number
	sort: string
	projection: string
}

export interface AutocompleteFilter {
	filter: any
	search: string
	limit: number
}
