<template>
  <div class="w-100 h-100"
       :class="layout.container.klass"
       :style="layout.container.style">
    <!-- Category -->
    <div :class="layout.category.klass"
         :style="layout.category.style">
      <div v-if="isOwner"
           class="ta-l px-2 py-1 fw-6 bc-gray-1 c-gray-9 clickable"
           style="min-width: 150px" @click="createCategory">New Category</div>
      <router-link v-for="cate in categories" :key="cate._id"
                   :to="`/newfeed?uid=${uid}&cid=${cate._id}&name=${kebabCase(cate.name)}`"
                   style="flex-shrink: 0"
                   class="ta-l px-2 py-1 fw-6 clickable"
                   :class="sltCategory === cate._id ? 'bc-gray-1 c-gray-9' : 'c-gray-0'">
        {{cate.name}}
      </router-link>
    </div>

    <!-- Post -->
    <div :class="layout.post.klass">
      <slot/>
    </div>

    <!-- Extra section -->
    <div :class="layout.thread.klass" :style="layout.thread.style">

    </div>
  </div>
</template>
<script setup>
import {kebabCase} from 'lodash';
import {onBeforeMount, ref} from 'vue';
import {categoryAPI} from '@/logic/api';
import dialog from '@/components/UiLib/Api/dialog';
import NewCategoryDialog from './NewCategoryDialog';
import {throttle} from 'lodash';
import useFeed from '@/components/SubPage/useFeed';

const {uid, categories, sltCategory, isOwner} = useFeed()

const adjustLayout = throttle(() => {
  if (window.innerWidth < 512)
    layout.value = layouts.small;
  else if (window.innerWidth < 1024)
    layout.value = layouts.medium;
  else
    layout.value = layouts.large;
    }, 500)
window.onresize = adjustLayout;
onBeforeMount(adjustLayout);

const layouts = {
  large: {
    container: {
      klass: 'fr ai-c fg-3 py-2 px-2',
      style: ''
    },
    category: {
      klass: 'h-100 f2 fc fg-1',
      style: 'max-width: 240px'
    },
    post: {
      klass: 'h-100 f4 ovf-y-s hide-scroll-bar',
      style: ''
    },
    thread: {
      klass: 'h-100 f2 fc fg-1',
      style: 'max-width: 240px'
    }
  },
  medium: {
    container: {
      klass: ' py-2 px-2',
      style: 'display: grid; grid-gap: 10px; grid-template-rows: 36px 36px 1fr; grid-template-areas: \'category\' \'thread\' \'post\''
    },
    category: {
      klass: 'w-100 fr fg-1 ovf-x-s hide-scroll-bar',
      style: 'height: 36px; grid-area: category'
    },
    post: {
      klass: 'h-100 f4 ovf-y-s hide-scroll-bar',
      style: 'grid-area: post'
    },
    thread: {
      klass: 'w-100 fr fg-1 ovf-x-s hide-scroll-bar',
      style: 'height: 36px; grid-area: thread'
    }
  },
  small: {
    container: {
      klass: '',
      style: 'display: grid; grid-gap: 10px; grid-template-rows: 36px 36px 1fr; grid-template-areas: \'category\' \'thread\' \'post\''
    },
    category: {
      klass: 'w-100 fr fg-1 ovf-x-s hide-scroll-bar',
      style: 'height: 36px; grid-area: category'
    },
    post: {
      klass: 'h-100 f4 ovf-y-s hide-scroll-bar',
      style: 'grid-area: post'
    },
    thread: {
      klass: 'w-100 fr fg-1 ovf-x-s hide-scroll-bar',
      style: 'height: 36px; grid-area: thread'
    }
  }
}
const layout = ref(layouts.small)

const createCategory = async () => {
  const payload = await dialog.show(NewCategoryDialog)
  if (!payload) {
    return
  }
  const newCate = await categoryAPI.create(payload)
  if (newCate) {
    categories.value.push(newCate)
  }
}
</script>
