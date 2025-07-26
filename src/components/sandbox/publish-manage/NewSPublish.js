import {Button, Table, Tag} from "antd";

export default function NewSPublish(props) {
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
                return <Tag color="geekblue">{props.categories.find(category => category.id === String(categoryId))?.value || 'Unknown'}</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (item) => {
                return (
                    <div>
                        {/*回调item id*/}
                        {props.button(item.id)}
                    </div>
                );
            }
        }
    ];
    return (
        <div>
            <Table
                columns={columns}
                dataSource={props.publishList}
                pagination={5}
                rowKey={(item) => item.id}
            />
        </div>
    )
}