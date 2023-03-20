<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    
    {
        label: 'Главная',
        items: [
            {label: 'Весь транспорт', icon: 'pi pi-fw pi-home', to: '/'},
            {label: 'Список автотранспорта', icon: 'pi pi-fw pi-home', to: '/TS'},
            {label: 'Список организаций', icon: 'pi pi-fw pi-home', to: '/ORG'},
            {label: 'Список типов транспортных средств', icon: 'pi pi-fw pi-home', to: '/Type'},
            {label: 'Список участков', icon: 'pi pi-fw pi-home', to: '/place'},


        ]
    },
    {
        label: 'Основные показатели',
        items: [
            {label: 'Секунды', icon: 'pi pi-fw pi-prime', to: '/icons'},
            {label: 'Скорость', icon: 'pi pi-fw pi-prime', to: '/icons'},
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-question',
                to: '/documentation'
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-search',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
    </ul>
</template>

<style lang="scss" scoped></style>
