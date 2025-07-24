// src/router/IndexRouter.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsSandBox from "../news/sandbox/NewsSandBox";
import Login from "../news/login/Login";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../components/sandbox/notfound/NotFound";
import News from "../news/views/News";
import Details from "../news/views/Details";

export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 使用 PrivateRoute 来保护 NewsSandBox 路由 */}
                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <NewsSandBox />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/news" element={<News />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
