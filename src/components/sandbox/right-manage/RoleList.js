import {Button, Modal, Table, Tree} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined} from "@ant-design/icons";

export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [treeData, setTreeData] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const columns = [
        {
            title: '角色ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '操作',
            key: 'action',
            render: (item) => {
                return <div>
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />}
                            onClick={() => {
                                setIsModalOpen(!isModalOpen)
                                setCurrentRights(item.rights)
                                setCurrentId(item.id)
                                }
                            }
                    />
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}/>
                </div>
            }
        },
    ];
    const confirmMethod = (record) => {
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
                url: `/roles/${record.id}`
            }).then(() => {
                setDataSource(dataSource.filter(item => item.id !== record.id));
            }).catch(error => {
                console.error("Error deleting right:", error);
            });

    }
    useEffect(() => {
        axios.get("/roles").then(res => setDataSource(res.data))
    }, [])
    useEffect(() => {
        axios.get("/rights?_emded=children").then(res => {
            setTreeData(res.data)
        })
    }, [])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
    //     同步dataSource
        setDataSource(dataSource.map(item => {
            if(item.id === currentId){
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
    //     存到后台
        axios({
            method: 'patch',
            url: `/roles/${currentId}`,
            data: {
                rights: currentRights
            }
        }).then(() => {
            setIsModalOpen(false);
        }).catch(error => {
            console.error("Error updating rights:", error);
        });

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
    };
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>
            <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div>
                    <Tree
                        checkable
                        // defaultExpandedKeys={['0-0-0', '0-0-1']}
                        // defaultSelectedKeys={['0-0-1']}
                        /*非受控属性，只在第一次渲染时起作用，应该使用checkedKeys,受控属性*/
                        // defaultCheckedKeys={currentRights}
                        checkedKeys={currentRights}
                        // onSelect={onSelect}
                        onCheck={onCheck}
                        checkStrictly = {true}
                        treeData={treeData}
                    />
                </div>
            </Modal>
        </div>
    )
}