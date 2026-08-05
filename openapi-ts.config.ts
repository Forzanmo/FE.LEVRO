import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: '../backend/openapi/levrro.openapi.json',
  output: 'src/api/generated',
})
