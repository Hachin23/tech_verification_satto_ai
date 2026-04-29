import { ref, type Ref } from 'vue'

export function useCamera(refs: {
  video: Ref<HTMLVideoElement | null>, 
  canvas: Ref<HTMLCanvasElement | null>  
}) {
  const stream = ref<MediaStream | null>(null)
  
  const facingMode = ref<'environment' | 'user'>('environment') // カメラの向き
  const isFlashOn = ref(false) // フラッシュ状態
  const zoomLevel = ref(1)

  const startCamera = async () => {
    // 既存のストリームがあれば停止してから再開
    stopCamera()
    try {
      const constraints = {
        video: { 
          facingMode: facingMode.value,
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      stream.value = mediaStream
      if (refs.video.value) {
        console.log("Video element found, srcObject assigned.")
        refs.video.value.srcObject = mediaStream
      } else {
        setTimeout(() => {
          if (refs.video.value) refs.video.value.srcObject = mediaStream
        }, 100)
      }
    } catch (err) {
      console.error("カメラ起動失敗:", err)
    }
  }

  // カメラ切り替え
  const toggleFacingMode = async () => {
    facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
    await startCamera()
  }

  // フラッシュ（ライト）制御
  const toggleFlash = async () => {
    if (!stream.value) return
    const track = stream.value.getVideoTracks()[0]
    const capabilities = track.getCapabilities() as any

    if (capabilities.torch) {
      isFlashOn.value = !isFlashOn.value
      await track.applyConstraints({
        advanced: [{ torch: isFlashOn.value }] as any
      })
    } else {
      alert("このデバイスはフラッシュ制御に対応していません")
    }
  }

  
  // ズーム制御
  const setZoom = async (level: number) => {
    if (!stream.value) return
    const track = stream.value.getVideoTracks()[0]
    const capabilities = track.getCapabilities() as any

    // デバイスがズームに対応しているかチェック
    if (capabilities.zoom) {
      zoomLevel.value = Math.max(capabilities.zoom.min, Math.min(level, capabilities.zoom.max))
      await track.applyConstraints({ advanced: [{ zoom: zoomLevel.value }] as any })
    }
  }

  const capture = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!refs.video.value || !refs.canvas.value) return resolve(null)
      const canvas = refs.canvas.value
      const video = refs.video.value
      if (!video || !canvas) {
        console.warn("Camera elements not found")
        return resolve(null)
      }
      
      const context = canvas.getContext('2d')
      if (!context) return resolve(null)

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
    })
  }
  
  // 画面を離れる時にカメラを止める用
  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
  }

  return { 
    facingMode, isFlashOn, zoomLevel, startCamera, stopCamera, toggleFacingMode, toggleFlash, setZoom, capture 
  }
}