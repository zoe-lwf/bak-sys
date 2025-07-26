import {useEffect, useState} from "react";
import axios from "axios";
import {Button, message, Table, Tag} from "antd";

export default function Audit() {
    const [auditNews, setAuditNews] = useState([]);
    const {roleId, region, username} = JSON.parse(localStorage.getItem('authToken'));
    const [categories, setCategories] = useState([]);
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author'
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId) => {
                return <Tag
                    color="geekblue">{categories.find(category => category.id === String(categoryId))?.value || 'Unknown'}</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (record) => {
                return (
                    <div>
                        <Button danger onClick={() => handlerAuditNews(record, 3, 0)}>驳回</Button>
                        <Button type="primary" onClick={() => handlerAuditNews(record, 2, 1)}>通过</Button>
                    </div>
                );
            }
        }
    ];

    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=categories`).then(r => {
            const list = r.data
            setAuditNews(roleId === 1 ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.roleId === 3 && item.region === region)
            ])
        })
    }, [roleId, region, username])

    useEffect(() => {
        axios.get(`/categories`).then(response => setCategories(response.data));
    }, [])

    function handlerAuditNews(item, auditState, publishState) {
        setAuditNews(auditNews.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {auditState: auditState, publishState: publishState}).then(r => {
            message.success('success!');
        })
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={auditNews}
                pagination={5}
                rowKey={(item) => item.id}
            />
        </div>
    )
}