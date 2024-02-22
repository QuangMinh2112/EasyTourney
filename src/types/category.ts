export interface Categories {
  categoryId: number
  categoryName: string
}

export interface CategoryName {
  categoryId: number
  categoryName: string
  createdAt: string
  deleted: boolean
  deletedAt: string | null
  updatedAt: string | null
}

export interface CategoryEdit {
  id: number
  categoryName: string
}
