<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

import UprrService from '@/service/UprrService';
import moment from 'moment';
import { useRoute } from 'vue-router';
import html2pdf from "html2pdf.js";
import print from 'vue3-print-nb';
import { jsPDF } from "jspdf";

const route = useRoute();

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');
const uprrService = new UprrService();
const changePlan = (date) => {
    let plans = uprrService.getPlan(date, selectedCity.value.name);
    

    planSec.value = plans.planSec;
    planSpeed.value = plans.planSpeed;
    planRub.value = plans.planRub;


    
};
const autos = ref(null);
const selAuto = ref(null);
const selectedCity = ref({
    name : 'Урай'
});
const places = ref(null);
const selPlace = ref(null);
const placeTit = ref(null);

const orgs = ref(null);
const selOrg = ref(null);

const types = ref(null);
const selType = ref(null);

// Секунды на трубу
const secChartOptions = ref(null);
const planSecForGno = 73;
const colorsSec = ref(null);
const secChartData = ref(null);
const secForGno = ref(null);

const tit = ref(null);
const pred = ref(null);

// Рубли на трубу
const rubChartOptions = ref(null);
const colorsRub = ref(null);
const rubChartData = ref(null);
const rubForGno = ref(null);
const loading = ref(false);

// Скорость
const speedChartOptions = ref(null);
const colorsSpeed = ref(null);
const speedChartData = ref(null);
const speed = ref(null);

//Планы
const planSec = ref(null);
const planSpeed = ref(null);
const planRub = ref(null);

const barData = ref(null);
const barOpt = ref(null);

const colors = ['#FF0000', '#FF0000'];
const options = {
    // plotOptions : {
    //   pie: {
    //     customScale: 0.7
    //   }
    // },
    labels: ['Переезды', 'ПРР', 'Ожидание'],
    colors: ['#3CBA9F', '#3E95CD', '#C45850'],
    legend: {
        position: 'top',
        fontSize: '20px'
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '20px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 200,
            colors: ['#000']
        },
        background: {
            enabled: false
        },
        offsetX: 0,
        offsetY: 0,
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            return `${w.config.series[seriesIndex]} (${val.toFixed(2)}%)`;
        }
    }
};
const series = ref(null);

const date = ref(null);
const titleDate = ref(null);

const chartData = ref(null);


var cars;
uprrService.getCars().then((data) => (cars = data.data));
const prrData = ref(null);

var now = new Date();

date.value = [now, now];
changePlan(date.value[0]);
tit.value = `на ${moment(now).format('DD.MM.YYYY')}`;
pred.value = 'по каждому ТС';
let prop = {
    val: '',
    id: 'null'
};
placeTit.value = '';
places.value = [{ name: 'Урай' }, { name: 'Нягань' }];
uprrService.getData(moment(now).format('YYYY-MM-DD'), 0, 0, prop).then((data) => (prrData.value = data.data));

uprrService.getCars().then((data) => (autos.value = data.data));

orgs.value = [{ label: 'Частник' }, { label: 'УУТТ' }, { label: 'НПО' }];
types.value = [{ label: 'Тягач' }, { label: 'АПШ' }, { label: 'АвтоКран' }];
const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};


const changeDate = (prop = route.params.id) => {
    let d = 0;
    let start = 0;
    let end = 0;

    let props = {
        val: prop,
        id: route.params.id,
        city: selectedCity.value.name
    };

    if (props.val == props.id) {
        switch (prop) {
            case 'TS':
                props.val = selAuto.value.gar_number;
                break;

            case 'ORG':
                props.val = selOrg.value.label;
                break;

            case 'Type':
                props.val = selType.value.label;
                break;

            case 'place':
                props.val = selPlace.value;
                break;

            default:
                props.val = '';
                break;
        }
    }
    console.log(prop);
    if (date.value[0] - date.value[1] == 0) {
        d = moment(date.value[0]).format('YYYY-MM-DD');
        tit.value = `на ${moment(date.value[0]).format('DD.MM.YYYY')}`;
        pred.value = 'по каждому ТС';
        uprrService.getData(moment(d).format('YYYY-MM-DD'), start, end, props).then((data) => (prrData.value = data.data));
    } else {
        start = moment(date.value[0]).format('YYYY-MM-DD');
        end = moment(date.value[1]).format('YYYY-MM-DD');
        if (date.value[1] != null) {
            uprrService.getData(moment(d).format('YYYY-MM-DD'), start, end, props).then((data) => (prrData.value = data.data));
            tit.value = `c ${moment(date.value[0]).format('DD.MM.YYYY')} по ${moment(date.value[1]).format('DD.MM.YYYY')}`;
            pred.value = 'по дням из выбранного диапазона';
        }
    }
    changePlan(date.value[0]);
};

