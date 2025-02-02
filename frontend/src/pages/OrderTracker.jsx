import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderTracker = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://order-tracker-flask-react.onrender.com/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (!order) return <div className="text-center mt-8 text-gray-700 dark:text-gray-300">Loading...</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Details</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{order.product}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{order.quantity}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <p className={`mt-1 text-lg font-semibold ${
                                order.status === 'delivered' ? 'text-green-600' :
                                order.status === 'shipped' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                {order.status}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tracking Number</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                {order.shipment?.tracking_number || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;