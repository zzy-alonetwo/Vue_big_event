import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
// pinia独立维护
const pinia = createPinia()
pinia.use(persist)

export default pinia

// 仓库独立导出
export * from '@/stores/modules/user'
export * from '@/stores/modules/counter'
