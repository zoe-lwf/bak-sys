import {Button, Form, Input, Modal, Select, Switch, Table, Tag} from "antd";
import {useEffect,useState} from "react";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";

export default function UserList() {
    const {roleId, username,region} = JSON.parse(localStorage.getItem("authToken"))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("/users").then(res => {
            const list = res.data
            setDataSource(roleId=== 1 ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.roleId === 3 && item.region === region)
            ])
        })
    }, [])
    const [regions, setRegions] = useState([])
    useEffect(() => {
        axios.get("/regions").then(res => {
            const list = res.data
            setRegions(roleId === 1 ? list :[
                ...list.filter(item => item.title === region)
            ])
        })
    }, [])
    const [roleList, setRoleList] = useState([])
    useEffect(() => {
        axios.get("/roles").then(res => {
            const list = res.data
            setRoleList(roleId === 1 ? list : [
                ...list.filter(item => item.roleType === 3)
            ])
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
            filters: [
                {
                    text: '全球',
                    value: '',
                },
                ...regions.map(item => ({
                    text: item.title,
                    value: item.value,
                })),
            ],
            onFilter: (value, record) => record.region === value,
            render: (region) => {
                return <b>{region === "" ? "全球" : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleId',
            key: 'roleId',
            render: (item) => {
                if (item === 1) {
                    return <Tag color="green">超级管理员</Tag>
                } else if (item === 2) {
                    return <Tag color="blue">区域管理员</Tag>
                } else {
                    return <Tag color="red">区域编辑</Tag>
                }
            }
        },
        {
            title: '用户名称',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            key: 'roleState',
            render: (item, data) => {
                return <div>
                    <Switch checked={item} disabled={data.default} onChange={() => handlerUserState(data)}/>
                </div>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (item) => {
                return <div>

                    <Button type="primary" shape="circle" disabled={item.default} onClick={() => handlerRoleChange(item)} icon={<EditOutlined/> }
                    />
                    <Button danger shape="circle" icon={<DeleteOutlined/>} disabled={item.default}
                            onClick={() => confirmMethod(item)}/>
                </div>
            }
        },
    ];

    function handlerUserState(data) {
        data.roleState = !data.roleState;
        setDataSource([...dataSource])
        axios({
            method: 'patch',
            url: `/users/${data.id}`,
            data: {
                roleState: data.roleState
            }
        }).then(() => {
            console.log("更新成功")
        }).catch(error => {
            console.error("Error updating user:", error);
        });
    }

    const confirmMethod = (record) => {
        Modal.confirm({
            title: 'do you want to delete?',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deleteAction(record);
            },
            onCancel() {
                console.log('取消删除');
            }
        });
    }

    function deleteAction(record) {
        axios({
            method: 'delete',
            url: `/users/${record.id}`
        }).then(() => {
            setDataSource(dataSource.filter(item => item.id !== record.id));
        }).catch(error => {
            console.error("Error deleting right:", error);
        });

    }



    const [addUserForm] = Form.useForm();
    const [updateUserForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [updateUserOpen, setUpdateUserOpen] = useState(false);
    function addUser() {

        setOpen(!open)

    }
    const onCreate = (values) => {
        setOpen(false);
        axios({
            method: 'post',
            url: '/users',
            data: {
                username: values.username,
                password: values.password,
                region: values.region === undefined ? '': values.region,
                roleState: values.roleState === undefined ? true : values.roleState,
                default: values.default === undefined ? false : values.default,
                roleId: parseInt(values.roleId, 10)
            }
        }).then((res) => {
            setDataSource([...dataSource, res.data]);
        }).catch(error => {
            console.error("Error adding user:", error);
        });
    };
    const [disable, setDisable] = useState(false);
    const onChange = (value) => {
        if (value === '1') {
            setDisable(true);
        } else {
            setDisable(false);
        }
    };

    const [updateUserData, setUpdateUserData] = useState({})

    function convertRoleId(roleId) {
        if (roleId === 1) return "超级管理员"
        if (roleId === 2) return "区域管理员"
        if (roleId === 3) return "区域编辑"
    }

    function handlerRoleChange(item) {
        // 检查角色权限，如果是2，3，就禁用掉角色选项卡
        checkRoleOptional();
        // 检查region权限，如果是2，3，就禁用掉region选项卡
        checkRegionOptional();

        const updateItem = {
            ...item,
            roleId: convertRoleId(item.roleId)
        }
        updateUserForm.setFieldsValue(updateItem); // 设置表单初始值
        setUpdateUserOpen(!updateUserOpen)
        setUpdateUserData(item)
    }
    const onUpdate = (item) => {
        setUpdateUserOpen(false);
        axios({
            method: 'patch',
            url: `/users/${updateUserData.id}`,
            data: {
                ...updateUserData,
                username: item.username,
                password: item.password,
                region: item.roleId === '1' ? '': item.region,
                roleId: parseInt(item.roleId, 10)
            }
        }).then((res) => {
            // 更新dataSource中的对应项
            const updatedDataSource = dataSource.map(user =>
                user.id === updateUserData.id ? res.data : user
            );
            setDataSource(updatedDataSource);
        }).catch(error => {
            console.error("Error updating user:", error);
        });
    };
    const [checkRoleOpt, setCheckRoleOpt] = useState(false)
    function checkRoleOptional(){
        if(roleId === 2){
            setCheckRoleOpt(true)
        }
    }
    const [checkRegionOpt, setCheckRegionOpt] = useState(false)
    function checkRegionOptional(){
        if(roleId === 2){
            setCheckRegionOpt(true)
        }
    }
    return (
        <div>
            <Button type="primary" onClick={() => {
                addUser()
            }}>添加用户</Button>
            <Modal
                open={open}
                title="新建用户"
                okText="确定"
                cancelText="取消"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit',
                }}
                onCancel={() => {
                    setOpen(false);
                    addUserForm.resetFields(); // 重置表单
                }}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={addUserForm}
                        name="form_add_user"
                        initialValues={{
                            modifier: 'public',
                        }}
                        clearOnDestroy
                        onFinish={(values) => onCreate(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: 'Please input username',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="password"
                           label="密码"
                           rules={[
                               {
                                   required: true,
                                   message: 'Please input password',
                               },
                           ]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="region" label="区域">
                    <Select
                        showSearch
                        placeholder="Select a region"
                        optionFilterProp="label"
                        disabled={disable}

                        options= {regions.map((item) => ({
                            value: item.value,
                            label: item.title,
                        }))}
                    />
                </Form.Item>
                <Form.Item name="roleId" label="角色">
                    <Select
                        showSearch
                        placeholder="Select a role"
                        optionFilterProp="label"
                        onChange={onChange}
                        options={roleList.map((item) => ({
                            value: item.id,
                            label: item.roleName,
                        }))}
                    />
                </Form.Item>
            </Modal>

            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}
                   pagination={{
                       pageSize: 5
                   }}
            />

            <Modal
                open={updateUserOpen}
                title="更新用户"
                okText="确定"
                cancelText="取消"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit',
                }}
                onCancel={() => {
                    setUpdateUserOpen(false);
                    updateUserForm.resetFields(); // 重置表单
                }}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={updateUserForm}
                        name="form_update_user"
                        initialValues={{
                            modifier: 'public',
                        }}
                        clearOnDestroy
                        onFinish={(item) => onUpdate(item)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="password"
                           label="密码"
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="region" label="区域">
                    <Select
                        showSearch
                        placeholder="Select a region"
                        optionFilterProp="label"
                        disabled={disable || checkRegionOpt}
                        options={regions.map((item) => ({
                            value: item.value,
                            label: item.title,
                        }))}
                    />
                </Form.Item>
                <Form.Item name="roleId" label="角色">
                    <Select
                        showSearch
                        placeholder="Select a role"
                        optionFilterProp="label"
                        onChange={onChange}
                        disabled={checkRoleOpt}
                        options={roleList.map((item) => ({
                            value: item.id,
                            label: item.roleName,
                        }))}
                    />
                </Form.Item>
            </Modal>

        </div>
    )
}