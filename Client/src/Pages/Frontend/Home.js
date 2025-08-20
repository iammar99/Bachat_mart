import { message } from 'antd';
import ProductCard from 'Components/OtherComponents/ProductCard';
import { useAuthContext } from 'Context/AuthContext'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import img from "../../Assets/about-us.jpeg"
// import more_about from "../../Assets/more.jpeg"

export default function Home() {

  const { isAuth } = useAuthContext()
  const [activeCategory, setActiveCategory] = useState('men');


  const [products, setProducts] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/product/viewProducts/${activeCategory}`, {
        method: "GET",
      })
      const result = await response.json()
      setProducts(result.data)
    } catch (error) {
      message.error("Something Went Wrong Please Comeback Later")
    }
    finally {
    }

  }

  useEffect(() => {
    fetchData()
  }, [activeCategory])





  return (
    <main>
      {/* -------------- Hero Section -------------- */}
      <div className="bottom-nav d-flex align-items-center">
      </div>

      {/* --------------Popular Products -------------- */}

      <div className="container">
        <div className="row">
          <h1 className="text-center my-5" style={{ "fontSize": "45px", "fontWeight": "700" }}>
            Popular Products
          </h1>
          {/* <nav className='mx-auto d-flex justify-content-center'>
            <Link
              className={`popular-products-navbar ${activeCategory === 'men' ? 'active' : ''}`}
              onClick={() => setActiveCategory('men')}
              style={{ "borderRadius": "5px 0px 0px 5px" }}
            >
              Men
            </Link>
            <Link
              className={`popular-products-navbar ${activeCategory === 'women' ? 'active' : ''}`}
              onClick={() => setActiveCategory('women')}
            >
              Women
            </Link>
            <Link
              className={`popular-products-navbar ${activeCategory === 'kid' ? 'active' : ''}`}
              onClick={() => setActiveCategory('kid')}
              style={{ "borderRadius": "0px 5px 5px 0px" }}
            >
              Kid
            </Link>
          </nav> */}
          {products.slice(0, 3).map((product, index) => (
            <div key={index} className="col">
              <ProductCard
                img={product.img}
                id={product._id}
                description={product.description}
                name={product.name}
                category={product.category}
                panelBg={product.panelBg}
                bg={product.bg}
                price={product.price}
                oldPrice={product.oldPrice}
              />
            </div>
          ))}
        </div>
        <Link to={`/all-product`} className="home-btn">
          View All Products
        </Link>
      </div>

    </main>
  )
}
