import { createSlice } from '@reduxjs/toolkit'
import { Categories, CategoryName } from '../../../types/category'
import { getCategories } from './categories.slice'

interface CategoryState {
  categories: Categories[]
  isLoading: boolean
  listCategory: CategoryName[]
  seletedCategory: any | null
}

const initialState: CategoryState = {
  categories: [],
  seletedCategory: null,
  isLoading: false,
  listCategory: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = [...action.payload]
    },
    setSelectedCategory: (state, action) => {
      state.seletedCategory = action.payload
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload
      const index = state.categories.findIndex((category) => category.categoryId === updatedCategory.categoryId)
      if (index !== -1) {
        state.categories[index].categoryName = updatedCategory.categoryName
      }
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.isLoading = false
      state.listCategory = action.payload as unknown as CategoryName[]
    })

    builder.addCase(getCategories.rejected, (state) => {
      state.isLoading = false
      state.listCategory = []
    })
  }
})

export const { setCategories, setSelectedCategory, updateCategory } = categoriesSlice.actions

export default categoriesSlice.reducer
