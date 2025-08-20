import React, { useState, useEffect } from 'react';
import { useDeatilContext } from 'Context/DetailContext';
import "../../SCSS/Frontend/product-detail.scss";
import { useAuthContext } from 'Context/AuthContext';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from 'Context/CartContext';

export default function ProductDetail() {
    const { productDetail } = useDeatilContext();
    const { isAuth, user } = useAuthContext()
    const { cart, setCart } = useCartContext()

    const [isAdded, setIsAdded] = useState(false)
    const navigate = useNavigate(-1)

    useEffect(() => {
        const existsInCart = cart.some((prod) => (prod.id === productDetail.id || prod._id === productDetail.id));
        if (existsInCart) {
            setIsAdded(true)
        } else {
            setIsAdded(false)
        }
        if (!productDetail) {
            navigate(-1)
        }
    }, [])



    const btnStyle = {
        "--button-bg": productDetail.panelBg,
        "--accent-color": productDetail.bg,
    };


    const handleCart = async () => {
        if (!isAuth) {
            message.error("You are not Logged in")
            navigate("/auth/")
            return
        }
        const existsInCart = cart.some((prod) => (prod._id === productDetail.id || prod.id === productDetail.id));
        if (!existsInCart) {
            try {
                const data = {
                    productId: productDetail.id,
                    userid: user.id
                }
                const response = await fetch(`${process.env.REACT_APP_API_URL}/product/add-to-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                })
                const result = await response.json()
                setCart([...cart, productDetail])
                message.success("Added to cart")
            } catch (error) {
                message.error("Something went wrong")
            }
        } else {
            message.error("Already Added")
        }
    }

    return (
        <main>
            <div className="container my-5">
                <div className="row">
                    <div className="col col-12 col-md-6">
                        <div className="img-container" style={{ background: productDetail.bg }}>
                            <img
                                className="d-block mx-auto"
                                src={productDetail.img}
                                style={{ width: "300px", height: "400px", objectFit: "cover", padding: "10px" }}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="col col-12 col-md-6">
                        <div className="product-details">
                            <h1 className="product-detail-name">{productDetail.name}</h1>
                            <p className="product-detail-description">{productDetail.description}</p>
                            <div className="product-detail-prices">
                                {productDetail.oldPrice ? (
                                    <>
                                        <h1>Discounted Price</h1>
                                        <div className="d-flex justify-content-start align-items-center">
                                            <div className="product-detail-old-price" style={{ textDecoration: "line-through", color: "#837171", fontWeight: "500" }}>
                                                Rs. {productDetail.oldPrice}
                                            </div>
                                            <div className="ms-3 product-detail-price" style={{ color: "#717171", fontWeight: "600", fontSize: "19px" }}>
                                                Rs. {productDetail.price}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="product-detail-price" style={{ color: "#717171", fontWeight: "600", fontSize: "19px" }}>
                                        ${productDetail.price}
                                    </div>
                                )}
                            </div>
                            {
                                isAuth && user.role == "admin" || isAdded
                                    ?
                                    <></>
                                    :
                                    <button className="add-to-cart my-4" style={btnStyle} onClick={handleCart}>
                                        Add To Cart
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
