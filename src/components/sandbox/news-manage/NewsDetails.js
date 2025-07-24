import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Card, Col, Row} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

export default function NewsDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [previousDate, setPreviousDate] = useState([])
    useEffect(() => {
        axios.get(`/news/${id}`).then(r => {
            console.log(r.data)
            setPreviousDate(r.data)
        })
    }, [id]) //根据id变化时要重新加载数据

    const handleBack = () => {
        navigate(-1); // 返回上一页
    };
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{marginRight: 16, cursor: 'pointer',color: '#999'}}>
                    <ArrowLeftOutlined onClick={handleBack} /> 返回
                </div>
            </div>
            <Card title={
                <span>
                    <div style={{textAlign: 'center'}}>
                        {previousDate.title}
                    </div>
                </span>
            }>
                <Row gutter={6}>
                    <Col span={8}>
                        <p>创建者: {previousDate.author}</p>
                    </Col>
                    <Col span={8}>
                        <p>创建时间: {previousDate.createTime ? new Date(previousDate.createTime).toLocaleDateString('en-CA') : "-"}</p>
                    </Col>
                    <Col span={8}>
                        <p>发布时间: {previousDate.publishTime? new Date(previousDate.publishTime).toLocaleDateString('en-CA') : "-"}</p>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={8}>
                        <p>区域: {previousDate.region}</p>
                    </Col>
                    <Col span={8}>
                        <p>审核状态: <span style={{ color: 'red' }}>{previousDate.auditState === 0 ? '未审核' : previousDate.auditState === 1 ? '审核通过' : '审核不通过'}</span></p>
                    </Col>
                    <Col span={8}>
                        <p>发布状态: <span style={{ color: 'red' }}>{previousDate.publishState===0? '未发布' : '已发布'}</span></p>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={8}>
                        <p>访问数量: <span style={{ color: 'cyan' }}>{previousDate.view}</span></p>
                    </Col>
                    <Col span={8}>
                        <p>点赞数量: <span style={{ color: 'cyan' }}>{previousDate.star}</span></p>
                    </Col>
                    <Col span={8}>
                        <p>评论数量: <span style={{ color: 'cyan' }}>{previousDate.comment ? previousDate.comment.length : 0}</span></p>
                    </Col>
                </Row>
            </Card>
            <Card>
                <div dangerouslySetInnerHTML={{ __html: previousDate.content }}></div>
            </Card>
        </div>
    )
}
