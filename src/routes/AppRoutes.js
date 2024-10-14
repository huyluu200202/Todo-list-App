// src/routes/AppRoutes.js
import { Route, Routes } from 'react-router-dom';
import ItemList from '../components/Item';
import Login from '../components/Login';
import Register from '../components/Register';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ItemList />} />
        </Routes>
    );
};

export default AppRoutes;
