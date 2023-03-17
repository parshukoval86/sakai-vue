<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    
    {
        label: 'Главная',
        items: [
            {label: 'Весь транспорт', icon: 'pi pi-fw pi-home', to: '/1'},
            {label: 'Список автотранспорта', icon: 'pi pi-fw pi-home', to: '/2'},


        ]
    },
    {
        label: 'Список организаций', icon: 'pi pi-fw pi-sitemap',
        items: [
            {label: 'Частник', icon: 'pi pi-fw pi-id-card', to: '/formlayout'},
            {label: 'УУТТ', icon: 'pi pi-fw pi-check-square', to: '/input'},
            {label: "НПО", icon: "pi pi-fw pi-bookmark", to: "/floatlabel"},
            
        ]
    },
    {
        label: 'Список типов транспорта',
        items: [
            {label: 'Тягач', icon: 'pi pi-fw pi-eye', to: '/blocks'},
            {label: 'АПШ', icon: 'pi pi-fw pi-eye', to: '/blocks'},
            {label: 'АвтоКран', icon: 'pi pi-fw pi-eye', to: '/blocks'},
            
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
