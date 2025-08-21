import { message } from 'antd';
import { useProfileContext } from 'Context/ProfileContext';
import React, { useEffect, useState } from 'react';

export default function AdminOrdersView() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchData : fetchProfileData} = useProfileContext()

    const statusOptions = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            const result = await response.json();
            
            if (result.success) {
                setOrders(result.data);
            } else {
                console.log("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            console.log("Something went wrong while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <i className="fas fa-clock"></i>;
            case 'Processing': return <i className="fas fa-cogs"></i>;
            case 'Shipped': return <i className="fas fa-shipping-fast"></i>;
            case 'Completed': return <i className="fas fa-check-circle"></i>;
            case 'Cancelled': return <i className="fas fa-times-circle"></i>;
            default: return <i className="fas fa-clock"></i>;
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/orders/${orderId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();
            if (result.success) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                message.success("Order status updated successfully");
            } else {
                message.error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            message.error("Something went wrong");
        }
        setEditingOrder(null);
    };

    const deleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/orders/${orderId}/delete`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                });

                const result = await response.json();
                if (result.success) {
                    setOrders(orders.filter(order => order._id !== orderId));
                    message.success("Order deleted successfully");
                } else {
                    message.error("Failed to delete order");
                }
            } catch (error) {
                console.error("Error deleting order:", error);
                message.error("Something went wrong");
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getOrderStats = () => {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const processing = orders.filter(o => o.status === 'processing').length;
        const completed = orders.filter(o => o.status === 'completed').length;
        return { total, pending, processing, completed };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <div className="admin-orders-container">
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders-container">
            {/* Header */}
            <div className="admin-orders-header">
                <h1 className="title">Order Management</h1>
                <p className="subtitle">Monitor and manage customer orders, update status, and track fulfillment</p>
            </div>

            {/* Statistics */}
            <div className="admin-orders-stats">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.processing}</div>
                    <div className="stat-label">Processing</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Controls */}
            <div className="admin-orders-controls">
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All Status</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Orders List */}
            <div className="orders-list">
                {filteredOrders.length === 0 ? (
                    <div className="no-orders">
                        No orders found matching your criteria.
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id} className="order-card">
                            {/* Order Header */}
                            <div className="order-header">
                                <div className="order-info">
                                    <div className="order-id">Order #: {order._id.slice(-8)}</div>
                                    <div className="order-meta">
                                        Customer: {order.shippingInfo?.firstName} {order.shippingInfo?.lastName} | {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="status-container">
                                    <div className={`status-badge ${order.status?.toLowerCase() || 'default'}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status || 'Pending'}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="order-details">
                                {/* Shipping Information */}
                                <div className="detail-section">
                                    <div className="detail-label">Shipping Address:</div>
                                    <div className="detail-value">
                                        {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}<br />
                                        {order.shippingInfo?.address}<br />
                                        {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}<br />
                                        {order.shippingInfo?.country}<br />
                                        <strong>Email:</strong> {order.shippingInfo?.email}<br />
                                        <strong>Phone:</strong> {order.shippingInfo?.phone}
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="detail-section">
                                    <div className="detail-label">Products:</div>
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="product-item">
                                            <div className="product-image">
                                                {item.img ? (
                                                    <img src={item.img} alt={item.name} />
                                                ) : (
                                                    <i className="fas fa-image"></i>
                                                )}
                                            </div>
                                            <div className="product-info">
                                                <div className="product-name">{item.name}</div>
                                                <div className="product-details">
                                                    Quantity: {item.quantity} | Price: ${item.price}
                                                    {item.category && ` | Category: ${item.category}`}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="detail-section">
                                    <div className="detail-label">Order Summary:</div>
                                    <div className="price-info">
                                        <div className="price-item">
                                            <span>Subtotal:</span>
                                            <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="price-item">
                                            <span>Tax:</span>
                                            <span>${parseFloat(order.tax || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="price-item total-price">
                                            <span>Total:</span>
                                            <span>${parseFloat(order.total || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="detail-section">
                                    <div className="detail-label">Payment Information:</div>
                                    <div className="detail-value">
                                        <strong>Method:</strong> {order.paymentInfo?.paymentMethod || 'N/A'}<br />
                                        <strong>Name on Card:</strong> {order.paymentInfo?.nameOnCard || 'N/A'}<br />
                                        <strong>Card Number:</strong> ****{order.paymentInfo?.cardNumber?.slice(-4) || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            <div className="order-actions">
                                {editingOrder === order._id ? (
                                    <>
                                        <select
                                            value={order.status || 'Pending'}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="status-select"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setEditingOrder(null)}
                                            className="btn cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setEditingOrder(order._id)}
                                            className="btn edit-btn"
                                        >
                                            <i className="fas fa-edit"></i>
                                            Update Status
                                        </button>

                                        {order.status === 'completed' && (
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="btn delete-btn"
                                            >
                                                <i className="fas fa-trash"></i>
                                                Delete Order
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}