import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const { user } = useSelector(state => state.UserSlice);
    const { pathname } = useLocation();

    // nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập, đăng nhập thành công thì back về trang cũ
    if (!user) {
        return <Navigate to={`/user/sign-in?redirectUrl=${pathname}`} replace />;
    }
    return children;
}

export default ProtectedRoute