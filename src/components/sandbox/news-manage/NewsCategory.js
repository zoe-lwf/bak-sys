import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Modal, Table} from 'antd';
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";


export default function NewsCategory() {

    const columns = [
        {
            title: '分类ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            key: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: "title",
                title: '栏目名称',
                handleSave: handleSave
            }),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                                onClick={() => confirmDelete(record)}/>
                    </div>
                );
            }
        }
    ];
    const [caterogies, setCategories] = useState([]);
    useEffect(() =>{
        axios.get('/categories').then(res => {
            setCategories(res.data)
        })
    },[])
    function confirmDelete(record) {
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

    function deleteAction(record) {
            axios({
                method: 'delete',
                url: `/categories/${record.id}`
            }).then(() => {
                setCategories(caterogies.filter(item => item.id !== record.id));
            }).catch(error => {
                console.error("Error deleting right:", error);
            });

    }
    const handleSave = (record) => {
        setCategories(caterogies.map(item => {
            if (item.id === record.id) {
                return record;
            }
            return item;
        }))
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title
        })
    }

    // 以下是可编辑单元格
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingInlineEnd: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

    return (
        <div>
            <Table dataSource={caterogies} columns={columns}
                    pagination={{pageSize: 6}}
                   rowKey={(item) => item.id}
                   components={components}
            />
        </div>
    );
}