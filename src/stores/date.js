import {defineStore} from "pinia";

export const useDateStore = defineStore("counter", {
    state: () => {
        return {
            date: [new Date(), new Date()]
        };
    },
    actions: {

    },
    getters: {

    }
});