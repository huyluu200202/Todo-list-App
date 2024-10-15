import { Route, Routes } from 'react-router-dom';
import ItemList from '../components/Item';
import Login from '../components/Login';
import Register from '../components/Register';
import UploadAvatar from '../components/UploadAvatar'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload-avatar" element={<UploadAvatar />} /> 
            <Route path="/" element={<ItemList />} />
        </Routes>
    );
};

export default AppRoutes;
