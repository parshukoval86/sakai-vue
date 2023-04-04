import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/:id',
                    name: 'graphs',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/seconds',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/Seconds.vue')
                },
                {
                    path: '/speed',
                    name: 'input',
                    component: () => import('@/views/uikit/Speed.vue')
                },
            ]
        },
        
    ]
});

export default router;
