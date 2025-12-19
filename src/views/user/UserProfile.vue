<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import PageContainer from '@/components/PageContainer.vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const userStore = useUserStore()

// 初始化表单数据
const userInfo = ref({
  id: '',
  nickname: '',
  email: ''
})

// 监听 store 中的 user 变化，一旦有数据（比如页面刷新后重新获取到了），就回显给 userInfo
watch(
  () => userStore.user,
  (newVal) => {
    userInfo.value = { ...newVal }
  },
  { immediate: true }
)

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '昵称必须是2-10位的非空字符串', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const getUser = userStore.getUser

const onSubmit = async () => {
  // 1. 校验表单
  const valid = await formRef.value.validate()
  if (valid) {
    // 2. 调用接口更新用户信息
    await userUpdateInfoService(userInfo.value)
    // 3. 更新 store 中的用户信息 (重新获取)
    await getUser()
    // 4. 提示成功
    ElMessage.success('修改成功')
  }
}
</script>

<template>
  <PageContainer title="基本资料">
    <el-form ref="formRef" :model="userInfo" :rules="rules" label-width="100px" size="large">
      <el-form-item label="登录名称">
        <el-input v-model="userStore.user.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
