<template>
  <div class="r fc h-100 w-100">
    <bg/>
    <api/>
    <auth-dialog v-if="authDialogVisible" @close="hideAuthDialog"/>
    <dock style="background: linear-gradient(90deg,#303741,#06070c);">
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
import AuthDialog from '@/components/AuthDialog';
import {authDialogVisible, hideAuthDialog} from '@/appState';
</script>
