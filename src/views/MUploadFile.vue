<template>
  <main class="flex-1">
    <div class="py-2">
      <div class="px-4 sm:px-6 md:px-0">
        <h1 class="text-2xl font-semibold text-gray-900">Upload</h1>
      </div>
      <div class="px-4 sm:px-6 md:px-0">
        <!-- Replace with your content -->
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
        <!-- progress dialog -->
        <el-dialog v-model="isUploading" title="Warning" width="62%" center>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress" class="mx-4 my-8" />
        </el-dialog>
        <!-- /End replace -->
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// API URI
const muploadUri = 'http://localhost:8080/mupload/test'

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
      .post(muploadUri, formData, {
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
