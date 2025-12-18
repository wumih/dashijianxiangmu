<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

// 定义响应式数据 articleList，用于存储文章列表，初始化为空数组
const articleList = ref([])
// 定义响应式数据 total，用于存储文章总条数，初始化为 0
const total = ref(0)
// 定义 loading 状态，用于控制表格加载动画
const loading = ref(false)

// 搜索表单的数据对象（虽然目前是假数据，但为了 el-select 正常工作，建议绑定 v-model）
const params = ref({
  pagenum: 1, // 当前页码
  pagesize: 5, // 每页条数
  cate_id: '',
  state: ''
})

// 定义获取文章列表的异步函数
const getArticleList = async () => {
  // 发送请求前，开启 loading 加载状态
  loading.value = true
  // 调用接口 artGetListService，传入当前的搜索参数 params.value
  const res = await artGetListService(params.value)
  // 将接口返回的文章列表数据赋值给 articleList
  articleList.value = res.data.data
  // 将接口返回的文章总条数赋值给 total
  total.value = res.data.total
  // 请求结束后，关闭 loading 加载状态
  loading.value = false
}

// 处理分页逻辑：每页条数变化时触发
const onSizeChange = (size) => {
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
  // 重新从第一页渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页和每页条数，渲染列表
  getArticleList()
}
// 处理分页逻辑：当前页码变化时触发
const onCurrentChange = (page) => {
  // 更新当前页码
  params.value.pagenum = page
  // 基于最新的当前页，渲染列表
  getArticleList()
}

// 搜索逻辑：按照最新的条件重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 // 重置页码
  getArticleList()
}

// 重置逻辑：清空搜索条件，重置页码，重新检索
const onReset = () => {
  params.value.pagenum = 1 // 重置页码
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 进入页面时立即调用获取文章列表函数，渲染表格
getArticleList()

// 定义抽屉组件的 ref
const articleEditRef = ref()

// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  // 提示用户是否确认删除
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 调用删除接口
  await artDelService(row.id)
  // 提示删除成功
  ElMessage({ type: 'success', message: '删除成功' })
  // 刷新列表
  getArticleList()
}

// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- 使用封装的分类选择组件，并绑定 v-model -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- Vue3 中 el-select 建议配合 v-model 使用 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          <!-- 调用 formatTime 函数格式化时间 -->
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <!-- 抽屉组件 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </PageContainer>
</template>
