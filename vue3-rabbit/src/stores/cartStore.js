// 封装购物车模块

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart"

export const useCartStore = defineStore('cart', () => {
  const useStore = useUserStore()
  const isLogin = computed(() => useStore.userInfo.token)
  // 1. 定义state - cartList
  const cartList = ref([])
  // 获取最新购物车列表action
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 2. 定义action - addCart
  const addCart = async (goods) => {
    const { skuId, count } = goods
    // console.log('当前登录状态:', isLogin.value)
    // console.log('当前token:', useStore.userInfo.token)
    if (isLogin.value) {
      // 登录状态下的购物车逻辑
      await insertCartAPI({ skuId, count })
      updateNewList()
    } else {
      // 添加购物车操作
      // 已添加过 - count + 1
      // 没有添加过 - 直接push
      // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        // 找到了
        item.count++
      } else {
        // 没找到
        cartList.value.push(goods)
      }
    }
  }
  // 删除购物车
  const delCart = async (skuId) => {
    if (isLogin.value) {
      // 登录状态，调用接口
      await delCartAPI([skuId])
      updateNewList()
    } else {
      // filter数组方法。保留所有 skuId 不等于要删除 skuId 的商品，相当于把目标商品“过滤”掉了
      cartList.value = cartList.value.filter(item => item.skuId !== skuId);
    }
  }
  // 清除购物车
  const clearCart = () => {
    cartList.value = []
  }

  // 单选功能
  const singleCheck = (skuId, selected) => {
    // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }
  // 全选功能
  const allCheck = (selected) => {
    // 把cartList中的每一项的selected都设置为当前的全选框状态
    cartList.value.forEach(item => item.selected = selected)
  }
  // 是否全选
  const isAll = computed(() => cartList.value.every((item) => item.selected))

  // 计算属性
  // 1. 总的数量 所有项的count之和
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
  // 2. 总价 所有项的count*price之和
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
  // 3.已选数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
  // 4.已选商品总计价格
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

  return {
    cartList,
    allCount,
    allPrice,
    isAll,
    selectedCount,
    selectedPrice,
    updateNewList,
    addCart,
    delCart,
    clearCart,
    singleCheck,
    allCheck
  }
}, { persist: true, })