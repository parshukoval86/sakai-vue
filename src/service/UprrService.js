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
    async getData(newDate,startDate,endDate) {
        let url = `http://10.10.10.19/npo-service/BarData.php?date=${newDate}&start=${startDate}&end=${endDate}`;
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
