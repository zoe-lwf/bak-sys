import {Button, Form, Input, message, notification, Select, Space, Steps} from "antd";
import './NewsManage.css'
import {useEffect, useState} from "react";
import axios from "axios";
import NewsEditor from "./NewsEditor";
import {useNavigate,useParams} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";


export default function NewsUpdate() {
    const [form] = Form.useForm();
    const { id } = useParams(); // 获取URL中的id参数
    const {Option} = Select;
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    // 用来存储表单信息，需要更新到后端
    const [formInfo, setFormInfo] = useState({});
    // 存文本编辑信息
    const [content, setContent] = useState("");
    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategoryList(res.data)
        })
    })

    useEffect(() => {
        axios.get(`/news/${id}`).then(r => {
            // 把value设置回表单
            form.setFieldsValue({
                title: r.data.title,
                categoryId: r.data.categoryId,
            });
            setContent(r.data.content)
        })
    },[id] ) //根据id变化时要重新加载数据
    function nextStep() {
        if (currentStep === 0){
            // 这个方法会触发表单字段的验证,点击下一步之前会先检验表单，没有的话，点击下一步就会直接通过，即使没值
            form.validateFields().then((res)=>{
                setFormInfo(res)
                setCurrentStep(currentStep + 1);
            }).catch((error)=>{
                console.log('表单验证失败:', error);
            });
        } else {
            if (content==="" || content.trim()==="<p></p>"){
                message.error("请输入新闻内容")
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    }

    function previousStep() {
        if (currentStep === 0) {
            return;
        }
        setCurrentStep(currentStep - 1);
    }

    const onFinish = (values) => {
        console.log(values);
    };

    function handlerSave(auditState) {
        axios.patch(`/news/${id}`, {
            ...formInfo,
            content,
            auditState: auditState,
            publishState: 0,
            createTime: Date.now(),
            star: 0,
            view: 0
        }).then(() => {
            setShowNotification(true)
            if (auditState===0){
                navigate('/news-manage/draft')
            }
            if (auditState===1){
                navigate('/audit-manage/list')
            }
        })

    }
    // 通知栏
    const [showNotification, setShowNotification] = useState(false);
    useEffect(() => {
        if (showNotification) {
            notification.open({
                message: 'Notification',
                description:
                    'save successful!!!',
                duration: 2,
            });
            setShowNotification(false); // 重置通知状态
        }
    }, [showNotification]);
    const handleBack = () => {
        navigate(-1); // 返回上一页
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{marginRight: 16, cursor: 'pointer',color: '#999'}}>
                    <ArrowLeftOutlined onClick={handleBack} />
                </div>
                <h1>修改新闻</h1>
            </div>
            <Steps
                current={currentStep}
                items={[
                    {
                        title: '基本信息',
                        description: "新闻标题，新闻分类",
                    },
                    {
                        title: '新闻内容',
                        description: "新闻主体内容",
                    },
                    {
                        title: '新闻提交',
                        description: "保存草稿或提交审核",
                    },
                ]}
            />
            <div style={{marginTop: 50}}>
                {/*step1*/}
                <div className={currentStep === 0 ? '' : 'active'}>
                    <Form
                        {...layout}
                        form={form}
                        name="news-add1"
                        onFinish={onFinish}
                        style={{maxWidth: 600}}

                    >
                        <Form.Item name="title" label="新闻标题" rules={[{required: true,message: '请输入新闻标题'}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="categoryId" label="新闻分类" rules={[{required: true,message: '请选择'}]}>
                            <Select
                                placeholder="Select a option"
                            >
                                {
                                    categoryList.map((item) => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={currentStep === 1 ? '' : 'active'}>
                    <NewsEditor getContent={(value) =>{
                        setContent(value)
                        }}

                                content = {content}
                    ></NewsEditor>
                </div>
            </div>

            <div style={{marginTop: 50}}>
                {currentStep < 2 && <Button type={"primary"} onClick={() => nextStep()}>下一步</Button>}
                {currentStep > 0 && <Button onClick={() => previousStep()}>上一步</Button>}
                {
                    currentStep === 2 && <span>
                        <Button type={"primary"} onClick={() => handlerSave(0)}>保存草稿</Button>
                        <Button danger onClick={() => handlerSave(1)}>提交审核</Button>
                    </span>
                }
            </div>

        </div>
    )
}