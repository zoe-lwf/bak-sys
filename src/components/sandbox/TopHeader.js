import {Header} from "antd/es/layout/layout";
import {Avatar, Button, Dropdown, theme, message} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";

function TopHeader(props) {
    // const [collapsed, setCollapsed] = useState(props.collapsed);
    const changed = () => {
        props.changed()
    }
    const {username} = JSON.parse(localStorage.getItem("authToken"))
    const {roleName} = JSON.parse(localStorage.getItem("role"))
    const navigate = useNavigate();
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const items = [
        {
            key: '1',
            label: (
                roleName
            ),
        },
        {
            key: '2',
            label: (
                "退出"
            ),
            danger: true,
            onClick: () => handleLogout(),
        }
    ];
    const handleLogout = () => {
        // 清除会话或令牌
        localStorage.removeItem('authToken'); // 假设令牌存储在localStorage中
        localStorage.removeItem('role');
        // 或者使用sessionStorage
        // sessionStorage.removeItem('token');

        // 显示退出成功消息
        message.success('退出成功');

        // 重定向到登录页面
        navigate('/login'); // 如果你使用React Router
        // 或者使用window.location.href
        // window.location.href = '/login';
    };
    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={props.collapsed ? <MenuUnfoldOutlined onClick={ changed}/> : <MenuFoldOutlined onClick={ changed}/>}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div style={{float: 'right', padding: '0 24px'}}>
                <span>欢迎 <span style={{color: '#68aad0'}}>{username}</span>回来</span>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <Avatar
                        style={{
                            backgroundColor: '#68aad0',
                        }}
                        icon={<UserOutlined />}
                    />
                </Dropdown>
            </div>
        </Header>
    )
}

/**
 * 映射Redux全局的state到组件的props上
 * connect(
 *      1. mapStateToProps,
 *      2. mapDispatchToProps,
 * )(被包装的组件)
 */

const mapStateToProps = (state) => {
    return {
        collapsed: state.CollapsedReducer.isCollapsed
    }
}

// 分发 action 的函数
const mapDispatchToProps = {
    changed(){
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)