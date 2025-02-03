import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div
                        key={order.order_id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="space-y-4">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                Order ID: <span className="text-blue-600 dark:text-blue-400">{order.order_id}</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                Product: <span className="font-medium">{order.product}</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                Quantity: <span className="font-medium">{order.quantity}</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                Status: <span className={`font-medium ${order.status === 'delivered' ? 'text-green-600' : order.status === 'shipped' ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {order.status}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;