import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchProducts from "./api/FetchProducts";

export default function ProductList({ search }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const itemPerPage = 14;
  const navigate = useNavigate();

  const filteredproducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredproducts.length / itemPerPage);

  useEffect(() => {
    async function getProducts() {
      const data = await FetchProducts();
      setProducts(data);
    }
    getProducts();
  }, []);

  function pageHandle(value) {
    if (value < 1 || value > totalPages) return;
    setPage(value);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {filteredproducts.length > 0 ? (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredproducts
              .slice((page - 1) * itemPerPage, page * itemPerPage)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-56 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                        <i className="fa-solid fa-star text-xs"></i>
                        {item.rating}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px]">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => pageHandle(page - 1)}
              disabled={page === 1}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center transition
                ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-900 hover:text-white"
                }`}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => pageHandle(index + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition
                  ${
                    page === index + 1
                      ? "bg-gray-900 text-white"
                      : "bg-white border hover:bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => pageHandle(page + 1)}
              disabled={page === totalPages}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center transition
                ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-900 hover:text-white"
                }`}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <i className="fa-solid fa-box-open text-6xl mb-4"></i>
          <h2 className="text-2xl font-semibold">No Products Found</h2>
        </div>
      )}
    </div>
  );
}