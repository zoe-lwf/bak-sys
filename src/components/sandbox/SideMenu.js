import Sider from "antd/es/layout/Sider";
import {Menu} from "antd";
import {useEffect, useState} from "react";
import "./index.css";
import {
    HomeOutlined,
    UserOutlined,
    SettingFilled,
    ProductOutlined,
    SubnodeOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";

export const SideMenu = () => {
    const [collapsed] = useState(false);
    const [menu, setMenu] = useState([]);
    const iconList = {
        "/home": <HomeOutlined/>,
        "/user-manage": <UserOutlined/>,
        "/right-manage": <SettingFilled/>,
        "/news-manage": <FileTextOutlined/>,
        "/audit-manage": <SubnodeOutlined/>,
        "/publish-manage": <ProductOutlined/>,
    }
    const location = useLocation()
    const openKeys = "/" + location.pathname.split('/')[1]

    useEffect(() => {
        axios.get('/rights?_emded=children').then(res => {
            setMenu(res.data)
        }).catch(error => {
            console.error("Error fetching menu data:", error);
        });

    },[])

    const {rights} = JSON.parse(localStorage.getItem("role"))

    function renderMenu(menu) {
        return menu.map((item) => {
            if(item.pagepermisson !== undefined && item.pagepermisson && rights.includes(item.key) ){
                // 特殊处理首页
                if (item.key === "/home") {
                    return {
                        key: item.key,
                        label: <Link to={item.key}>{item.title}</Link>,
                        icon: iconList[item.key],
                    };
                }
                if (item.children?.length > 0){
                    return {
                        key: item.key,
                        label: item.title,
                        icon: iconList[item.key],
                        children: renderMenu(item.children)
                    }
                }
                return {
                    key: item.key,
                    label: <Link to={item.key}>{item.title}</Link>,
                    icon: iconList[item.key] || null,
                }
            }
            return null; // 确保在所有情况下都返回一个值
        });
    }

    return (
        <Sider className={'sideMenu'} trigger={null} collapsible collapsed={collapsed}>
            <div style={{height: '100%', display: "flex",flexDirection: "column"}}>
                <div className={'logo'}>新闻发布系统</div>
                <div style={{flex: 1, overflowY: 'auto'}}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        // defaultSelectedKeys={[location.pathname]} // 设置默认选中的菜单项 key
                        selectedKeys={[location.pathname]}  //受控组件，确保首页在刷新后仍然高亮
                        defaultOpenKeys={[openKeys]} // 设置默认展开的菜单项
                        items={renderMenu(menu)}
                    />
                </div>
            </div>
        </Sider>
    )
}