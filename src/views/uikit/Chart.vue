<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import VueApexCharts from 'vue3-apexcharts';
import UprrService from '@/service/UprrService';
import moment from 'moment';

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');




// Секунды на трубу
const secChartOptions =  ref(null);
const planSecForGno = 73;
const colorsSec = ref(null);
const secChartData = ref(null);
const secForGno = ref(null);

// Рубли на трубу
const rubChartOptions =  ref(null);
const planRubForGno = 73;
const colorsRub= ref(null);
const rubChartData = ref(null);
const rubForGno = ref(null);

// Скорость
const speedChartOptions =  ref(null);
const planSpeed = 73;
const colorsSpeed= ref(null);
const speedChartData = ref(null);
const speed = ref(null);

const colors = ['#FF0000', '#FF0000']
const options= {};
const series= [44, 55, 41, 17, 15];


const date = ref(null);
const titleDate = ref(null);

const chartData = ref(null);

const uprrService = new UprrService();
var cars ;
uprrService.getCars().then(data => cars = data.data);
const prrData = ref(null);

var now = new Date(); 


uprrService.getData(moment(now).format('YYYY-MM-DD'),0,0).then(data => prrData.value = data.data);


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

    if (date.value[0]-date.value[1] == 0) {
        d = moment(date.value[0]).format('YYYY-MM-DD');
        uprrService.getData(moment(d).format('YYYY-MM-DD'),start,end).then(data => prrData.value = data.data);
    } else  {
        start = moment(date.value[0]).format('YYYY-MM-DD');
        end = moment(date.value[1]).format('YYYY-MM-DD');
        if (date.value[1] != null) {
            uprrService.getData(moment(d).format('YYYY-MM-DD'),start,end).then(data => prrData.value = data.data);
        }
        
    }

    
}

const listData = () => {
    chartData.value = {
        tmpforData : [],
        StatusInfo :[],
        GNOsum : 0,
        WorkTime : 0,
        Coast : 0,
        Mileage : 0,
        DriveTime : 0,
        PRRTime : 0,
        StayTime : 0,
        tmpforLabels : [],
    }

    prrData.value.forEach( (el) => {
        chartData.value.GNOsum +=  parseFloat(el.GNO_number);
        chartData.value.WorkTime +=  parseFloat(el.work_time);
        chartData.value.Coast += parseFloat(el.day_sum);
        chartData.value.Mileage += parseFloat(el.mileage);
        chartData.value.DriveTime += parseFloat(el.work_time - el.stay_prr_time - el.stay_mistakes_time);
        chartData.value.tmpforLabels.push(el.gar_number);
        chartData.value.tmpforData.push(Math.round((el.work_time)*60/(el.GNO_number)));
        chartData.value.PRRTime +=  parseFloat(el.stay_prr_time);
        chartData.value.StayTime +=  parseFloat(el.stay_mistakes_time);
        chartData.value.StatusInfo += el.status;
    });

    var SecForGNO = (chartData.value.WorkTime*60)/chartData.value.GNOsum;
    SecForGNO = Math.round(SecForGNO);

    var RubForGNO = Math.round(chartData.value.Coast)/chartData.value.GNOsum;
    RubForGNO = Math.round(RubForGNO);

    var Speed = Math.round(chartData.value.Mileage/(chartData.value.DriveTime/60));
    Speed = Math.round(Speed);

    var valuePRR = Math.round(chartData.value.PRRTime/60);
    var valueStay = Math.round(chartData.value.StayTime/60);
    var valueDrive = Math.round(chartData.value.DriveTime/60);

    var dataForPie = [];
    dataForPie.push(valueDrive);
    dataForPie.push(valuePRR);
    dataForPie.push(valueStay);
    
    speed.value = Speed;
    rubForGno.value = RubForGNO;
    secForGno.value = SecForGNO;
}


const getColor = (val, plan) => {
    if (val < plan) {
        return '#008000';
    } else {
        return '#FF0000';
    }
}

