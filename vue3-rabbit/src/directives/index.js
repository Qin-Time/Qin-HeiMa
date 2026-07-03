
// 定义懒加载
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  install(app) {
    // 懒加载指令逻辑
    app.directive(
      'img-lazy',
      {
        mounted(el, binding) {
          // console.log(el);
          // el:指令丙丁的那个元素 img
          // binding:binding.value 指令等于号后面绑定的表达式的值 即图片url
          const { stop } = useIntersectionObserver(
            el,
            ([{ isIntersecting }]) => {
              // console.log(isIntersecting)
              if (isIntersecting) {
                // 进入视口区域
                el.src = binding.value
                stop()
              }
            },
          )

        }
      }

    )

  }
}