const listData = () => {
    var SecForGNO = (prrData.value.sum.WorkTime * 60) / prrData.value.sum.GNOsum;
    SecForGNO = Math.round(SecForGNO);

    var RubForGNO = Math.round(prrData.value.sum.Coast) / prrData.value.sum.GNOsum;
    RubForGNO = Math.round(RubForGNO);

    var Speed = Math.round(prrData.value.sum.Mileage / (prrData.value.sum.DriveTime / 60));
    Speed = Math.round(Speed);

    var valuePRR = Math.round(prrData.value.sum.PRRTime / 60);
    var valueStay = Math.round(prrData.value.sum.StayTime / 60);
    var valueDrive = Math.round(prrData.value.sum.DriveTime / 60);

    var dataForPie = [];
    dataForPie.push(valueDrive);
    dataForPie.push(valuePRR);
    dataForPie.push(valueStay);
    let data = [];
    let cats = [];
    // console.log(prrData.value.barChart)
    prrData.value.barChart.forEach((el) => {
        // data.push(Math.round(el.GNO_number));
        data.push(el.GNO > 0 ? Math.round((el.Seconds * 60) / el.GNO) : 0);
        console.log(el.name);
        cats.push(el.name + ' ');
    });

    barData.value = [
        {
            name: 'Секунды на трубу',
            data: data
        }
    ];

    barOpt.value = {
        chart: {
            height: 500,
            type: 'bar'
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '50%',
                dataLabels: {
                    position: 'top'
                }
            }
        },

        dataLabels: {
            enabled: true,
            offsetY: -35,
            style: {
                colors: ['#333'],
                fontSize: '26px'
            }
        },
        stroke: {
            width: 2
        },
        xaxis: {
            labels: {
                rotate: -45
            },
            categories: cats
        }
    };

    speed.value = Speed;
    rubForGno.value = RubForGNO;
    secForGno.value = SecForGNO;
    series.value = dataForPie;
    loading.value = true;
};

const getColor = (val, plan) => {
    if (val < plan) {
        return '#008000';
    } else {
        return '#FF0000';
    }
};
const getSColor = (val, plan) => {
    console.log (`${val} > ${plan} its a ` + (val > plan));
    if (val >= plan) {
        return '#008000';
    } else {
        return '#FF0000';
    }
};

const setChart = () => {
    colorsSec.value = ['#737373', getColor(secForGno.value, planSec.value)];
    colorsRub.value = ['#737373', getColor(rubForGno.value, planRub.value)];
    colorsSpeed.value = ['#737373', getSColor(speed.value, planSpeed.value)];

    secChartData.value = [
        {
            name: 'Секунд на трубу',
            data: [planSec.value, secForGno.value]
        }
    ];
    rubChartData.value = [
        {
            name: 'Рублей на трубу',
            data: [planRub.value, rubForGno.value]
        }
    ];
    speedChartData.value = [
        {
            name: 'Скорость',
            data: [planSpeed.value, speed.value]
        }
    ];

    secChartOptions.value = {
        chart: {
            height: 350,
            type: 'bar',
            events: {
                click: function (chart, w, e) {
                    // console.log(chart, w, e)
                }
            }
        },
        colors: colorsSec,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },

        dataLabels: {
            enabled: true,
            offsetY: -35,
            style: {
                colors: ['#333'],
                fontSize: '26px'
            }
        },
        legend: {
            show: true,
            position: 'top',
            fontSize: '20px'
        },
        yaxis: {
            min: 0,
            max: 200
        },
        xaxis: {
            categories: [['План'], ['Факт']],
            labels: {
                show: false,
                style: {
                    colors: colorsSec,
                    fontSize: '20px'
                }
            }
        }
    };
    rubChartOptions.value = {
        chart: {
            height: 350,
            type: 'bar',
            events: {
                click: function (chart, w, e) {
                    // console.log(chart, w, e)
                }
            }
        },
        colors: colorsRub,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },

        dataLabels: {
            enabled: true,
            offsetY: -35,
            style: {
                colors: ['#333'],
                fontSize: '26px'
            }
        },
        legend: {
            show: true,
            position: 'top',
            fontSize: '20px'
        },
        yaxis: {
            min: 0,
            max: 200
        },
        xaxis: {
            categories: [['План'], ['Факт']],
            labels: {
                show: false,
                style: {
                    colors: colorsRub,
                    fontSize: '20px'
                }
            }
        }
    };
    speedChartOptions.value = {
        chart: {
            height: 350,
            type: 'bar',
            events: {
                click: function (chart, w, e) {
                    // console.log(chart, w, e)
                }
            }
        },
        colors: colorsSpeed,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },

        dataLabels: {
            enabled: true,
            offsetY: -35,
            style: {
                colors: ['#333'],
                fontSize: '26px'
            }
        },
        legend: {
            show: true,
            position: 'top',
            fontSize: '20px'
        },
        yaxis: {
            min: 0,
            max: 200
        },
        xaxis: {
            categories: [['План'], ['Факт']],
            labels: {
                show: false,
                style: {
                    colors: colorsSpeed,
                    fontSize: '20px'
                }
            }
        }
    };
};

