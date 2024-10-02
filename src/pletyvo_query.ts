// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

export interface PletyvoQuery {
	after?: string
	before?: string
	limit?: number
	order?: 'asc' | 'desc'
}
