<script setup>
import { ref, onMounted } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import PageContainer from '@/components/PageContainer.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from '@/components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false) // loading状态
const dialog = ref() // 弹层组件实例

const getChannelList = async () => {
  loading.value = true // 发送请求前开启loading
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false // 请求结束关闭loading
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  // 1. 弹窗提示用户是否确认删除
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning', // 设置弹窗图标为警告类型
    confirmButtonText: '确认', // 确认按钮的文本
    cancelButtonText: '取消' // 取消按钮的文本
  })
  // 2. 用户点击确认后，调用删除接口，传入当前行的 id
  await artDelChannelService(row.id)
  // 3. 删除成功后的消息提示
  ElMessage({ type: 'success', message: '删除成功' })
  // 4. 重新获取列表数据，刷新页面
  getChannelList()
}

const onSuccess = () => {
  getChannelList()
}

onMounted(() => {
  getChannelList()
})
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加/编辑的弹窗 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>
<style lang="scss" scoped></style>
