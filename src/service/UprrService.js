import axios, {isCancel, AxiosError} from 'axios';

export default class UprrService {
    // getCountries() {
    //     return fetch(contextPath + 'demo/data/countries.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }
    

    //Подгрузка списка автомобилей
    async getCars() {
        try {
            const res = await axios.get('http://10.10.10.19/npo-service/Cars.php')
            return res;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    //Подгрузка списка подрядчиков
    async getOuts() {
        try {
            const res = await axios.get('http://10.10.10.19/npo-service/outsourcers.php')
            return res;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    //Подгрузка списка типов ТС
    async getType() {
        try {
            const res = await axios.get('http://10.10.10.19/npo-service/type.php')
            return res;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    //Подгрузка списка типов ТС
    // async getType() {
    //     try {
    //         const res = await axios.get('http://10.10.10.19/npo-service/type.php')
    //         return res;
    //     } catch (error) {
    //         console.log(error)
    //         return error;
    //     }
    // }
    //Подгрузка данных для диаграмм
    async getData(newDate,startDate,endDate, props) {

        if(props.id == 'place') {
            let url = 'http://10.10.10.19/npo-service/placeData.php';
            try {
                const res = axios.post(url, {
                    date: newDate,
                    start: startDate,
                    end: endDate,
                    props: props
                });
                console.log(res)
                return res;
            } catch (error) {
                console.log(error);
                return error;
            }
        } else {
            console.log(props.val)
            let url = `http://10.10.10.19/npo-service/BarData.php?date=${newDate}&start=${startDate}&end=${endDate}&${props.id}=${props.val}&city=${props.city}`;
            try {
                const res = await axios.get(url)
                console.log(url);
                return res;
            } catch (error) {
                console.log(error)
                return error;
            }
        }
        
    }

    async getSeconds(startDate, endDate, city) {
        let url = `http://10.10.10.19/npo-service/secondsChart.php?start=${startDate}&end=${endDate}&city=${city}`;
        try {
            const res = await axios.get(url)
            console.log(url);
            return res;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    async getSpeed(startDate, endDate, city) {
        let url = `http://10.10.10.19/npo-service/speedChart.php?start=${startDate}&end=${endDate}&city=${city}`;
        try {
            const res = await axios.get(url)
            console.log(url);
            return res;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    getPlan(date, place) {
        let planUrai = place == null ? 'Урай' : place;

        /* if (place != null && place.length > 1) {
            planUrai = 'Урай';
        } else if (place != null) {
            planUrai = place[0].name;
        } */
        let planSec = 0;
        let planSpeed = 0;
        let planRub = 0;
        let price = 2137;
        switch (date.getMonth()) {
            case 0:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 37;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 1:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 37;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 2:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 37;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 3:
                planSec = (planUrai == 'Урай' ? 73 : 65);
                planSpeed = 30;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 4:
                planSec = (planUrai == 'Урай' ? 73 : 65);
                planSpeed = 33;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 5:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 35;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 6:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 35;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 7:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 35;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 8:
                planSec = (planUrai == 'Урай' ? 73 : 65);
                planSpeed = 33;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 9:
                planSec = (planUrai == 'Урай' ? 73 : 65);
                planSpeed = 33;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 10:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 35;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            case 11:
                planSec = (planUrai == 'Урай' ? 69 : 65);
                planSpeed = 37;
                planRub = ((price * planSec) / 3600).toFixed();
                break;
    
            default:
                planSec = 0;
                planSpeed = 0;
                planRub = 0;
                break;
        }

        let plans = {
            planSec : planSec,
            planSpeed : planSpeed,
            planRub : planRub,
        }
        return plans;
    }
}
