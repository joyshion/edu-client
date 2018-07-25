import axios from 'axios'

export default class API {
    constructor() {
        axios.defaults.baseURL = 'https://edu.xuancai365.com/api/' + process.env.BUILD_TYPE;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    getAuthHeader() {
        let auth_token = localStorage.getItem('auth_token');
        if (auth_token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth_token;
        }
    }
    get(url, data) {
        this.getAuthHeader();
        return new Promise((resolve, reject) => {
            axios.get(url, data)
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
    }
    post(url, data) {
        this.getAuthHeader();
        return new Promise((resolve, reject) => {
            axios.post(url, data)
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
    }
}