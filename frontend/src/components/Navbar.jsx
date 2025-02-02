import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/orders" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
                    Order Tracker
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link to="/place-order" className="text-lg hover:text-blue-200 transition duration-300">
                        Place Order
                    </Link>
                    <Link to="/orders" className="text-lg hover:text-blue-200 transition duration-300">
                        Order History
                    </Link>
                    <Link to="/change-password" className="text-lg hover:text-blue-200 transition duration-300">
                        Change Password
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="text-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;