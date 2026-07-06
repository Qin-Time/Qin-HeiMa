<script setup>
import { ref, useTemplateRef, watch } from 'vue';
import { useMouseInElement } from '@vueuse/core';

// props适配图片
defineProps({
  imageList: {
    type: Array,
    default: () => []
  }
})

// // 图片列表
// const imageList = [
//   "https://yanxuan-item.nosdn.127.net/d917c92e663c5ed0bb577c7ded73e4ec.png",
//   "https://yanxuan-item.nosdn.127.net/e801b9572f0b0c02a52952b01adab967.jpg",
//   "https://yanxuan-item.nosdn.127.net/b52c447ad472d51adbdde1a83f550ac2.jpg",
//   "https://yanxuan-item.nosdn.127.net/f93243224dc37674dfca5874fe089c60.jpg",
//   "https://yanxuan-item.nosdn.127.net/f881cfe7de9a576aaeea6ee0d1d24823.jpg"
// ]

// 小图切换逻辑
const activeIndex = ref(0)
const enterhandler = (i) => {
  activeIndex.value = i
}
// 滑块逻辑
const target = useTemplateRef('target')
const { elementX, elementY, isOutside } = useMouseInElement(target)

// 控制滑块跟随鼠标移动 (监听 elementX/Y 变化)
const left = ref(0);
const top = ref(0);

const positionX = ref(0)
const positionY = ref(0)


watch([elementX, elementY], () => {
  if (isOutside.value) return

  // 核心逻辑：将数值限制在 [min, max] 之间
  // Math.min(val, max) 确保不超过最大值
  // Math.max(val, min) 确保不低于最小值

  // 横向处理：限制在 100~300 之间，然后减去 100
  // 结果范围自动锁定在 0~200
  const rawX = Math.min(Math.max(elementX.value, 100), 300);
  left.value = rawX - 100;

  // 纵向处理：同上
  const rawY = Math.min(Math.max(elementY.value, 100), 300);
  top.value = rawY - 100;

  // 控制大图的显示
  positionX.value = -left.value * 2
  positionY.value = -top.value * 2
});



</script>


<template>
  <div class="goods-image">
    <!-- 左侧大图-->
    <div class="middle" ref="target">
      <img :src="imageList[activeIndex]" alt="" />
      <!-- 蒙层小滑块 -->
      <div class="layer" :style="{ left: `${left}px`, top: `${top}px` }"></div>
    </div>
    <!-- 小图列表 -->
    <ul class="small">
      <li v-for="(img, i) in imageList" :key="i" @mouseenter="enterhandler(i)" :class="{ active: i === activeIndex }">
        <img :src="img" alt="" />
      </li>
    </ul>
    <!-- 放大镜大图 -->
    <div class="large" :style="[
      {
        backgroundImage: `url(${imageList[activeIndex]})`,
        backgroundPositionX: `${positionX}px`,
        backgroundPositionY: `${positionY}px`,
      },
    ]" v-show="!isOutside"></div>
  </div>
</template>

<style scoped lang="scss">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
  }

  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    z-index: 500;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    // 背景图:盒子的大小 = 2:1  将来控制背景图的移动来实现放大的效果查看 background-position
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .layer {
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.2);
    // 绝对定位 然后跟随咱们鼠标控制left和top属性就可以让滑块移动起来
    left: 0;
    top: 0;
    position: absolute;
  }

  .small {
    width: 80px;

    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;

      &:hover,
      &.active {
        border: 2px solid $xtxColor;
      }
    }
  }
}
</style>