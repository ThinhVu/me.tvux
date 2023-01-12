<template>
  <div class="r fc h-100 w-100">
    <bg/>
    <api/>
    <dock style="background: rgba(69,69,69,1)">
      <div class="w-100 h-100">
        <router-view #default="{ Component }">
          <component :is="Component"/>
        </router-view>
      </div>
    </dock>
  </div>
</template>
<script setup>
import Dock from '@/components/Dock';
import Bg from '@/components/Bg';
import Api from '@/components/UiLib/Api/Api';
</script>
