import { message } from 'antd';
import ProductCard from 'Components/OtherComponents/ProductCard';
import React, { useState, useEffect } from 'react';
import AdminOrdersView from 'Components/OtherComponents/AdminView';

const Admin = () => {
    const [activeSection, setActiveSection] = useState('add product');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);




    // ----------------------- Add Products -----------------------

    const [product, setProduct] = useState({})
    const [order, setOrder] = useState({})

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }


    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setProduct({
                ...product,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setProduct({ ...product, [e.target.name]: e.target.value })
        }
    }

    const handleProductAdd = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        try {
            const { name, img, category, oldPrice, price, bg, panelBg, description } = product
            if (!name || !img || !category || !price || !bg || !panelBg || description) {
                message.error("Please Fill all inputs")
                return
            }

            formData.append('name', name);
            formData.append('category', category);
            formData.append('price', price);
            formData.append('oldPrice', oldPrice || '');
            formData.append('bg', bg);
            formData.append('panelBg', panelBg);
            formData.append('img', img);
            formData.append('description', description);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/add-products`, {
                method: "POST",
                credentials: "include",
                body: formData
            });



            const result = await response.json()

            if (result.success) {
                message.success(result.message)
            }
            else {
                message.error(result.message)
            }
        } catch (error) {
            message.error("Something went wrong")
        }
        finally {
            for (let key of formData.keys()) {
                formData.delete(key);
            }
        }
    }



    const [products, setProducts] = useState([])

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/viewProducts`, {
                method: "GET",
            })
            const result = await response.json()
            setProducts(result.data)
        } catch (error) {
            message.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchData()
    }, [activeSection])


    const colors = {
        primary: '#e2e8f0',
        secondary: '#6c7c8f',
        accent: '#84a3b8',
        text: '#44607a'
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {

        const contentStyle = {
            padding: isMobile ? '15px' : '30px',
            maxWidth: '100%'
        };

        const cardStyle = {
            background: colors.primary,
            padding: isMobile ? '20px' : '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(68, 96, 122, 0.1)',
            border: `1px solid ${colors.primary}`,
            width: '100%',
            boxSizing: 'border-box'
        };

        const titleStyle = {
            color: colors.text,
            marginBottom: '30px',
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: '300'
        };

        const textStyle = {
            color: colors.secondary,
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.6'
        };

        switch (activeSection) {
            // Add Product
            case 'add product':
                return (
                    <div style={contentStyle}>
                        <h2 style={titleStyle}>Add New Product</h2>
                        <div style={cardStyle}>
                            <p style={textStyle}>
                                Create and configure new products for your store. Add detailed information, pricing, and inventory details.
                            </p>
                            <form className="product-form" encType="multipart/form-data">
                                <div className="form-wrapper">
                                    <h2 className="form-heading">Add Product Details</h2>
                                    <div className="input-group">
                                        <label htmlFor="productName" className="input-label">
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            id="productName"
                                            placeholder="Enter product name"
                                            required=""
                                            onChange={handleChange}
                                            name='name'
                                        />
                                    </div>
                                    <div className="form-floating">
                                        <textarea
                                            className="form-control"
                                            placeholder="Leave a comment here"
                                            id="floatingTextarea"
                                            defaultValue={""}
                                            name='description'
                                            onChange={handleChange}
                                            onInput={autoResize}
                                        />
                                        <label htmlFor="floatingTextarea">Comments</label>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="productImage" className="input-label">
                                            Product Image URL
                                        </label>
                                        <input
                                            type="file"
                                            className="input-field"
                                            id="productImage"
                                            placeholder="Enter image URL"
                                            required=""
                                            onChange={handleChange}
                                            name='img'
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="category" className="input-label">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            id="category"
                                            placeholder="Enter product category"
                                            required=""
                                            onChange={handleChange}
                                            name='category'
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="price" className="input-label">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            id="price"
                                            placeholder="Enter product price"
                                            required=""
                                            onChange={handleChange}
                                            name='price'
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="oldPrice" className="input-label">
                                            Old Price (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            id="oldPrice"
                                            placeholder="Enter old price (optional)"
                                            onChange={handleChange}
                                            name='oldPrice'
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="backgroundColor" className="input-label">
                                            Background Color
                                        </label>
                                        <input
                                            type="color"
                                            className="color-picker"
                                            id="backgroundColor"
                                            defaultValue="#ffffff"
                                            onChange={handleChange}
                                            name='bg'
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="panelBackgroundColor" className="input-label">
                                            Panel Background Color
                                        </label>
                                        <input
                                            type="color"
                                            className="color-picker"
                                            id="panelBackgroundColor"
                                            defaultValue="#e2e8f0"
                                            onChange={handleChange}
                                            name='panelBg'
                                        />
                                    </div>
                                    <button type="submit" className="submit-button" onClick={handleProductAdd}>
                                        Submit
                                    </button>
                                </div>
                            </form>



                        </div>
                    </div>
                );
            // View Product
            case 'edit product':
                return (
                    <div style={contentStyle}>
                        <h2 style={titleStyle}>Edit Products</h2>
                        <div style={cardStyle}>
                            <p style={textStyle}>
                                Modify existing products, update pricing, inventory levels, and product descriptions.
                            </p>
                            <div className="container">
                                <div className="row">
                                    {
                                        products.length == 0
                                            ?
                                            <h1 className='text-center my-5'>
                                                There is no Products Available
                                            </h1>
                                            :
                                            products.map((product, index) => {
                                                return (
                                                    <>
                                                        <div className="col">
                                                            <ProductCard
                                                                key={index}
                                                                id={product._id}
                                                                description={product.description}
                                                                img={product.img}
                                                                name={product.name}
                                                                category={product.category}
                                                                panelBg={product.panelBg}
                                                                bg={product.bg}
                                                                price={product.price}
                                                                oldPrice={product.oldPrice}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                );
            // View Orders
            case 'view orders':
                return <AdminOrdersView />
            // return (
            //     <div style={contentStyle}>
            //         <h2 style={titleStyle}>Order Management</h2>
            //         <div style={cardStyle}>
            //             <p style={textStyle}>
            //                 Monitor and manage customer orders, track fulfillment status, and handle order processing.
            //             </p>
            //             <div style={{
            //                 marginTop: '20px',
            //                 padding: '20px',
            //                 background: colors.primary,
            //                 borderRadius: '8px',
            //                 borderLeft: `4px solid ${colors.accent}`
            //             }}>
            //                 <span style={{
            //                     color: colors.text,
            //                     fontSize: isMobile ? '12px' : '14px'
            //                 }}>
            //                     📊 Order tracking dashboard will be implemented here
            //                 </span>
            //             </div>
            //         </div>
            //     </div>
            // );
            default:
                return (
                    <div style={contentStyle}>
                        <h2 style={titleStyle}>Welcome to Admin Dashboard</h2>
                        <p style={textStyle}>Select an option from the sidebar to get started</p>
                    </div>
                );
        }
    };

    const handleMenuClick = (section) => {
        setActiveSection(section);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: colors.primary,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        zIndex: 100,
                        background: colors.accent,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    ☰
                </button>
            )}

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                />
            )}

            {/* Left Sidebar */}
            <div style={{
                width: '280px',
                minWidth: '280px',
                background: 'white',
                boxShadow: '2px 0 15px rgba(68, 96, 122, 0.1)',
                borderRight: `1px solid ${colors.primary}`,
                position: isMobile ? 'fixed' : 'static',
                left: isMobile ? (sidebarOpen ? '0' : '-280px') : '0',
                top: 0,
                height: '100vh',
                zIndex: 1000,
                transition: 'left 0.3s ease',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Sidebar Header */}
                <div style={{
                    padding: isMobile ? '20px' : '30px 25px',
                    borderBottom: `1px solid ${colors.primary}`,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                    flexShrink: 0
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{
                                margin: 0,
                                color: 'white',
                                fontSize: isMobile ? '18px' : '20px',
                                fontWeight: '400',
                                letterSpacing: '0.5px'
                            }}>
                                Admin Panel
                            </h3>
                            <p style={{
                                margin: '5px 0 0 0',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: isMobile ? '11px' : '12px'
                            }}>
                                Dashboard Control
                            </p>
                        </div>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    padding: '5px 8px'
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{
                    padding: '20px 0',
                    flex: 1
                }}>
                    {[
                        { key: 'add product', label: 'Add Product', icon: '➕' },
                        { key: 'edit product', label: 'Edit Product', icon: '✏️' },
                        { key: 'view orders', label: 'View Orders', icon: '📋' }
                    ].map((item) => (
                        <div
                            key={item.key}
                            style={{
                                padding: isMobile ? '12px 20px' : '15px 25px',
                                margin: '2px 15px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                background: activeSection === item.key ? `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})` : 'transparent',
                                color: activeSection === item.key ? 'white' : colors.text,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: isMobile ? '14px' : '15px',
                                fontWeight: activeSection === item.key ? '500' : '400'
                            }}
                            onClick={() => handleMenuClick(item.key)}
                            onMouseEnter={(e) => {
                                if (activeSection !== item.key) {
                                    e.target.style.background = colors.primary;
                                    e.target.style.transform = 'translateX(5px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeSection !== item.key) {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            <span style={{
                                marginRight: '12px',
                                fontSize: isMobile ? '14px' : '16px'
                            }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div style={{
                    padding: '15px 25px 20px',
                    background: colors.primary,
                    borderRadius: '0',
                    textAlign: 'center',
                    flexShrink: 0,
                    marginBottom: "30px"
                }}>
                    <span style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: colors.secondary,
                        fontWeight: '500'
                    }}>
                        Admin Dashboard v1.0
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                background: "white",
                overflow: 'auto',
                paddingTop: isMobile ? '60px' : '0',
                width: isMobile ? '100%' : 'calc(100% - 280px)',
                minHeight: '100vh'
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;