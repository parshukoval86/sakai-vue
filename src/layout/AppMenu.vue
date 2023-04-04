<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Главная',
        items: [
            { label: 'Весь транспорт', icon: 'pi pi-fw pi-list', to: '/' },
            { label: 'Список автотранспорта', icon: 'pi pi-fw pi-car', to: '/TS' },
            { label: 'Список организаций', icon: 'pi pi-fw pi-building', to: '/ORG' },
            { label: 'Список типов транспортных средств', icon: 'pi pi-fw pi-truck', to: '/Type' },
            //{ label: 'Список участков', icon: 'pi pi-fw pi-home', to: '/place' }
        ]
    },
    {
        label: 'Основные показатели',
        items: [
            { label: 'Секунды', icon: 'pi pi-fw pi-clock', to: '/seconds' },
            { label: 'Скорость', icon: 'pi pi-fw pi-forward', to: '/speed' }
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
