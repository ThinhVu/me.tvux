<template>
  <div class="w-100 h-100"
       :class="layout.container.klass"
       :style="layout.container.style">

    <!-- Category -->
    <div :class="layout.category.klass"
         :style="layout.category.style">
      <div v-if="isOwner"
           class="ta-l px-2 py-1 fw-6 clickable"
           style="min-width: 150px; color: #0066bf" @click="createCategory">New Category</div>
      <router-link v-for="cate in categories" :key="cate._id"
                   :to="`/newfeed?uid=${uid}&cid=${cate._id}&name=${kebabCase(cate.name)}`"
                   style="flex-shrink: 0; text-decoration: none"
                   class="ta-l px-2 py-1 fw-6 clickable"
                   :style="sltCategory === cate._id ? 'color: #050505; background-color: #fff; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.2)' : 'color: #050505'">
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
      klass: 'fr ai-c fg-3 px-2',
      style: ''
    },
    category: {
      klass: 'h-100 f2 fc fg-1 pt-2 px-1 ovf-y-s hide-scroll-bar',
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
      klass: 'px-2',
      style: 'display: grid; grid-gap: 5px; grid-template-rows: 36px 0px 1fr; grid-template-areas: \'category\' \'thread\' \'post\''
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
      style: 'height: 0px; grid-area: thread'
    }
  },
  small: {
    container: {
      klass: '',
      style: 'display: grid; grid-gap: 2px; grid-template-rows: 36px 0px 1fr; grid-template-areas: \'category\' \'thread\' \'post\''
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
      style: 'height: 0px; grid-area: thread'
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
