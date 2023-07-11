<template>
  <!-- <main class="flex-1">
    <div class="py-2">
      <div class="px-4 sm:px-6 md:px-0">
        <h1 class="text-2xl font-semibold text-gray-900">Upload</h1>
      </div>
      <div class="px-4 sm:px-6 md:px-0">

        <div
          class="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
        >
          <div class="mt-1 sm:mt-0 sm:col-start-2 sm:col-span-2 justify-center w-full">
            <div
              class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="space-y-1 text-center">
                <el-icon size="36px" color="#a8abb2">
                  <DocumentAdd class="mx-auto h-12 w-12 text-gray-400" />
                </el-icon>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>点击上传目录 </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      webkitdirectory
                      multiple
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="pl-1">或 拖拽文件至此</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-dialog v-model="isUploading" title="Warning" width="62%" center>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress" class="mx-4 my-8" />
        </el-dialog>

      </div>
    </div>
  </main> -->
  <!-- upload Modals -->
  <el-dialog
    v-model="visible"
    :title="title"
    width="40%"
    align-center
    center
    draggable
    :before-close="handleClose"
  >
    <el-steps :active="step" finish-status="success">
      <el-step title="新建服务" />
      <el-step title="上传文件" />
      <el-step title="配置" />
    </el-steps>
    <!-- form step -->
    <div v-show="step == 1">
      <el-form :model="form" label-width="120px" status-icon>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择…">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.comments" />
        </el-form-item>
      </el-form>
    </div>
    <!-- upload step -->
    <div v-show="step == 2">
      <!-- 上传中 -->
      <slot v-if="isUploading" name="loading">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="progress"
          class="mx-4 my-8"
        />
      </slot>
      <!-- 上传完毕 -->
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded">
        <ul class="h-64 overflow-auto border-2 border-gray-200 divide-gray-200">
          <li v-for="file in filesList" :key="file.uid" class="ml-4 py-2 flex">
            <CircleCheck
              v-if="file.status == 'success'"
              style="width: 1rem; height: 1rem; color: green"
              class="ml-2"
            />
            <div v-else>
              <el-popover placement="top-end" :width="400">
                <template #reference>
                  <WarningFilled style="width: 1rem; height: 1rem; color: red" class="ml-2" />
                </template>
                <template #default>
                  <p class="box-border text-sm font-medium text-gray-900">{{ file.message }}</p>
                </template>
              </el-popover>
            </div>
            <span class="text-sm mx-4 font-medium text-gray-500">
              {{ file.name }}
            </span>
            <button class="delete-icon" @click="reomveFile(file.uid)">
              <CircleCloseFilled
                style="width: 1rem; height: 1rem; margin-left: 0.5rem; color: #a8abb2"
              />
            </button>
          </li>
        </ul>
      </slot>
      <!-- 默认 -->
      <slot v-else name="default">
        <div
          class="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
        >
          <div class="mt-1 sm:mt-0 sm:col-start-2 sm:col-span-2 justify-center w-full">
            <div
              class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="space-y-1 text-center">
                <el-icon size="36px" color="#a8abb2">
                  <DocumentAdd class="mx-auto h-12 w-12 text-gray-400" />
                </el-icon>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>点击上传目录 </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      webkitdirectory
                      multiple
                      @change="handleFileChange"
                    />
                  </label>
                  <p class="pl-1">或 拖拽文件至此</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    <!-- setting step -->
    <div v-show="step == 3"></div>
    <el-divider />
    <span class="grid grid-cols-3 gap-2 place-items-center">
      <el-button @click="step > 2 ? step-- : null">上一步</el-button>
      <el-button v-if="step < 3" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-else type="primary" @click="handleFileUpload">完成</el-button>
      <el-button @click="cancelHandle">取消</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// Props
type Props = {
  visible?: boolean
  title?: string
  uri?: string
}
const emits = defineEmits(['closeEmit', 'refreshEmit'])
withDefaults(defineProps<Props>(), {
  visible: () => false,
  title: () => '成果上传',
  uri: () => 'http://localhost:8080/mupload/1'
})

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
interface UploadFile {
  uid: string // 文件唯一id
  size: number // 文件大小
  name: string // 文件名称
  status: UploadStatus // 上传状态
  progress?: string // 文件上传进度
  resp?: any // 服务端返回数据
  url?: string // 对应展示的url
  message?: string // error消息
}

// 上传进度
const progress = ref(0)
// 第几步
const step = ref(1)
// form
const form = reactive({
  id: '',
  name: '',
  type: '',
  url: '',
  status: 'DRAFT',
  comments: ''
})

const filesList = ref<UploadFile[]>([])
// upload files handle
const handleFileUpload = (e: Event) => {
  // 断言为HTMLInputElement
  const target = e.target as HTMLInputElement
  const files = target.files

  if (files!.length == 0) return
  if (files) {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('upload[]', files[i], files[i].webkitRelativePath)
      // 设置响应式对象，存储到filesList中，以便在页面中展示
      const fileObj = reactive<UploadFile>({
        uid: '',
        size: files[i].size,
        name: files[i].webkitRelativePath,
        status: 'loading'
      })
      filesList.value.push(fileObj)
    }
    axios
      .post(uri, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        //实时上传进度
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            progress.value = complete
          } else {
            progress.value = 1
          }
        }
      })
      .then((resp) => {
        // console.log('resp', resp)
        for (let i = 0; i < resp.data.length; i++) {
          filesList.value[i].uid = resp.data[i].uid
          filesList.value[i].status = resp.data[i].status
          filesList.value[i].message = resp.data[i].message
        }
      })
      .catch((error) => {
        ElMessage.error(error)
        console.log('err', error)
      })
  }
}

const nextStep = () => {
  switch (step.value) {
    // submit MapService
    case 1:
      let variables = { ms: form }
      createHandle(variables).then((result) => {
        if (result.error) {
          console.log(result.error.message)
          ElMessage.error(result.error.message)
        } else {
          // ElMessage.success("更新成功！");
          emits('refreshEmit')
          console.log(result.data.addMapService.id)
          form.id = result.data.addMapService.id
          step.value++
        }
      })
      break
    case 2:
      step.value++
      // file queue progress

      break
  }
}

const cancelHandle = () => {
  emits('closeEmit')
}

const handleClose = (done: () => void) => {
  // 新建hooks回调父组件方法，解决props readonly问题
  // 同步visible 和父组件dialogVisible
  emits('closeEmit')
  done()
}

// 上传中状态
const isUploading = computed(() => {
  return filesList.value.some((file) => file.status === 'loading')
})

// 获取上传文件的状态
const lastFileData = computed(() => {
  return {
    loaded: filesList.value.some((file) => file.status !== 'loading')
  }
})
</script>
