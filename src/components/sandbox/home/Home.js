import {Avatar, Card, Col, Drawer, List, Row} from "antd";
import Meta from "antd/es/card/Meta";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import * as echarts from 'echarts'; // 引入 ECharts for React 组件
import _ from 'lodash';

export default function Home() {
    const barRef = useRef(null);
    const pieRef = useRef(null);
    const [viewNews, setViewNews] = useState([]); // 假设这是存储view news数据的状态变量
    const [starNews, setStarNews] = useState([]); // 假设这是存储star news数据的状态变量
    const [categories, setCategories] = useState([]); // 添加存储categories数据的状态变量
    const [newsChartData, setNewsChartData] = useState([]); // 添加存储图表数据
    const [open, setOpen] = useState(false); // 控制右边抽屉显示

    const {username, region} = JSON.parse(localStorage.getItem('authToken'));
    const {roleName} = JSON.parse(localStorage.getItem('role'));

    // 添加 fetchNews 方法
    const fetchViewNews = async () => {
        //     异步调用news中数据
        const response = await axios.get('/news?publishState=2');
        const filteredData = response.data.filter(item => item.publishState === 2);
        const sortedData = filteredData.sort((a, b) => b.view - a.view).slice(0, 6);
        // json server 不支持多条件查询，暂时这么用，相当于&_sort=view&_order=desc&limit=6
        return sortedData;
    };

    const fetchStarNews = async () => {
        //     异步调用news中数据
        const response = await axios.get('/news?publishState=2');
        const filteredData = response.data.filter(item => item.publishState === 2);
        const sortedData = filteredData.sort((a, b) => b.star - a.star).slice(0, 6);
        return sortedData;
    };

    // 添加 fetchCategories 方法
    const fetchCategories = async () => {
        //     异步调用数据
        const response = await axios.get('/categories');
        return response.data; // 返回获取到的数据
    };

    useEffect(() => {
        // 使用 Promise.all 并行调用 fetchNews 和 fetchCategories
        Promise.all([fetchViewNews(), fetchCategories(), fetchStarNews()])
            .then(([viewNewsData, categoriesData, starNewsData]) => {
                setViewNews(viewNewsData); // 获取到的view news数据
                setCategories(categoriesData); // 更新 categories 数据
                setStarNews(starNewsData); // 获取到的star news数据

            });
    }, []);

    useEffect(() => {
        axios.get('/news').then(res => {
            setNewsChartData(res.data);
        })
        renderBarView()
    }, [barRef.current, categories]);

    // 饼状图
    const renderBarView = () => {
        if (barRef.current) {
            const data = _.groupBy(newsChartData, item => item.categoryId)
            // 销毁之前的 ECharts 实例
            if (barRef.current.echartsInstance) {
                barRef.current.echartsInstance.dispose();
            }
            // 初始化新的 ECharts 实例
            const myChart = echarts.init(barRef.current);
            barRef.current.echartsInstance = myChart;

            // 计算每个分类的新闻数量
            // 创建 categoryMap 对象：通过 categories.reduce 方法，将 categories 数组转换为一个对象 categoryMap，其中键为分类的 ID，值为分类的名称。
            const categoryMap = categories.reduce((acc, category) => {
                // acc是累加器，初始值为一个空对象。
                acc[category.id] = category.value;
                return acc;
            }, {});

            const xAxisData = Object.keys(data).map(categoryId => categoryMap[categoryId]);
            const seriesData = Object.values(data).map(item => item.length);

            // 绘制图表
            myChart.setOption({
                title: {
                    text: '已发布新闻'
                },
                tooltip: {},
                legend: {
                    data: ['数量']
                },
                xAxis: {
                    data: xAxisData,
                    axisLabel: {
                        rotate: 45 // 设置 x 轴标签旋转角度为 45 度
                    }
                },
                yAxis: {},
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: seriesData
                    }
                ]
            });
            // 让屏幕自适应，缩小图表跟着缩小，但是整个windows都会生效，需要在组件卸载时移除监听事件
            window.addEventListener('resize', () => {
                myChart.resize();
            });
            // 清除事件监听器，防止内存泄漏
            return () => {
                window.removeEventListener('resize', () => {
                    myChart.resize();
                });
                myChart.dispose();
            };
        }
    }
    // 柱状图
    const renderPieView = () => {
        if(pieRef.current){
            const currentList = newsChartData.filter(item => item.author === username)
            const data = _.groupBy(currentList, item => item.categoryId)
            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.value;
                return acc;
            }, {});
            const list = Object.values(data).map(item => {
                return {
                    name: categoryMap[item[0].categoryId],
                    value: item.length
                }
            })

            // 销毁之前的 ECharts 实例
            if (pieRef.current.echartsInstance) {
                pieRef.current.echartsInstance.dispose();
            }
            // 初始化新的 ECharts 实例
            const myChart = echarts.init(pieRef.current);
            pieRef.current.echartsInstance = myChart;
            myChart.setOption({
                title: {
                    text: '当前用户分类图示',
                    // subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '发布数量',
                        type: 'pie',
                        radius: '50%',
                        // data: [
                        //     {value: 1048, name: 'Search Engine'},
                        //     {value: 735, name: 'Direct'},
                        //     {value: 580, name: 'Email'},
                        //     {value: 484, name: 'Union Ads'},
                        //     {value: 300, name: 'Video Ads'}
                        // ],
                        data: list,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });

            // 让屏幕自适应，缩小图表跟着缩小
            window.addEventListener('resize', () => {
                myChart.resize();
            });

            // 清除事件监听器，防止内存泄漏
            return () => {
                window.removeEventListener('resize', () => {
                    myChart.resize();
                });
                myChart.dispose();
            };
        }
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewNews}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starNews}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setOpen(true)
                                // 确保在 DOM 元素完全渲染后再初始化 ECharts 实例。
                                setTimeout(() => {
                                    renderPieView()
                                },0)

                                }
                            }/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"/>}
                            title={username}
                            description={
                                <div>
                                    <b>{region}</b>
                                    <span style={{marginLeft: '20px'}}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            {/*    抽屉组件*/}
            <Drawer
                width={750}
                title="个人新闻数据展示"
                placement="right"
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                key=""
            >
                <div ref={pieRef} style={{height: 400, width: "100%", marginTop: 30}}>
                </div>
            </Drawer>
            {/*    图表展示，饼状图*/}
            <div ref={barRef} style={{height: 400, width: "100%", marginTop: 30}}>
            </div>
        </div>
    )
}