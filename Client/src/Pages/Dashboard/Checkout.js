import { message } from 'antd';
import ProductLoader from 'Components/Screen Loader/ProductLoader';
import { useAuthContext } from 'Context/AuthContext';
import { useCartContext } from 'Context/CartContext';
import { useCheckoutContext } from 'Context/CheckOutContext';
import { useProfileContext } from 'Context/ProfileContext';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {


    const { profile, setProfile, fetchData } = useProfileContext()

    const { cart, setCart } = useCartContext();
    const { user } = useAuthContext();
    const { checkoutPrice } = useCheckoutContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [shippingInfo, setShippingInfo] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: user?.email || '',
        phone: profile.contact || '',
        address: profile.address.address || '',
        city: profile.address.city || '',
        state: profile.address.state || '',
        zipCode: profile.address.zipCode || '',
        country: 'United States',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        paymentMethod: 'card',
    });

    const [billingInfo, setBillingInfo] = useState({
        sameAsShipping: true,
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    });

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2);
    };

    const calculateTax = () => {
        const subtotal = parseFloat(calculateTotal());
        return (subtotal * 0.08).toFixed(2);
    };

    const calculateFinalTotal = () => {
        const subtotal = parseFloat(calculateTotal());
        const tax = parseFloat(calculateTax());
        return (subtotal + tax).toFixed(2);
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBillingChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setBillingInfo((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setBillingInfo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        const requiredPaymentFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];

        for (let field of requiredShippingFields) {
            if (!shippingInfo[field]) {
                message.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        for (let field of requiredPaymentFields) {
            if (!paymentInfo[field]) {
                message.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingInfo.email)) {
            message.error('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const validatePayment = () => {
        const { cardNumber, expiryDate, cvv, nameOnCard } = paymentInfo;

        // Validate Card Number (16 digits)
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumber || !cardNumberRegex.test(cardNumber)) {
            message.error("Please enter a valid 16-digit card number.");
            return false;
        }

        // Validate Expiry Date (MM/YY format)
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDate || !expiryDateRegex.test(expiryDate)) {
            message.error("Please enter a valid expiry date (MM/YY).");
            return false;
        }

        // Validate CVV (3 or 4 digits)
        const cvvRegex = /^\d{3,4}$/;
        if (!cvv || !cvvRegex.test(cvv)) {
            message.error("Please enter a valid CVV (3 or 4 digits).");
            return false;
        }

        // Validate Cardholder Name
        if (!nameOnCard) {
            message.error("Please enter the cardholder's name.");
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;
        if (!validatePayment()) return;

        setIsProcessing(true);
        try {
            const orderData = {
                userId: user.id,
                items: cart.map((prod) => {
                    return { id: prod._id, quantity: prod.quantity || 1 };
                }),
                shippingInfo,
                paymentInfo,
                billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
                subtotal: calculateTotal(),
                tax: calculateTax(),
                total: calculateFinalTotal(),
            };


            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (result.success) {
                message.success('Order placed successfully!');
                setCart([]);
                fetchData(user.id);
                navigate('/dashboard/profile');
            } else {
                message.error(result.message || 'Failed to place order');
            }
        } catch (error) {
            message.error('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/dashboard/cart');
        }
    }, [cart, navigate]);

    if (cart != undefined && cart.length === 0) {
        return (
            <div className="checkout-container">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Please add items to your cart before checkout</p>
                    <Link to="/" className="btn btn-primary">
                        <i className="fas fa-arrow-left"></i>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-wrapper">
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1 className="checkout-title">Secure Checkout</h1>
                    <p className="checkout-subtitle">Complete your premium shopping experience</p>
                </div>

                <div className="checkout-content">
                    <div className="checkout-forms">
                        {/* Shipping Information */}
                        <div className="form-section">
                            <h3 className="section-title">Shipping Information</h3>
                            <div className="form-grid">
                                {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'].map((field) => (
                                    <div className="form-group" key={field}>
                                        <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
                                        <input
                                            type={field === 'email' ? 'email' : 'text'}
                                            name={field}
                                            className="form-input"
                                            value={shippingInfo[field]}
                                            onChange={handleShippingChange}
                                        />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <select name="country" className="form-input" value={shippingInfo.country} onChange={handleShippingChange}>
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="form-section">
                            <h3 className="section-title">Payment Information</h3>
                            <div className="payment-methods">
                                {['card', 'paypal'].map((method) => (
                                    <label className="payment-method" key={method}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={paymentInfo.paymentMethod === method}
                                            onChange={handlePaymentChange}
                                        />
                                        <div className="payment-option">
                                            <i className={method === 'card' ? 'fab fa-cc-visa' : 'fab fa-paypal ms-3'}></i>
                                            <span>{method === 'card' ? 'Credit Card' : 'PayPal'}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="number"
                                        name="cardNumber"
                                        minLength={16}
                                        maxLength={16}
                                        className="form-input"
                                        value={paymentInfo.cardNumber}
                                        onChange={handlePaymentChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        className="form-input"
                                        value={paymentInfo.expiryDate}
                                        onChange={handlePaymentChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CVV</label>
                                    <input
                                        type="number"
                                        name="cvv"
                                        minLength={3}
                                        maxLength={4}
                                        className="form-input"
                                        value={paymentInfo.cvv}
                                        onChange={handlePaymentChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="nameOnCard"
                                        className="form-input"
                                        value={paymentInfo.nameOnCard}
                                        onChange={handlePaymentChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="form-section">
                            <h3 className="section-title">Billing Information</h3>
                            <div className="checkbox-container">
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        name="sameAsShipping"
                                        checked={billingInfo.sameAsShipping}
                                        onChange={handleBillingChange}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <span className="checkbox-label">Same as shipping address</span>
                            </div>

                            {!billingInfo.sameAsShipping && (
                                <div className="form-grid">
                                    {['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'].map((field) => (
                                        <div className="form-group" key={field}>
                                            <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                className="form-input"
                                                value={billingInfo[field]}
                                                onChange={handleBillingChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="order-items">
                            {cart.map((product, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        <img src={product.img} alt={product.name} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-name">{product.name}</div>
                                        <div className="item-quantity">Qty: {product.quantity || 1}</div>
                                    </div>
                                    <div className="item-price">Rs.{(product.price * (product.quantity || 1)).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-row">
                            <span>Subtotal ({cart.length} items)</span>
                            <span>Rs.{calculateTotal()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>Rs.{calculateTax()}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>Rs.{calculateFinalTotal()}</span>
                        </div>
                        <button onClick={handlePlaceOrder} className="btn btn-primary" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