const changeId = () => {
    selAuto.value = null;
    selOrg.value = null;
    selType.value = null;
    selPlace.value = null;
    loading.value = false;
    if (route.params.id == undefined) {
        changeDate();
    }
    console.log(route.params.id);
};

const exportPDF = () => {
    /* html2pdf(document.getElementById("charts"), {
        margin: 1,
        filename: "i-was-html.pdf",
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 },
        jsPDF:        {  format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: 'avoid-all', before: ['#page1','#page2'] }
    }); */

    
};

watch(selPlace, () => {
    if (selPlace.value != null) {
        console.log(selPlace.value);
        placeTit.value = '';
        let arr = [];
        selPlace.value.forEach((el) => {
            arr.push(el.name);
        });
        placeTit.value = arr.join(', ');
    }
});
watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);
watch(date, () => {
    changeDate();
    
});
watch(
    () => route.params,
    () => {
        changeId();
        // TODO
    }
);
watch(prrData, () => {
    listData();
    setChart();
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col12 xl:col-12">
            <div class="card flex flex-row justify-content-center">
                <div class="flex flex-column align-items-start justify-content-center" style="margin-right: 2rem">
                    <label for="calend">Дата</label>
                    <Calendar id="calend" name="calend" v-model="date" :numberOfMonths="2" selectionMode="range" showIcon />
                </div>
                <div class="flex flex-column align-items-start justify-content-center" v-if="route.params.id == 'TS'" style="margin-right: 2rem">
                    <!-- v-if="route.params.id == 'TC'" -->
                    <label for="calend">Список транспортных средств</label>
                    <Dropdown v-model="selAuto" :options="autos" optionLabel="gar_number" placeholder="Выбрать ТС" class="w-full md:w-14rem" @change="changeDate((prop = selAuto.gar_number))">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-items-center">
                                <div>{{ slotProps.value.gar_number }} {{ slotProps.value.type }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.option.gar_number }} {{ slotProps.option.type }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div class="flex flex-column align-items-start justify-content-center" v-if="route.params.id == 'ORG'" style="margin-right: 2rem">
                    <label for="org">Список организаций</label>
                    <Dropdown v-model="selOrg" :options="orgs" optionLabel="label" placeholder="Выбрать организацию" class="w-full md:w-14rem" @change="changeDate(selOrg.label)" />
                </div>
                <div class="flex flex-column align-items-start justify-content-center" v-if="route.params.id == 'Type'" style="margin-right: 2rem">
                    <label for="org">Список типов Транспортных средств</label>
                    <Dropdown v-model="selType" :options="types" optionLabel="label" placeholder="Выбрать тип" class="w-full md:w-14rem" @change="changeDate(selType.label)" />
                </div>
                
                <div class="flex flex-column align-items-start justify-content-center" v-if="route.params.id == 'place'" style="margin-right: 2rem">
                    <label for="org">Список участков</label>
                    <MultiSelect v-model="selPlace" display="chip" :options="places" optionLabel="name" placeholder="Выбрать участок" :maxSelectedLabels="4" class="w-full md:w-31rem" @change="changeDate(selPlace)"/>
                </div>
                <div class="flex flex-column align-items-start justify-content-center"  style="margin-right: 2rem">
                    <label for="org">Список участков</label>
                    <Dropdown v-model="selectedCity" :options="places" optionLabel="name" placeholder="Select a City" class="w-full md:w-14rem" @change="changeDate()"/>
                </div>
                <!-- <div class="flex flex-column align-items-start justify-content-center" style="margin-right: 2rem">
                    <label for="calend">Дата</label>
                    <Button label="Сохранить в PDF" v-print/>
                </div> -->
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="route.params.id == 'TS' && selAuto == null">
            <div class="card flex flex-column justify-content-center">
                <h2>Необходимо выбрать транспортное средство</h2>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="route.params.id == 'ORG' && selOrg == null">
            <div class="card flex flex-column justify-content-center">
                <h2>Необходимо выбрать Организацию</h2>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="route.params.id == 'Type' && selType == null">
            <div class="card flex flex-column justify-content-center">
                <h2>Необходимо выбрать тип транспортного средства</h2>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="route.params.id == 'place' && selPlace == null">
            <div class="card flex flex-column justify-content-center">
                <h2>Необходимо выбрать хотя бы один участок</h2>
            </div>
        </div>
        <div class="col-12 xl:col-12" v-if="route.params.id == 'TS' && selAuto != null && prrData.sum.DriveTime == 0">
            <div class="card flex flex-column justify-content-center">
                <h2>{{ selAuto.gar_number }} {{ selAuto.type }} не работал в указанный период</h2>
            </div>
        </div>
        <div id="charts" class="col-12 xl:col-12 grid">
            <div class="col-12 xl:col-12" v-if="loading">
                <div class="card flex flex-column justify-content-center">
                    <div class="flex align-items-center justify-content-center">
                        <h2>Цех доставки НПО {{ selectedCity.name }}</h2>
                    </div>
                    <div class="flex align-items-center justify-content-center">
                        <h5 v-if="route.params.id == 'TS' && selAuto != null">{{ selAuto.gar_number }} {{ selAuto.type }}</h5>
                        <h5 v-if="route.params.id == 'ORG' && selOrg != null">Показатели работы спецтехники {{ selOrg.label }} {{ tit }}</h5>
                        <h5 v-if="route.params.id == 'Type' && selType != null">Показатели работы спецтехники типа {{ selType.label }} {{ tit }}</h5>
                        <h5 v-if="route.params.id == 'place' && selPlace != null">Показатели работы спецтехники {{ placeTit }} {{ tit }}</h5>
                        <h5 v-if="route.params.id == undefined">Показатели работы всей спецтехники {{ tit }}</h5>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6" v-if="loading">
                <div class="card">
                    <h5>Секунды на трубу {{ tit }}</h5>
                    <div id="chart">
                        <apexchart type="bar" height="350" :options="secChartOptions" :series="secChartData"></apexchart>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-6" v-if="loading">
                <div class="card">
                    <h5>Рублей на трубу {{ tit }}</h5>
                    <div id="chart">
                        <apexchart type="bar" height="350" :options="rubChartOptions" :series="rubChartData"></apexchart>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-6" id="page1" v-if="loading">
                <div class="card">
                    <h5>Скорость {{ tit }}</h5>
                    <div id="chart">
                        <apexchart type="bar" height="350" :options="speedChartOptions" :series="speedChartData"></apexchart>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-6" v-if="loading">
                <div class="card">
                    <h5>Произведённые работы спецтехникой в процентном соотношении</h5>
                    <div>
                        <apexchart height="350" type="pie" :options="options" :series="series"></apexchart>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-12" id="page2" v-if="loading">
                <div class="card flex flex-column align-items-center">
                    <h5 class="text-left w-full">Показатели секунд на трубу {{ pred }} {{ tit }}</h5>
                    <div style="width: 100%">
                        <apexchart type="bar" height="500" :options="barOpt" :series="barData"></apexchart>
                    </div>
                </div>
            </div>
    </div>
    </div>
</template>
