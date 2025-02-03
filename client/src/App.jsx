import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PlaceOrder from './pages/PlaceOrder';
import OrderTracker from './pages/OrderTracker';
import OrderHistory from './pages/OrderHistory';
import EditOrder from './pages/EditOrder';
import ChangePassword from './pages/ChangePassword';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/orders/:orderId" element={<OrderTracker />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:orderId/edit" element={<EditOrder />} />
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
        </Router>
    );
};

export default App;