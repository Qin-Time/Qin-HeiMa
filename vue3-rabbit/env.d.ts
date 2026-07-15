/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 为你的 .js 插件文件添加类型声明（可选但推荐）
declare module '@/directives' {
  export const lazyPlugin: any
}

declare module '@/components' {
  export const componentPlugin: any
}