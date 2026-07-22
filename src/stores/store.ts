import { configureStore } from '@reduxjs/toolkit'

import { uiReducer } from './slices/ui-slice'

/**
 * Store factory. A new store is created per request on the server (avoiding
 * cross-request state leakage) and once on the client — see StoreProvider.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
