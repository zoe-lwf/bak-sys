import React, { useState, useEffect } from 'react'; // 修改: 添加useEffect
import {Table, Button, Input, message, Upload, Typography, Modal, Tag} from 'antd';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'; // 新增: 引入useHistory
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";
import NewsPreview from "./NewsPreview"; // 新增: 引入axios库

const { Text } = Typography;

export default function NewsDraft() {
    const [drafts, setDrafts] = useState([]); // 修改: 初始化drafts为空数组
    const [editingId, setEditingId] = useState(null);
    const [editingDraft, setEditingDraft] = useState({});
    const user = JSON.parse(localStorage.getItem("authToken"));
    const [categories, setCategories] = useState([])
    const navigate = useNavigate(); // 新增: 初始化history
    const [previewVisible, setPreviewVisible] = useState(false); // 新增: 用于控制预览模态框的显示
    const [previewDraft, setPreviewDraft] = useState({}); // 新增: 用于存储预览的新闻内容

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <strong>{text}</strong>, // 修改: 使用<strong>标签加粗显示ID
        },
        {
            title: 'author',
            dataIndex: 'author',
            key: 'author',
            render: (text) => <Text type="primary">{text}</Text>, // 修改: 使用<Text type="secondary">标签显示蓝色引用
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <a onClick={() => handlePreview(record)}>{text}</a> // 修改: 将文本包裹在<a>标签中并添加点击事件
            ),
        },
        // {
        //     title: 'Content',
        //     dataIndex: 'content',
        //     key: 'content',
        //     display: '',
        //     render: (text, record) => editingId === record.id ? (
        //         <Input value={editingDraft.content}
        //                onChange={e => setEditingDraft({...editingDraft, content: e.target.value})}/>
        //     ) : (
        //         <div dangerouslySetInnerHTML={{ __html: text.slice(0, 200) + (text.length > 200 ? '...' : '')}}></div> // 修改: 使用slice方法截取前100个字符
        //     ),
        // },
        {
            title: 'Category',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId, record) => editingId === record.id ? (
                <Input value={editingDraft.categoryId}
                       onChange={e => setEditingDraft({...editingDraft, categoryId: e.target.value})}/>
            ) : (
                <Tag color="blue">{categories.find(category => category.id === categoryId)?.value || 'Unknown'}</Tag> // 修改: 使用Tag组件显示分类
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    {editingId === record.id ? (
                        <Button type={'primary'} onClick={() => handleSave(record.id)}>Save</Button>
                    ) : (
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}/>
                    )}
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmDelete(record)}/>

                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => uploadToAudit(record)} />

                </span>
            ),
        },
    ];

    useEffect(() => { // 新增: 使用useEffect在组件挂载时获取数据
        fetchDrafts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => { // 修改: 使用axios替换fetch
        try {
            const response = await axios.get(`/categories`);
            setCategories(response.data);
        } catch (error) {
            message.error('Failed to fetch categories: ' + error.message);
        }
    };

    const fetchDrafts = async () => { // 修改: 使用axios替换fetch
        try {
            const response = await axios.get(`/news?author=${user.username}&auditState=0`);
            setDrafts(response.data);
        } catch (error) {
            message.error('Failed to fetch drafts: ' + error.message);
        }
    };

    const handleEdit = (id) => {
        navigate(`/news-manage/update/${id}`);
    };

    const handleSave = (id) => {
        const newDrafts = drafts.map(draft => (draft.id === id ? editingDraft : draft));
        setDrafts(newDrafts);
        setEditingId(null);
        setEditingDraft({});
        message.success('Draft saved successfully!');
    };

    const handlePreview = (record) => { // 新增: 处理预览逻辑
        setPreviewDraft(record);
        setPreviewVisible(true);
    };

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'do you want to delete?',
            icon: <ExclamationCircleOutlined />,
            onOk(){
                deleteAction(record);
            },
            onCancel(){
                console.log('取消删除');
            }
        });
    }
    async function deleteAction(record) {
        await axios({
                method: 'delete',
                url: `/news/${record.id}`
            }).then((res) => {
                setDrafts(drafts.filter(draft => draft.id !==res.data.id));
                message.success('Draft deleted successfully!');
            }).catch(error => {
                console.error("Error deleting right:", error);
            });
    }


    const uploadToAudit = (record) => {
        // 这里可以添加逻辑，保存数据到审核列表中
        axios.patch(`/news/${record.id}`, {
            auditState: 1
        }).then(res => {
            message.success('Uploaded successfully!');
            navigate('/audit-manage/list');
        }).catch(error => {
            console.error("Error uploading to audit:", error);
        });
    };

    return (
        <div>
            <h2>草稿箱</h2>
            <Table dataSource={drafts} columns={columns} rowKey="id"/>
            <Modal // 新增: 预览模态框
                title="新闻预览"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={1000} // 设置模态框宽度为800px
            >
                <NewsPreview data={{previewDraft,categories}}></NewsPreview>
            </Modal>
        </div>
    )
}