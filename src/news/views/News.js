import {useEffect, useState} from "react";
import axios from "axios";
import {Card, Col, List, Row} from "antd";
import _ from 'lodash';
import {Link} from "react-router-dom";

export default function News() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        Promise.all([fetchNews(), fetchCategories()])
            .then(([newsData, categoriesData]) => {
                const groupNewsData = _.groupBy(newsData, item => item.categoryId);
                // 计算每个分类的新闻数量
                // 创建 categoryMap 对象：通过 categories.reduce 方法，将 categories 数组转换为一个对象 categoryMap，其中键为分类的 ID，值为分类的名称。
                const categoryMap = categoriesData.reduce((acc, category) => {
                    // acc是累加器，初始值为一个空对象。
                    acc[category.id] = category.value;
                    return acc;
                }, {});
                setCategories(categoriesData); // 更新 categories 数据
                const mappedNewsData = Object.entries(groupNewsData).map(([categoryId, newsItems]) => ({
                    category: categoryMap[categoryId],
                    newsItems
                }));
                setNews(mappedNewsData);
            });
    }, [])

    const fetchNews = async () => {
        //     异步调用news中数据
        const response = await axios.get('/news?publishState=2');
        return response.data; // 返回获取到的数据
    };
    // 添加 fetchCategories 方法
    const fetchCategories = async () => {
        //     异步调用数据
        const response = await axios.get('/categories');
        return response.data; // 返回获取到的数据
    };
    return (
        <div style={{width: '95%', margin: '0 auto'}}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '25px', fontWeight: 'bold',marginLeft: '20px',marginTop: '10px' }}>全球大新闻</div>
                <div style={{ fontSize: '16px', color: '#666', marginLeft: '20px',marginTop: '10px' }}>查看新闻</div>
            </div>
            <div>
                <Row gutter={[16,12]}>
                    {
                        news.map(item => (
                            <Col span={8} key={item.category}>
                                <Card title={item.category} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item.newsItems}
                                        pagination={{pageSize: 5}}
                                        renderItem={(data) => (
                                            <List.Item key={data.id}>
                                                <Link to={`/details/${data.id}`}>{data.title}</Link>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </div>
    )
}