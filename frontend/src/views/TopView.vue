<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
    <h1 class="text-4xl font-black italic text-yellow-400 mb-2">SATTO PHOTO AI</h1>
    <p class="text-slate-400 mb-12">その場でサッと、プロの視点を。</p>

    <router-link 
      to="/camera" 
      class="w-full max-w-xs bg-yellow-400 text-slate-900 py-4 rounded-full font-bold text-xl shadow-lg active:scale-95 transition-transform"
    >
      撮影を始める
    </router-link>
  </div>
</template>