import React, { useEffect, useState } from 'react'
import ProductCard from 'Components/OtherComponents/ProductCard'
import { message } from 'antd'
import ProductLoader from 'Components/Screen Loader/ProductLoader'

export default function AllProducts() {


    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/product/viewProducts/`, {
                method: "GET",
            })
            const result = await response.json()
            setProducts(result.data)
        } catch (error) {
            message.error("Something went wrong")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])




    return (
        <main>
            <div className="container">
                <div className="row">
                    {
                        isLoading
                            ?
                            <ProductLoader />
                            :
                            <>
                                {
                                    !isLoading && products.length == 0
                                        ?
                                        <h1 className="text-center my-5">
                                            No Products Found
                                        </h1>
                                        :
                                        <>
                                            <h1 className="text-center my-4">
                                                All Products
                                            </h1>
                                            {
                                                products.map((product, index) => {
                                                    return (
                                                        <>
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
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                }
                            </>
                    }
                </div>
            </div>
        </main>
    )
}
