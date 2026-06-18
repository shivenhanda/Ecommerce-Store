import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FetchProducts from "./api/FetchProducts"

export default function ProductList({search}) {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const itemPerPage = 14
    const totalPages = Math.ceil(products.length / itemPerPage)
    const navigate = useNavigate();

    products=products.filter((product)=>
        product.title.toLowerCase().includes(search.toLowerCase())
    )
    useEffect(() => {
        async function getProducts() {
            const data = await FetchProducts()
            setProducts(data)
        }
        getProducts();
    }, [])
    function pageHandle(value) {
        if (value < 1 || value > totalPages) {
            return;
        }
        setPage(value)
    }
    return (
        <>
            {
                products.length > 0 &&
                <div className="products">
                    {products.slice((page - 1) * itemPerPage, page * itemPerPage).map((item) => {
                        return <div key={item.id} className="singleproduct" onClick={() => navigate(`/product/${item.id}`)}>
                            
                            <img src={item.thumbnail} alt={item.id} />
                            <span className="ratings text-base md:text-lg">
                                <i className="fa-regular fa-star"></i> {item.rating}</span>
                            <span className="text-base md:text-lg">{item.title}</span>
                        </div>
                    })}
                </div>
            }
            {
                products.length > 0 &&
                <div className="pagination">
                    <span className={page === 1 ? "disabledPage" : ""} onClick={() => pageHandle(page - 1)}><i className="fa-solid fa-arrow-left"></i></span>
                    {
                        [...Array(totalPages)].map((_, index) => {
                            return <span key={index} className={page === index + 1 ? "selectedPage" : ""} onClick={() => pageHandle(index + 1)}>{index + 1}</span>
                        })
                    }
                    <span className={page === totalPages ? "disabledPage" : ""} onClick={() => pageHandle(page + 1)}><i className="fa-solid fa-arrow-right"></i></span>
                </div>
            }
        </>
    )
}