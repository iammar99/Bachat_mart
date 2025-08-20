import { message } from 'antd';
import { useAuthContext } from 'Context/AuthContext';
import React, { useEffect, useState } from 'react';
import userImg from "../../Assets/default.png"
import { useProfileImageContext } from 'Context/ProfileImageContext';
import { generateInvoice } from 'Components/OtherComponents/InvoiceGenerator';
import { useProfileContext } from 'Context/ProfileContext';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { profile, setProfile } = useProfileContext()
    // State for handling password form
    const [isForm, setIsForm] = useState(false)
    const [updatePasswordState, setUpdatePasswordState] = useState({})


    // State for handleing Profile Data for updation
    const [profileData, setProfileData] = useState({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        contact: profile?.contact || "",
        email: profile?.email || ""
    })
    const { user, setIsAuth } = useAuthContext()
    const { profileImg, setProfileImg } = useProfileImageContext()

    const navigationItems =
        user.role == "admin"
            ?
            [
                { id: 'profile', label: 'Profile Settings', icon: 'fa-user' },
                { id: 'security', label: 'Login & security', icon: 'fa-shield-alt' },
                { id: 'logout', label: 'Log out', icon: 'fa-sign-out-alt' }
            ]
            :
            [
                { id: 'profile', label: 'Profile Settings', icon: 'fa-user' },
                { id: 'orders', label: 'My orders', icon: 'fa-shopping-bag' },
                { id: 'addresses', label: 'Your addresses', icon: 'fa-map-marker-alt' },
                { id: 'security', label: 'Login & security', icon: 'fa-shield-alt' },
                { id: 'logout', label: 'Log out', icon: 'fa-sign-out-alt' }
            ]


    // For Logging Out

    const handleLogout = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, {
            method: "GET",
            credentials: "include"
        })
        const result = await response.json()
        if (result.success) {
            message.success(result.message)
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            setIsAuth(false)
            setProfile({})
            setProfileImg(null)
        }
        else {
            message.error(result.message)
        }
    }

    // For handling data

    const handleImg = async (e) => {
        const previewUrl = URL.createObjectURL(e.target.files[0]);
        setProfileImg(previewUrl)

        const formData = new FormData();
        formData.append('profile', e.target.files[0]);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/${user.id}/img`, {
                method: "POST",
                credentials: "include",
                body: formData
            })
            const result = await response.json()
            if (result.success) {
                message.success("Profile Pic Updated")
            }
        } catch (error) {
            console.error(error)
        }
    }

    // For handling Profile data    

    const handleProfileChange = async (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value })
    }

    // For Submitting Profile data

    const submitProfile = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/update/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(profileData)
            })
            const result = await response.json()
            if (result.success) {
                message.success(result.message)
                setProfile({
                    ...profile,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    contact: profileData.contact,
                    email: profileData.email
                })
            }
            else {
                message.success("Something went wrong")
            }
        } catch (error) {
            message.error("something went Wrong")
        }
    }


    const handleTabChange = (tabId) => {
        if (tabId === 'logout') {
            handleLogout();
            return;
        }
        setActiveTab(tabId);
        setSidebarOpen(false);
    };

    const renderProfileContent = () => (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-avatar" style={{ "position": "relative" }}>
                    <img src={profileImg || userImg} style={{ "width": "-webkit-fill-available" }} alt="" />
                    <label htmlFor="profile">
                        <i className="fa-solid fa-pencil" style={{ "cursor": "pointer", "fontSize": "16px", "position": "absolute", "right": "0", "top": "5px" }} ></i>
                    </label>
                    <input type="file" name="profile" id="profile" className='d-none' onChange={handleImg} />
                </div>
                <div className="profile-info">
                    <h2>{profile.username}</h2>
                    <p>Member since November 2023</p>
                </div>
                {/* <button className="edit-profile-btn">
                    <i className="fas fa-edit"></i>
                    <span>Edit Profile</span>
                </button> */}
            </div>

            <div className="profile-form">
                <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" onChange={handleProfileChange} name="firstName" defaultValue={profile.firstName} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" onChange={handleProfileChange} name="lastName" defaultValue={profile.lastName} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" onChange={handleProfileChange} name="email" defaultValue={profile.email} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" onChange={handleProfileChange} name="contact" defaultValue={profile.contact} />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="save-btn" onClick={submitProfile}>Save Changes</button>
                    {/* <button className="cancel-btn">Cancel</button> */}
                </div>
            </div>
        </div>
    );

    const renderOrdersContent = () => (
        <div className="orders-content">
            {
                profile.orders.length == 0
                    ?
                    <h1 className="my-4 text-center fw-bold">
                        You have no orders yet
                    </h1>
                    :
                    <>
                        {profile.orders?.map((order) => {
                            const orderId = String(order._id).slice(-8);
                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });

                            const invoiceDate = new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            return (
                                <div key={order._id} className="order-wrapper">
                                    {/* Visible Order Card */}
                                    <div className="order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <h3>Order #: {orderId}</h3>
                                                <p>{order.items.length} Products | By {profile.username} | {orderDate}</p>
                                            </div>
                                            <div className="order-actions">
                                                <button
                                                    className="download-btn"
                                                    onClick={() => generateInvoice(order)}
                                                >
                                                    <i className="fas fa-download"></i>
                                                    <span>Download invoice</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="order-details">
                                            <div className="detail-row">
                                                <span className="label">Status:</span>
                                                <span className="status on-way">{order.status}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Order Date:</span>
                                                <span>{orderDate}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Delivered to:</span>
                                                <span>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Subtotal:</span>
                                                <span>${order.subtotal}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Tax:</span>
                                                <span>${order.tax}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Total:</span>
                                                <span className="total">${order.total}</span>
                                            </div>
                                        </div>

                                        <div className="order-items">
                                            {order.items.map((orderItem, index) => {
                                                const item = orderItem.id;

                                                return (
                                                    <div key={index} className="order-item">
                                                        <div className="item-image">
                                                            <img
                                                                src={item.img}
                                                                alt={item?.name || 'Product'}
                                                                style={{
                                                                    width: '80px',
                                                                    height: '80px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="item-details">
                                                            <h4>{item?.name || 'Product Name'}</h4>
                                                            <p>Quantity: {orderItem.quantity}</p>
                                                            <p>Price: ${item?.price || 'N/A'}</p>
                                                            {item?.color && <p>Color: {item.color}</p>}
                                                            {item?.size && <p>Size: {item.size}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Beautiful Hidden Invoice Template */}
                                    <div id={`invoice-${order._id}`} className="invoice-template">
                                        {/* Invoice Header */}
                                        <div className="invoice-header">
                                            <div className="company-info">
                                                <h1 className="company-name">LuxeFits</h1>
                                                <div className="company-details">
                                                    <p>123 Business Street</p>
                                                    <p>City, State 12345</p>
                                                    <p>Phone: (555) 123-4567</p>
                                                    <p>Email: info@luxefits.com</p>
                                                </div>
                                            </div>
                                            <div className="invoice-info">
                                                <h2>INVOICE</h2>
                                                <div className="invoice-details">
                                                    <p><strong>Invoice #:</strong> INV-{orderId}</p>
                                                    <p><strong>Order #:</strong> {orderId}</p>
                                                    <p><strong>Invoice Date:</strong> {invoiceDate}</p>
                                                    <p><strong>Order Date:</strong> {orderDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bill To & Ship To */}
                                        <div className="billing-shipping">
                                            <div className="billing-info">
                                                <h3>BILL TO:</h3>
                                                <div className="address-details">
                                                    <p className="name">
                                                        {order.billingInfo.firstName} {order.billingInfo.lastName}
                                                    </p>
                                                    <p>{order.billingInfo.address}</p>
                                                    <p>
                                                        {order.billingInfo.city}, {order.billingInfo.state} {order.billingInfo.zipCode}
                                                    </p>
                                                    <p>{order.billingInfo.country}</p>
                                                </div>
                                            </div>
                                            <div className="shipping-info">
                                                <h3>SHIP TO:</h3>
                                                <div className="address-details">
                                                    <p className="name">
                                                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                                    </p>
                                                    <p>{order.shippingInfo.address}</p>
                                                    <p>
                                                        {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                                                    </p>
                                                    <p>{order.shippingInfo.country}</p>
                                                    <p>Phone: {order.shippingInfo.phone}</p>
                                                    <p>Email: {order.shippingInfo.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        <div className="items-section">
                                            <table className="items-table">
                                                <thead>
                                                    <tr>
                                                        <th className="item-desc">Item Description</th>
                                                        <th className="item-qty">Qty</th>
                                                        <th className="item-price">Unit Price</th>
                                                        <th className="item-total">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((orderItem, index) => {
                                                        const item = orderItem.id;
                                                        const itemTotal = (parseFloat(item?.price || 0) * orderItem.quantity).toFixed(2);

                                                        return (
                                                            <tr key={index}>
                                                                <td className="item-desc">
                                                                    <div className="item-name">
                                                                        {item?.name || 'Product Name'}
                                                                    </div>
                                                                    {item?.color && (
                                                                        <div className="item-attribute">
                                                                            Color: {item.color}
                                                                        </div>
                                                                    )}
                                                                    {item?.size && (
                                                                        <div className="item-attribute">
                                                                            Size: {item.size}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="item-qty">
                                                                    {orderItem.quantity}
                                                                </td>
                                                                <td className="item-price">
                                                                    ${item?.price || '0.00'}
                                                                </td>
                                                                <td className="item-total">
                                                                    ${itemTotal}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Totals */}
                                        <div className="totals-section">
                                            <div className="totals-table">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="total-label">
                                                                <strong>Subtotal:</strong>
                                                            </td>
                                                            <td className="total-value">
                                                                ${order.subtotal}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="total-label">
                                                                <strong>Tax:</strong>
                                                            </td>
                                                            <td className="total-value">
                                                                ${order.tax}
                                                            </td>
                                                        </tr>
                                                        <tr className="grand-total">
                                                            <td className="total-label">
                                                                TOTAL:
                                                            </td>
                                                            <td className="total-value">
                                                                ${order.total}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="payment-section">
                                            <h3>PAYMENT INFORMATION:</h3>
                                            <div className="payment-details">
                                                <p>
                                                    <strong>Payment Method:</strong> {order.paymentInfo.paymentMethod === 'card' ? 'Credit Card' : order.paymentInfo.paymentMethod}
                                                </p>
                                                <p>
                                                    <strong>Card:</strong> ****-****-****-{order.paymentInfo.cardNumber.slice(-4)}
                                                </p>
                                                <p>
                                                    <strong>Cardholder:</strong> {order.paymentInfo.nameOnCard}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="invoice-footer">
                                            <p>
                                                Thank you for your business! If you have any questions about this invoice,
                                                please contact us at info@luxefits.com or (555) 123-4567.
                                            </p>
                                            <p>
                                                <strong>Terms & Conditions:</strong> Payment is due within 30 days.
                                                Late payments may be subject to a service charge.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
            }
        </div>
    );

    const renderAddressesContent = () => (
        <div className="addresses-content">
            <div className="section-header">
                <h2>Your Addresses</h2>
                {/* <button className="add-btn">
                    <i className="fas fa-plus"></i>
                    <span>Add New Address</span>
                </button> */}
            </div>

            <div className="addresses-grid">
                <div className="address-card">
                    <div className="address-header">
                        <h3>Home</h3>
                        {/* <div className="address-actions">
                            <button className="edit-btn"><i className="fas fa-edit"></i></button>
                            <button className="delete-btn"><i className="fas fa-trash"></i></button>
                        </div> */}
                    </div>
                    <div className="address-content">
                        <p><strong>{profile.firstName + " " + profile.lastName}</strong></p>
                        <p>{profile.address.address}</p>
                        <p>{profile.address.state}</p>
                        <p>{profile.address.country}</p>
                        <p>Phone: {profile.contact}</p>
                    </div>
                    <div className="address-badges">
                        <span className="badge default">Default</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityContent = () => {


        const btnStyle = {
            "cursor": "pointer",
            "fontWeight": "500",
            "transition": "all 0.2s ease",
            "padding": "8px 16px",
            "background": "#f8fafc",
            "border": "1px solid #e2e8f0",
            "color": "#475569",
            "fontSize": "14px"
        }


        // For displaying form

        const handleShowForm = () => {
            setIsForm(!isForm)
        }

        // For handling input

        const handleUpdatePasswordChange = (e) => {
            setUpdatePasswordState({ ...updatePasswordState, [e.target.name]: e.target.value })
        }

        // For handling button click


        const handleUpdatePassword = async (e) => {
            e.preventDefault()
            const { confirmPassword, newPassword, oldPassword } = updatePasswordState

            if (!confirmPassword || !newPassword || !oldPassword) {
                message.error("Please fill all fields")
                return
            }
            if (newPassword != confirmPassword) {
                message.error("New Passwords doesn't matched")
                return
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/updatePassword/${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(updatePasswordState)
                })
                const result = await response.json()
                if (result.success) {
                    message.success(result.message)
                    setIsForm(false)
                }
                else {
                    message.error(result.message)
                }
            } catch (error) {
                console.error(error)
                message.error("Something went wrong ! Try again later")
            }
        }
        return (
            <>
                <div className="security-content">
                    <div className="security-section">
                        <h3>Password & Authentication</h3>
                        <div className="security-item">
                            <div className="security-info">
                                <h4>Password</h4>
                            </div>
                            <button className="change-btn" onClick={handleShowForm}>
                                {
                                    isForm
                                        ?
                                        "Cancel"
                                        :
                                        "Change Password"
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <form className={`d-${isForm ? "block" : "none"} p-5`} style={{ "background": "#ffffff", "borderRadius": "12px", "boxShadow": "0 2px 10px rgba(0, 0, 0, 0.05)", "padding": "30px", "marginBottom": "25px" }}>
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                        <input type="password" className="form-control" onChange={handleUpdatePasswordChange} name='oldPassword' id="oldPassword" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input type="password" className="form-control" onChange={handleUpdatePasswordChange} name='newPassword' id="newPassword" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" onChange={handleUpdatePasswordChange} name='confirmPassword' id="confirmPassword" />
                    </div>
                    <button style={btnStyle} onClick={handleUpdatePassword}>
                        Update  Password
                    </button>
                </form>
            </>
        )
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileContent();
            case 'orders':
                return renderOrdersContent();
            case 'addresses':
                return renderAddressesContent();
            case 'security':
                return renderSecurityContent();
            default:
                renderProfileContent();
        }
    };

    return (
        <div className="account-page">
            {/* Mobile Header */}
            <div className="mobile-header">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h1>My Account</h1>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

            <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h2>My Account</h2>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav className="nav-menu">
                    {navigationItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(item.id)}
                        >
                            <i className={`fas ${item.icon} nav-icon`}></i>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

