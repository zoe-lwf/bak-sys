// src/news/sandbox/NewsSandBox.js
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import {Layout, theme} from "antd";
import {Content} from "antd/es/layout/layout";
import NewsRouter from "../../components/sandbox/NewsRouter";

export default function NewsSandBox() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout style={{ height: '100vh' }}>
            <SideMenu/>
            <Layout>
                <TopHeader/>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        flex: 1, // 使内容区域自适应剩余空间
                        // minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto', // 添加滚动条以防止内容溢出
                    }}
                >
                    <NewsRouter/>
                </Content>
            </Layout>
        </Layout>
    );
}
