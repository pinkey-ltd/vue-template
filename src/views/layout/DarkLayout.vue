<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog as="div" class="fixed inset-0 z-40 flex md:hidden" @close="sidebarOpen = false">
      <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
        enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
        leave-to="opacity-0">
        <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </TransitionChild>
      <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full"
        enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
        leave-to="-translate-x-full">
        <div class="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
          <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
            leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button type="button"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                @click="sidebarOpen = false">
                <span class="sr-only">Close sidebar</span>
                <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </TransitionChild>
          <div class="flex-shrink-0 px-4 flex items-center">
            <img class="h-8 w-auto" :src="logo" alt="Logo" />
          </div>
          <div class="mt-5 flex-1 h-0 overflow-y-auto">
            <nav class="px-2 space-y-1">
              <a v-for="item in menus" :key="item.ID!" :href="item.path" :class="[
                  item.current
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group rounded-md py-2 px-2 flex items-center text-base font-medium',
                ]">
                <component :is="item.icon" :class="[
                    item.current
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-4 flex-shrink-0 h-6 w-6',
                  ]" aria-hidden="true" />
                {{ item.name }}
              </a>
            </nav>
          </div>
        </div>
      </TransitionChild>
      <div class="flex-shrink-0 w-14">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Static sidebar for desktop -->
  <div class="hidden 2xl:flex 2xl:w-64 2xl:flex-col 2xl:fixed 2xl:inset-y-0 bg-black">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="border-r border-gray-200 flex flex-col flex-grow bg-white overflow-y-auto">
      <div class="flex-shrink-0 px-4 flex items-center">
        <img class="mx-auto h-32 w-auto" :src="logo" alt="Logo" />
      </div>
      <div class="flex-grow mt-5 flex flex-col">
        <nav class="flex-1 px-2 pb-4 space-y-1">
          <a v-for="item in menus" :key="item.ID!" :href="item.path" @click="setMenuState(item.ID)" :class="[
              item.current
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group rounded-md py-2 px-2 flex items-center text-sm font-medium',
            ]">
            <component :is="item.icon" v-if="item.icon" :class="[
                item.current
                  ? 'text-gray-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 flex-shrink-0 h-6 w-6',
              ]" aria-hidden="true" />
            {{ item.title }}
          </a>
        </nav>
      </div>
      <div class="flex-shrink-0 block w-full">
        <a href="#/help"
          class="group border-l-4 border-transparent py-2 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          <QuestionMarkCircleIcon class="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" aria-hidden="true" /> 帮助
        </a>
        <a href="#/logout"
          class="group border-l-4 border-transparent py-2 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          <CogIcon class="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" aria-hidden="true" /> 退出登录
        </a>
      </div>
    </div>
  </div>

  <div class="md:pl-2 h-full">
    <div class="h-full ml-64 mr-auto flex flex-col 2xl:px-8 xl:px-0">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import logo from "../../assets/logo.svg";
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon, QuestionMarkCircleIcon, CogIcon } from "@heroicons/vue/outline";
// Menu
type Menu = {
  ID: string | null; // uuid
  name: string; // 菜单显示
  order: number;
  path: string;
  icon: string;
  type: string;
  title: string; // 页面内显示
  current: boolean;
  children?: Menu[];
};
const sidebarOpen = ref(false);
const menus = reactive<Menu[]>([
  { ID: "1", name: "home", order: 1, path: "/home", icon: "home", type: "view", title: "主页", current: true },
  { ID: "2", name: "upload", order: 1, path: "/upload", icon: "upload", type: "view", title: "批量上传", current: false },
])
const setMenuState = (id: string | null) => {
  for (let menu of menus) {
    if (menu.ID == id) {
      menu.current = true
    } else {
      menu.current = false
    }
  }
}
</script>