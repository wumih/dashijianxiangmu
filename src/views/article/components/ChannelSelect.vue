<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

// 接收父组件传递的 modelValue (v-model 的值)
defineProps({
  modelValue: {
    type: [Number, String]
  },
  // 接收外部传入的 width 属性，用于控制下拉框宽度
  width: {
    type: String
  }
})

// 定义更新事件，用于实现 v-model 双向绑定
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- 监听 el-select 的更新事件，并将值通过 emit 传递给父组件 -->
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" :style="{ width }">
    <el-option v-for="channel in channelList" :key="channel.id" :label="channel.cate_name"
      :value="channel.id"></el-option>
  </el-select>
</template>
