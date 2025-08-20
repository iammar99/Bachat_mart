import React, { useEffect, useState } from 'react'
import { useAuthContext } from 'Context/AuthContext'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDeatilContext } from 'Context/DetailContext';
import { useCartContext } from 'Context/CartContext';

export default function ProductCard(props) {

    // ------------------ Contexts ------------------
    const { isAuth, user } = useAuthContext()
    const { setProductDetail } = useDeatilContext()
    const { cart, setCart } = useCartContext()

    // ------------------ Check cart ------------------

    const [isAdded, setIsAdded] = useState(false)

    useEffect(() => {
        const existsInCart = cart.some((prod) => (prod.id === props.id || prod._id === props.id));
        if (existsInCart) {
            setIsAdded(true)
        } else {
            setIsAdded(false)
        }
    }, [cart])

    const navigate = useNavigate();

    function getContrastingTextColor(bgColor) {
        const rgb = bgColor.match(/\d+/g);
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        return luminance > 0.5 ? 'black' : 'white';
    }

    const handleCart = async (product,e) => {
        e.stopPropagation()
        if (!isAuth) {
            message.warning("You are not Logged in")
            navigate("/auth/");
            return
        }
        const existsInCart = cart.some((prod) => (prod._id === product.id || prod.id === product.id));
        if (!existsInCart) {
            try {
                const data = {
                    productId: product.id,
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
                setCart([...cart, product])
                message.success("Added to cart")
            } catch (error) {
                message.error("Something went wrong")
            }
        } else {
            message.error("Already Added")
        }
    }

    const handleDetail = (product) => {
        setProductDetail(product)
        navigate("/products-detail")
    }


    return (
        <div className='product-card my-5'  onClick={() => { handleDetail(props) }}>
            <div className="img-container" style={{ backgroundColor: props.bg }}>
                <img src={props.img} alt="" style={{ "width": "200px" }} className="product-img d-block mx-auto" />
            </div>
            <div className="product-info px-3 py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: props.panelBg }}>
                <div>
                    <div className="product-name">
                        {props.name}
                    </div>
                    <div className="product-category" style={{ color: getContrastingTextColor(props.panelBg) }}>
                        {props.category.toUpperCase()} Wear
                    </div>
                    <div className="prices d-flex justify-content-between w-50">
                        <div className="product-price">
                            ${props.price}
                        </div>
                        <div className="old-price ms-3" style={{ "textDecoration": "line-through" }}>
                            {
                                props.oldPrice ? "$" + props.oldPrice : ""
                            }
                        </div>
                    </div>
                </div>
                {
                    isAuth && user.role == "admin" || isAdded
                        ?
                        <></>
                        :
                        <button className="cart-btn" onClick={(e) => { handleCart(props,e) }}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                }
            </div>
        </div>
    )
}
