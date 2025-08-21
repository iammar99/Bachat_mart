import { message } from 'antd'
import ProductLoader from 'Components/Screen Loader/ProductLoader'
import { useAuthContext } from 'Context/AuthContext'
import { useCartContext } from 'Context/CartContext'
import { useCheckoutContext } from 'Context/CheckOutContext'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Cart() {
    const { cart, setCart } = useCartContext()
    const { user } = useAuthContext()
    const { setCheckoutPrice } = useCheckoutContext()
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        setCart([])
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/product/cart/get/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })
            const result = await response.json()
            setCart(result.data)
        } catch (error) {
            message.error("Something went wrong")
        }
        finally {
            setIsLoading(false)
        }
    }

    const removeFromCart = async (index) => {
        const updatedCart = cart.filter((prod) => prod._id !== index)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/product/cart/${user.id}/remove/${index}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })
            const result = await response.json()
            setCart(updatedCart)
            message.success("Item removed from cart")
        } catch (error) {
            console.log(error)
            message.error("Something went wrong")
        }
    }

    const updateQuantity = (id, index, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id)
            return
        }


        const updatedCart = cart.map((item, i) =>
            i === index ? { ...item, quantity: newQuantity } : item
        )
        setCart(updatedCart)
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2)
    }

    const calculateItemTotal = (price, quantity = 1) => {
        return (price * quantity).toFixed(2)
    }


    const handleCheckOut = () => {
        setCheckoutPrice(calculateTotal())
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="cart-main">
            <div className="cart-header">
                <h1 className="cart-title">
                    <i className="fas fa-shopping-cart cart-icon"></i>
                    Your Shopping Cart
                </h1>
                {
                    !isLoading
                        ?
                        <p className="cart-subtitle">
                            {cart != undefined && cart.length > 0 ? `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
                        </p>
                        :
                        <></>
                }
            </div>

            <div className="cart-container">
                {isLoading ? (
                    <div className="loader-container">
                        <ProductLoader />
                    </div>
                ) : (
                    <>
                        {!isLoading && cart.length === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-cart-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <h2>Your cart is empty</h2>
                                <p>Looks like you haven't added anything to your cart yet</p>
                                <Link to={"/"} className="continue-shopping-btn" >
                                    <i className="fas fa-arrow-left"></i>
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="cart-content">
                                <div className="cart-items">
                                    {cart.map((product, index) => (
                                        <div key={index} className="cart-item">
                                            <div className="item-image">
                                                <img
                                                    src={product.img}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                            </div>

                                            <div className="item-details">
                                                <h3 className="product-name">{product.name}</h3>
                                                <div className="product-price">
                                                    <span className="price-label">Unit Price:</span>
                                                    <span className="price-value">Rs.{product.price}</span>
                                                </div>
                                            </div>

                                            <div className="item-quantity">
                                                <label className="quantity-label">Quantity</label>
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn decrease"
                                                        onClick={() => updateQuantity(product._id, index, (product.quantity || 1) - 1)}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <span className="quantity-value">
                                                        {product.quantity || 1}
                                                    </span>
                                                    <button
                                                        className="quantity-btn increase"
                                                        onClick={() => updateQuantity(product._id, index, (product.quantity || 1) + 1)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="item-total">
                                                <span className="total-label">Total</span>
                                                <span className="total-price">
                                                    Rs.{calculateItemTotal(product.price, product.quantity)}
                                                </span>
                                            </div>

                                            <div className="item-actions">
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(product._id)}
                                                    title="Remove from cart"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="summary-card">
                                        <h3 className="summary-title">Order Summary</h3>

                                        <div className="summary-row">
                                            <span>Subtotal ({cart.length} items)</span>
                                            <span>Rs.{calculateTotal()}</span>
                                        </div>

                                        <div className="summary-row">
                                            <span>Shipping</span>
                                            <span className="free-shipping">Free</span>
                                        </div>

                                        <div className="summary-row">
                                            <span>Tax</span>
                                            <span>Calculated at checkout</span>
                                        </div>

                                        <hr className="summary-divider" />

                                        <div className="summary-row total-row">
                                            <span>Total</span>
                                            <span className="total-amount">Rs.{calculateTotal()}</span>
                                        </div>

                                        <Link to={"/dashboard/checkout"} className="checkout-btn" onClick={handleCheckOut}>
                                            <i className="fas fa-lock"></i>
                                            Proceed to Checkout
                                        </Link>

                                        <Link to={"/"} className="continue-shopping-btn-secondary">
                                            <i className="fas fa-arrow-left"></i>
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}