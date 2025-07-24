import {Button, Modal, Popover, Switch, Table, Tag} from "antd";
import {useState, useEffect} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";


export default function RightList() {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key) => {
                return <Tag color="geekblue">{key}</Tag>
            }

        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                return (
                    <div>
                        <Popover content={<div style={{ textAlign: 'center' }}>
                                        <Switch checked={record.pagepermisson} onChange={() => switchMethod(record)}>
                                        </Switch>
                                        </div>}
                                 title="配置项"
                                 trigger="hover"
                        >
                            <Button type="primary" shape="circle" icon={<EditOutlined />}
                            disabled={record.pagepermisson === undefined}
                            />
                        </Popover>
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                                onClick={() => confirmMethod(record)}/>
                    </div>
                );
            }
        }
    ];

    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    useEffect(() => {
        axios.get("/rights").then(res => {
            setData(res.data);
            setPagination({
                ...pagination,
                total: res.data.length,
            });
        }).catch(error => {
            console.error("Error fetching rights data:", error);
        });
    },[]);  //[]没值也要写，不然page循环刷新,deps不要pagination，分页会出现闪烁问题

    function switchMethod(record) {
        record.pagepermisson = record.pagepermisson === 1 ? 0 : 1;
        setData([...data])
        if (record.grade === 1){
            axios.patch(`/rights/${record.id}`, {pagepermisson: record.pagepermisson})
        } else {
            axios.patch(`/children/${record.id}`, {pagepermisson: record.pagepermisson})
        }
    }
    function deleteAction(record) {
        if(record.grade === 1){
            axios({
                method: 'delete',
                url: `/rights/${record.id}`
            }).then(() => {
                setData(data.filter(item => item.id !== record.id));
            }).catch(error => {
                console.error("Error deleting right:", error);
            });
        } else {
            // TODO 删除子级,这里需要完善，假删除,json server数据结构不对，目前不是关联表查询
            const parentList = data.filter(it => it.id === 2 + '')
            parentList[0].children = parentList[0].children.filter(item => item.id !== record.id)
            console.log(parentList[0].children)
            setData([...data])
            axios({
                method: 'delete',
                url: `/children/${record.id}`
            })
        }

    }

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

    return (
        <div>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={pagination} 
                onChange={(page) => setPagination({ ...pagination, current: page.current })}
            />
        </div>
    )
}