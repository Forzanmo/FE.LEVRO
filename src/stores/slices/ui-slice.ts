import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

/**
 * Global UI state — ephemeral, client-only chrome state that several unrelated
 * components need to share (sidebar, mobile nav, command menu). Server/domain
 * data never lives here; that belongs to TanStack Query + services.
 */
export interface UiState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  commandMenuOpen: boolean
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  commandMenuOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload
    },
    toggleCommandMenu(state) {
      state.commandMenuOpen = !state.commandMenuOpen
    },
    setCommandMenuOpen(state, action: PayloadAction<boolean>) {
      state.commandMenuOpen = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setMobileNavOpen,
  toggleCommandMenu,
  setCommandMenuOpen,
} = uiSlice.actions

export const uiReducer = uiSlice.reducer
