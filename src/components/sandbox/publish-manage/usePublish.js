
// 自定义hook，使用use开头，返回想要的结果
import {useEffect, useState} from "react";
import axios from "axios";
import {message} from "antd";

export default function usePublish(type){
    // const publishStateMap = {
    //     0: { text: '未发布', color: 'red' },
    //     1: { text: '待发布', color: 'orange' },
    //     2: { text: '已发布', color: 'green' },
    //     3: { text: '已下线', color: 'blue' }
    // };

    const {username} = JSON.parse(localStorage.getItem('authToken'))
    const [categories, setCategories] = useState([]);
    const [publishList, setPublishList] = useState([]);

    useEffect(() => {
        fetchPublishList().then()
        fetchCategories().then()
    }, [username])

    const fetchPublishList = async () => {
        try {
            await axios.get(`/news?author=${username}&publishState=${type}`)
                .then(r => {
                    setPublishList(r.data)
                })
        } catch (error) {
            message.error('Failed to fetch data: ' + error.message);
        }
    };
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/categories`);
            setCategories(response.data);
        } catch (error) {
            message.error('Failed to fetch categories: ' + error.message);
        }
    };

    const handlePublish = async (id) => {
        setPublishList(publishList.filter(item => item.id !== id))
        await axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(r => {
            message.success('Published successfully')
        })
    }
    const handleDelete = async (id) => {
        setPublishList(publishList.filter(item => item.id !== id))
        await axios.delete(`/news/${id}`).then(r => {
            message.success('Delete successfully')
        })
    }
    const handleSunset = async (id) => {
        setPublishList(publishList.filter(item => item.id !== id))
        await axios.patch(`/news/${id}`, {
            publishState: 3,
            publishTime: Date.now()
        }).then(r => {
            message.success('Sunset successfully')
        })
    }
    return {
        categories,
        publishList,
        handlePublish,
        handleDelete,
        handleSunset
    }
}