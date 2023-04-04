<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import VueApexCharts from 'vue3-apexcharts';
import UprrService from '@/service/UprrService';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { useDateStore } from '../../stores/date';

const store = useDateStore();
const route = useRoute();

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const places = ref(null);
const selectedCity = ref({
    name : 'Урай'
});
places.value = [{ name: 'Урай' }, { name: 'Нягань' }];

const tit = ref(null);
const pred = ref(null);
const loading = ref(false);
// Скорость
const speedChartOptions = ref(null);
const speedChartData = ref(null);
const speed = ref(null);
const speedCats = ref(null);

const titleDate = ref(null);

const chartData = ref(null);

const uprrService = new UprrService();

const prrData = ref(null);

var now = new Date();


if (store.date[0] == store.date[1]) {
    tit.value = `Показатели средней скорости  на ${moment(store.date[0]).format('DD.MM.YYYY')}`;
} else {
    tit.value = `Показатели средней скорости  c ${moment(store.date[0]).format('DD.MM.YYYY')} по ${moment(store.date[1]).format('DD.MM.YYYY')}`;
}
pred.value = 'по каждому ТС';

uprrService.getSpeed(moment(store.date[0]).format('YYYY-MM-DD'), moment(store.date[1]).format('YYYY-MM-DD'), selectedCity.value.name).then((data) => (prrData.value = data.data));

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const changeDate = () => {
    let d = 0;
    let start = 0;
    let end = 0;
    let city = selectedCity.value.name;

    if (store.date[0] - store.date[1] == 0) {
        d = moment(store.date[0]).format('YYYY-MM-DD');
        tit.value = `Показатели средней скорости  на ${moment(store.date[0]).format('DD.MM.YYYY')}`;
        pred.value = 'по каждому ТС';
        uprrService.getSpeed(moment(d).format('YYYY-MM-DD'), moment(d).format('YYYY-MM-DD'), city).then((data) => (prrData.value = data.data));
    } else {
        start = moment(store.date[0]).format('YYYY-MM-DD');
        end = moment(store.date[1]).format('YYYY-MM-DD');
        if (store.date[1] != null) {
            uprrService.getSpeed(start, end, city).then((data) => (prrData.value = data.data));
            tit.value = `Показатели средней скорости c ${moment(store.date[0]).format('DD.MM.YYYY')} по ${moment(store.date[1]).format('DD.MM.YYYY')}`;
            pred.value = 'по дням из выбранного диапазона';
        }
    }
};

const listData = () => {
    let data = [];
    let cats = [];
    // console.log(prrData.value.barChart)
    prrData.value.barChart.forEach((el) => {
        // data.push(Math.round(el.GNO_number));
        data.push(el.work > 0 ? Math.round(el.mil / (el.work / 60)) : 0);

        cats.push(el.name + ' ');
    });

    speedCats.value = cats;
    speed.value = data;
};

const setChart = () => {
    speedChartData.value = [
        {
            name: 'Сек на трубу',
            data: speed.value
        }
    ];

    speedChartOptions.value = {
        chart: {
            height: 600,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true
        },
        stroke: {
            show: true,
            curve: 'smooth'
        },
        title: {
            text: tit.value,
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
        },
        xaxis: {
            categories: speedCats.value
        }
    };
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);
store.$subscribe(() => {
        changeDate();
        loading.value = true;
    },{detached: true}
);

watch(prrData, () => {
    listData();
    setChart();
    loading.value = true;
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col12 xl:col-12">
            <div class="card flex flex-row justify-content-center">
                <div class="flex flex-column align-items-start justify-content-center" style="margin-right: 2rem">
                    <label for="calend">Дата</label>
                    <Calendar id="calend" name="calend" v-model="store.date" :numberOfMonths="2" selectionMode="range" showIcon />
                </div>
                <div class="flex flex-column align-items-start justify-content-center"  style="margin-right: 2rem">
                    <label for="org">Список участков</label>
                    <Dropdown v-model="selectedCity" :options="places" optionLabel="name" placeholder="Выбрать город" class="w-full md:w-14rem" @change="changeDate()"/>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="loading">
            <div class="card flex flex-column justify-content-center">
                <div class="flex align-items-center justify-content-center">
                    <h2>Цех доставки НПО {{ selectedCity.name }}</h2>
                </div>
                <div class="flex align-items-center justify-content-center">
                    <h5>{{ tit }}</h5>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="loading">
            <div class="card flex flex-column align-items-center">
                <!-- <h5 class="text-left w-full">Показатели средней скорости  {{ tit }}</h5> -->
                <div style="width: 100%">
                    <div id="chart">
                        <apexchart type="line" height="600" :options="speedChartOptions" :series="speedChartData"></apexchart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
