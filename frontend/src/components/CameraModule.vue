<script setup lang="ts">
import { Camera } from 'lucide-vue-next'

const props = defineProps<{
  videoRef: any
  isProcessing: boolean
}>()

defineEmits(['shutter'])
</script>

<template>
  <div class="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700">
    <video 
      :ref="(el) => videoRef.value = el" 
      autoplay 
      playsinline
      muted
      class="w-full h-full object-cover"
    ></video>

    <div class="absolute bottom-6 left-0 right-0 flex justify-center">
      <button 
        @click="$emit('shutter')"
        :disabled="isProcessing"
        class="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
        :class="isProcessing ? 'bg-gray-500' : 'bg-white/20 backdrop-blur-md'"
      >
        <Camera v-if="!isProcessing" :size="32" class="text-white" />
        <div v-else class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </button>
    </div>
  </div>
</template>