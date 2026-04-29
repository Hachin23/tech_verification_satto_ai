<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraModule from '@/components/CameraModule.vue'
import { useCamera } from '@/composables/useCamera'
import { createThumbnail } from '@/utils/imageUtils';
import { db, type PhotoRecord } from '@/db/db'

const router = useRouter()

const cameraRefs = {
  video: ref<HTMLVideoElement | null>(null),
  canvas: ref<HTMLCanvasElement | null>(null)
}

const { 
  isFlashOn, startCamera, stopCamera, toggleFacingMode, toggleFlash, capture 
} = useCamera(cameraRefs)

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})

const isProcessing = ref(false) // 処理中フラグを定義

const handleCapture = async () => {
  try {
    isProcessing.value = true // 処理開始
    const capturedBlob = await capture()
    
    if (capturedBlob) {
      console.log("📸 撮影成功:", capturedBlob)

      try {
        // 2. 一覧画面用のサムネイルを生成 (軽量化のため)
        // ※ canvasなどを使ってリサイズする関数を別途用意
        const thumbBlob = await createThumbnail(capturedBlob, 300);

        // 3. 保存用データの構築
        const now = Date.now();
        const newRecord: PhotoRecord = {
          beforeImage: capturedBlob,
          afterImage: null, // 取り直し前なので初期値はnull
          thumbnailImage: thumbBlob,
          
          // AI診断待ちの状態
          advice: "診断中...",
          tips: null,
          scores: null,
          resultRank: null,
          
          isFavorite: false,
          syncStatus: 0, // 0: 未同期
          createdAt: now,
          updatedAt: now
        };

        // 4. IndexedDB へ追加
        const newId = await db.photos.add(newRecord);
        
        console.log(`保存成功! ID: ${newId}`);
        
        // 5. 診断画面へ遷移、またはAI診断ロジックをキック
        // startAIDiagnosis(newId);

      } catch (error) {
        console.error("保存失敗:", error);
      }
    }
  } catch(error) {
    console.error("撮影失敗:", error)
  } finally {
    isProcessing.value = false // 処理終了
  }
}
</script>

<template>
  <div class="flex flex-col h-screen bg-black text-white p-4">
    <header class="flex justify-between items-center py-2">
      <button @click="router.back()">✕</button>
      <button @click="toggleFlash" :class="{ 'text-yellow-400': isFlashOn }">
        {{ isFlashOn ? '⚡️ ON' : '⚡️ OFF' }}
      </button>
      <button @click="toggleFacingMode">🔄 切替</button>
    </header>

    <main class="flex-1">
      <CameraModule
        :video-ref="cameraRefs.video" 
        :is-processing="isProcessing"
        @shutter="handleCapture" />
    </main>

    <canvas :ref="(el) => cameraRefs.canvas.value = el as HTMLCanvasElement" class="hidden"></canvas>
  </div>
</template>