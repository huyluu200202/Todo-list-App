import { Route, Routes } from 'react-router-dom';
import ItemList from '../components/Item';
import Login from '../components/Login';
import Register from '../components/Register';
import ChangePassword from '../components/ChangePassword';
import ResetPassword from '../components/ResetPassword';
import ForgotPassword from '../components/ForgotPassword';
import UploadAvatar from '../components/UploadAvatar'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/upload-avatar" element={<UploadAvatar />} /> 
            <Route path="/" element={<ItemList />} />
        </Routes>
    );
};

export default AppRoutes;