const setChart = () => {
    
    
    colorsSec.value = [
        '#737373',
        getColor(secForGno.value, planSecForGno) 
    ];
    colorsRub.value = [
        '#737373',
        getColor(rubForGno.value, planSecForGno) 
    ];
    colorsSpeed.value = [
        '#737373',
        getColor(speed.value, planSecForGno) 
    ];

    secChartData.value = [{
        name: "Секунд на трубу",
        data: [planSecForGno, secForGno.value]
    }];
    rubChartData.value = [{
        name: "Рублей на трубу",
        data: [planSecForGno, rubForGno.value]
    }];
    speedChartData.value = [{
        name: "Скорость",
        data: [planSecForGno, speed.value]
    }];
    
    secChartOptions.value = {
            chart: {
              height: 350,
              type: 'bar',
              events: {
                click: function(chart, w, e) {
                  // console.log(chart, w, e)
                }
              },
              
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
                },
            },
            legend: {
              show: true,
              position: 'top',
              fontSize: '20px',
            },
            yaxis: {
                min: 0,
              max: 200,
            },
            xaxis: {
              categories: [
                ['План'],
                ['Факт'],
                
              ],
              labels: {
                show: false,
                style: {
                  colors: colorsSec,
                  fontSize: '20px'
                }
              },
              
            }
          };
    rubChartOptions.value = {
            chart: {
              height: 350,
              type: 'bar',
              events: {
                click: function(chart, w, e) {
                  // console.log(chart, w, e)
                }
              },
              
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
                },
            },
            legend: {
              show: true,
              position: 'top',
              fontSize: '20px',
            },
            yaxis: {
                min: 0,
              max: 200,
            },
            xaxis: {
              categories: [
                ['План'],
                ['Факт'],
                
              ],
              labels: {
                show: false,
                style: {
                  colors: colorsRub,
                  fontSize: '20px'
                }
              },
              
            }
          };
    speedChartOptions.value = {
            chart: {
              height: 350,
              type: 'bar',
              events: {
                click: function(chart, w, e) {
                  // console.log(chart, w, e)
                }
              },
              
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
                },
            },
            legend: {
              show: true,
              position: 'top',
              fontSize: '20px',
            },
            yaxis: {
                min: 0,
              max: 200,
            },
            xaxis: {
              categories: [
                ['План'],
                ['Факт'],
                
              ],
              labels: {
                show: false,
                style: {
                  colors: colorsSpeed,
                  fontSize: '20px'
                }
              },
              
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
watch(date,
() => {
    changeDate()
});
watch(prrData,
() => {
    listData();
    setChart();
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-12">
            <div class="card flex flex-column justify-content-center  ">
                <div class="flex align-items-center justify-content-center">
                    <h2 >Цех доставки НПО</h2>
                </div>
                <div class="flex align-items-center justify-content-center">
                    <h5>Показатели работы всей спецтехники на </h5>
                </div>
                <div class="flex align-items-center justify-content-center">
                    <Calendar  v-model="date" :numberOfMonths="2" selectionMode="range"/>
                </div>
                
                
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Секунды на трубу на</h5>
                <div id="chart">
                    <apexchart type="bar" height="350" :options="secChartOptions" :series="secChartData"></apexchart>
                </div>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Рублей на трубу на</h5>
                <div id="chart">
                    <apexchart type="bar" height="350" :options="secChartOptions" :series="rubChartData"></apexchart>
                </div>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Скорость на</h5>
                <div id="chart">
                    <apexchart type="bar" height="350" :options="secChartOptions" :series="speedChartData"></apexchart>
                </div>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Произведённые работы спецтехникой в процентном соотношении</h5>
                <div>
                    <apexchart height="350" type="pie" :options="options" :series="series"></apexchart>
                </div>
            </div>
        </div>

        
        <div class="col-12 xl:col-12">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Polar Area Chart</h5>
                
            </div>
        </div>
        
                    
                
        
    </div>
</template>
