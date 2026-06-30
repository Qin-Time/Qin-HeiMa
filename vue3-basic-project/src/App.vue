<script setup>
import { onMounted, ref } from 'vue'
import Edit from './components/Edit.vue'
import axios from 'axios'

// TODO: 列表渲染
const list = ref([])
const getList = async() => { 
  const res = await axios.get('/list')
  list.value = res.data
}

onMounted(() =>getList())
// TODO: 删除功能
const onDelete = async (id) => { 
  console.log(`将要删除的id为${id}`);
  await axios.delete(`/del/${id}`)
  getList()
}

// TODO: 编辑功能
// 思路：为编辑按钮绑定事件，弹出Edit组件，事件内获取id,将当前id的数据映射到组件内，组件内部实现数据编辑，通过id调用编辑接口，传入id.name,id.place，
// 打开弹窗（获取子组件实例，调用子组件方法修改子组件dialogVisible的值）
const editRef = ref(null)
const onEdit = (row) => { 
  editRef.value.open(row)
}
  

</script>

<template>
  <div class="app">
    <el-table :data="list">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name" width="150"></el-table-column>
      <el-table-column label="籍贯" prop="place"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" @click="onEdit(row)" link>编辑</el-button>
          <el-button type="danger" @click="onDelete(row.id)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Edit ref="editRef" @on-update="getList" />
</template>

<style scoped>
.app {
  width: 980px;
  margin: 100px auto 0;
}
</style>
