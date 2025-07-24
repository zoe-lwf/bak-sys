import axios from "axios";
import {useEffect, useState} from "react";
import {Button, message, Table, Tag} from "antd";

export default function AuditList() {
    // 定义 auditState 映射
    const auditStateMap = {
        0: { text: '未审核', color: 'red' },
        1: { text: '审核中', color: 'orange' },
        2: { text: '已通过', color: 'green' },
        3: { text: '未通过', color: 'blue' }
    };
    const publishStateMap = {
        0: { text: '未发布', color: 'red' },
        1: { text: '待发布', color: 'orange' },
        2: { text: '已发布', color: 'green' },
        3: { text: '已下线', color: 'blue' }
    };
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            render: (title) => {
                return <a href={`/news-manage/add`}>{title}</a>
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
                return <Tag color="geekblue">{categories.find(category => category.id === String(categoryId))?.value || 'Unknown'}</Tag>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            key: 'auditState',
            render: (auditState) => {
                const state = auditStateMap[auditState];
                return <Tag color={state?.color || 'default'}>{state?.text || '未知状态'}</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (record) => {
                return (
                    <div>
                        {
                            record.auditState === 1 && <Button danger>撤销</Button>
                        }
                        {
                            record.auditState === 2 && <Button >发布</Button>
                        }
                        {
                            record.auditState === 3 && <Button type="primary">更新</Button>
                        }
                    </div>
                );
            }
        }
    ];
    const {username} = JSON.parse(localStorage.getItem('authToken'));
    const [auditList, setAuditList] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchAuditList().then()
        fetchCategories().then()
    }, [])

    const fetchAuditList = async () => {
        try {
            await axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`)
                .then(r => {
                        console.log(r.data)
                        setAuditList(r.data)
                    })
        } catch (error) {
            message.error('Failed to fetch drafts: ' + error.message);
        }
    };
    const fetchCategories = async () => { // 修改: 使用axios替换fetch
        try {
            const response = await axios.get(`/categories`);
            setCategories(response.data);
        } catch (error) {
            message.error('Failed to fetch categories: ' + error.message);
        }
    };
    return (
        <div>
            <Table
                columns={columns}
                dataSource={auditList}
                pagination={5}
                rowKey={(item) => item.id}
            />
        </div>
    )
}