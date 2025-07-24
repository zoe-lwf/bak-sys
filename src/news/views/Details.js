import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Card, Col, Row, Space} from "antd";
import {ArrowLeftOutlined, HeartOutlined, HeartTwoTone} from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";

export default function Detail() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [previousDate, setPreviousDate] = useState([])
    useEffect(() => {
        axios.get(`/news/${id}`).then(r => {
            setPreviousDate(r.data)
        })
    }, [id]) //根据id变化时要重新加载数据

    const handleBack = () => {
        navigate(-1); // 返回上一页
    };
    return (
        <div>
            <Card title={
                <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginLeft: 16, marginRight: 16, cursor: 'pointer', color: '#999'}}>
                            <ArrowLeftOutlined onClick={handleBack}/> 返回
                        </div>
                    </div>
                    <div style={{ display: 'flex',  justifyContent: 'center',alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ margin: 0, fontSize: '20px', color: '#999' }}>{previousDate.title}</div>
                        <Space style={{ marginLeft: '20px' }}>
                            <HeartOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                        </Space>
                    </div>
                </div>
            }>
                <Row gutter={6}>
                    <Col span={8}>
                        <p>创建者: {previousDate.author}</p>
                    </Col>
                    <Col span={8}>
                        <p>区域: {previousDate.region}</p>
                    </Col>
                    <Col span={8}>
                        <p>发布时间: {previousDate.publishTime ? new Date(previousDate.publishTime).toLocaleDateString('en-CA') : "-"}</p>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={8}>
                        <p>访问数量: <span style={{color: 'cyan'}}>{previousDate.view}</span></p>
                    </Col>
                    <Col span={8}>
                        <p>点赞数量: <span style={{color: 'cyan'}}>{previousDate.star}</span></p>
                    </Col>
                    <Col span={8}>
                        <p>评论数量: <span
                            style={{color: 'cyan'}}>{previousDate.comment ? previousDate.comment.length : 0}</span></p>
                    </Col>
                </Row>
            </Card>
            <Card>
                <div dangerouslySetInnerHTML={{__html: previousDate.content}}></div>
            </Card>
        </div>
    )
}
