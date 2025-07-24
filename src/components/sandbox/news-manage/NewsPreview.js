import { Card, Row, Col, Tag } from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";

export default function NewsPreview({ data }) {
    const [previousDate, setPreviousDate] = useState([])
    useEffect(() => {
        axios.get(`/news/${data.previewDraft.id}`).then(r => {
            setPreviousDate(r.data)
        })
    }, [data.previewDraft.id]) //根据id变化时要重新加载数据
    return (
        <div>
            <Card title={
                <span>
                    <div style={{textAlign: 'center'}}>
                        {previousDate.title}
                        <Tag color="lime" style={{ marginLeft: 8 }}>
                        {data.categories.find(category => category.id === previousDate.categoryId)?.value || 'Unknown'}
                        </Tag>
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