<script setup lang="ts">
import { ref } from 'vue'
import { Camera, RefreshCw } from 'lucide-vue-next'
import axios from 'axios'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const capturedImage = ref<string | null>(null)

const isUploading = ref(false)
const uploadStatus = ref('')

// カメラ起動（背面カメラを優先する設定を追加）
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (err) {
    console.error("カメラの起動に失敗しました:", err)
  }
}

const uploadPhoto = async () => {
  if (!capturedImage.value) return
  
  isUploading.value = true
  uploadStatus.value = '師匠に伝送中...'

  try {
    const response = await axios.post('/photos', {
      image: capturedImage.value
    })
    
    console.log("保存成功:", response.data)
    uploadStatus.value = '送信完了！診断を開始します。'
    
    // ここで Step 4 (診断フェーズ) へ遷移
    // 例: router.push({ name: 'Result', params: { id: response.data.id } })
    
  } catch (err) {
    console.error("アップロード失敗:", err)
    uploadStatus.value = 'エラーが発生しました'
  } finally {
    isUploading.value = false
  }
}

// 写真撮影
const takePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const video = videoRef.value
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')

    if (context) {
      // ビデオの現在のフレームをCanvasに描画
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Base64形式で画像を取得（サーバー送信用のデータ）
      capturedImage.value = canvas.toDataURL('image/jpeg', 0.8) // 画質0.8で軽量化

      uploadPhoto()
    }
  }
}

</script>

<template>
  <div class="p-4 max-w-md mx-auto bg-slate-50 min-h-screen flex flex-col items-center space-y-6">
    <h1 class="text-xl font-bold text-slate-800">AI師匠</h1>
    
    <div class="relative bg-black w-full aspect-[3/4] rounded-2xl shadow-inner overflow-hidden border-4 border-white">
      <video 
        v-show="!capturedImage"
        ref="videoRef" 
        autoplay 
        playsinline 
        class="w-full h-full object-cover"
      ></video>
      
      <img v-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover" />
    </div>

    <div class="flex space-x-4">
      <button v-if="!capturedImage" @click="startCamera" class="p-4 bg-white rounded-full shadow-md text-blue-600">
        <RefreshCw />
      </button>

      <button 
        @click="capturedImage ? (capturedImage = null) : takePhoto()" 
        class="flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg active:scale-95 transition"
      >
        <span v-if="isUploading">送信中...</span>
        <template v-else>
          <Camera class="mr-2" />
          {{ capturedImage ? '撮り直す' : 'シャッター' }}
        </template>
      </button>
    </div>

    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>