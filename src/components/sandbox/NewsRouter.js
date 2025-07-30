import {Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "../../router/PrivateRoute";
import Home from "./home/Home";
import UserList from "./user-manage/UserList";
import RoleList from "./right-manage/RoleList";
import RightList from "./right-manage/RightList";
import NotFound from "./notfound/NotFound";
import NewsAdd from "./news-manage/NewsAdd";
import NewsDraft from "./news-manage/NewsDraft";
import NewsCategory from "./news-manage/NewsCategory";
import Audit from "./audit-manage/Audit";
import AuditList from "./audit-manage/AuditList";
import Unpublished from "./publish-manage/Unpublished";
import Published from "./publish-manage/Published";
import Sunset from "./publish-manage/Sunset";
import {useEffect, useState} from "react";
import axios from "axios";
import React from "react";
import NewsUpdate from "./news-manage/NewsUpdate";
import NewsDetail from "./news-manage/NewsDetails";
import {Spin} from "antd";
import {connect} from "react-redux";

const LocalRouteMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/update/:id": NewsUpdate,
    "/news-manage/preview/:id": NewsDetail,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}
function NewsRouter(props) {
    const {rights} = JSON.parse(localStorage.getItem("role"))
    const [backRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        // 并行执行多个异步操作，当所有操作都完成时再进行下一步处理。
        // 确保一组异步任务全部成功，一旦有失败的任务可以立即处理错误
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    // 当前路径存在该路由，且pagepermisson为 1 ,即true，则返回true,修改配置项关闭按钮，就为0，则是false
    function checkRoute(item) {
        return LocalRouteMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    // 当前用户rights中包含item的key值，则返回true，用来检查是否有权限
    function checkUserPermission(item) {
        return rights.includes(item.key);
    }

    return (
        // 加载中时候显示加载图标
        <Spin size="large" spinning={props.isLoading}>
            <Routes>
                {/*在 Routes 中添加一个 Route，其 path 为 /，并使用 Navigate 组件将路径重定向到 /home。*/}
                {/*replace 属性用于替换当前的历史记录条目，而不是添加新的历史记录条目。*/}
                <Route path="/" element={<Navigate to="/home" replace/>}/>
                {backRouteList.map((item) => {
                    if (checkRoute(item) && checkUserPermission(item)) {
                        const Component = LocalRouteMap[item.key];
                        return (
                            <Route
                                key={item.key}
                                path={item.key}
                                element={
                                    <PrivateRoute>
                                        {/* 动态渲染组件 */}
                                        {/*将 LocalRouteMap[item.key] 赋值给一个变量 Component。然后在 JSX 中使用 <Component /> 来渲染组件*/}
                                        {/*也可以使用{LocalRouteMap[item.key] && React.createElement(LocalRouteMap[item.key])}*/}
                                        {Component && <Component/>}
                                    </PrivateRoute>
                                }
                            />
                        );
                    } else {
                        return null;
                    }
                })}

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Spin>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
    }
}

export default  connect(mapStateToProps)(NewsRouter);
