
import {Button, Checkbox, Flex, Form, Input, message} from "antd";
import "./Login.css"
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";

const Login = () => {

    const onFinish = (values) => {
        axios({
            method: 'get',
            url: `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`,
        }).then((res) => {
            if (res.data.length === 0) {
                message.error('用户名或密码错误');
            } else {
                localStorage.setItem('authToken', JSON.stringify(res.data[0]));
                axios.get(`/roles?id=${res.data[0].roleId}&_expand=rights`)
                    .then((res) => {
                        localStorage.setItem('role', JSON.stringify(res.data[0]));
                    });

                window.location.href = '/';
            }
        }).catch(error => {
            console.error("Error logging in:", error);
        });
    };

    return (
        <div className={'login-container'}>
            <div className="login-form">
                <div className={'login-title-text'}>后台管理系统</div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="">Forgot password</a>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>
                        or <a href="">Register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login;