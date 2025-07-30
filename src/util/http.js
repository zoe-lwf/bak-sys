import axios from "axios";
import store from "../redux/store";

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.headers = {
    'Content-Type': 'application/json;charset=utf-8'
}
axios.interceptors.request.use(config => {
    // 显示loading
    store.dispatch({type: 'change_loading', payload: true})
    return config
}, function ( error){
    return Promise.reject(error)
})

axios.interceptors.response.use(res => {
    // 隐藏loading
    store.dispatch({type: 'change_loading', payload: false})
    return res
}, function (error) {
    return Promise.reject(error)
})