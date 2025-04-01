import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineNotifications } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { products } from "@/constants/data";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import { GoHeart } from "react-icons/go";

export default function Page() {
  return (
    <div className="relative w-full h-full p-4">
      <div className="w-full rounded flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Hello Chris!
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* cart icon */}
          <div className="shadow p-1 rounded flex items-center justify-center w-10 h-10">
            <CiShoppingCart className="size-5" />
          </div>
          {/* notification icon */}
          <div className="shadow p-1 rounded flex items-center justify-center w-10 h-10">
            <MdOutlineNotifications className="size-5" />
          </div>
        </div>
      </div>

      {/* sticky */}
      <div className="sticky top-1 w-full h-fit z-20 bg-white p-2 flex items-center gap-1.5 justify-between my-5">
        <h3 className="font-semibold text-sm sm:text-lg md:text-2xl">
          Products
        </h3>
        {/* search bar */}
        <div className="flex items-stretch justify-between h-10 rounded relative">
          <input
            type="text"
            placeholder="Search for products"
            className="border border-gray-100 rounded-l-3xl p-2 px-3 w-full text-sm sm:text-base placeholder:text-sm"
          />
          <button className="bg-green-600 text-white p-2 w-10 rounded-r-3xl flex items-center justify-center">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* product listing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3 md:gap-4 my-10">
        {products.map((product, index) => (
          <Link
            href={"/"}
            className="shadow w-full h-96 rounded relative"
            key={index}
          >
            {/* wishlist icon */}
            <div className="shadow rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-white transition-all duration-300 absolute top-2 right-3">
              <GoHeart className="size-4 sm:size-6 text-gray-700" />
            </div>

            <img
              src={product.image}
              alt={product.product_name}
              className="w-full h-2/3 rounded-t object-cover"
            />
            <div className="p-2 sm:p-2.5 md:p-4">
              <h3 className="text-base sm:text-lg font-semibold">
                {product.product_name}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {product.product_category}
              </p>

              <div className="flex items-center justify-between absolute bottom-2 w-full left-0 px-2">
                <p className="text-green-600 font-bold mt-2">
                  ${product.product_price.toFixed(2)}
                </p>

                <div className="shadow rounded w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center hover:bg-gray-100 transition-all duration-300">
                  <IoAddOutline className="size-4 sm:size-6" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
