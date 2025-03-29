import { GoHome, GoSearch } from "react-icons/go";
import Link from "next/link";
import { CiSettings, CiShoppingCart, CiUser } from "react-icons/ci";

const menuItems = [
  {
    name: "Home",
    icon: <GoHome className="size-6" />,
    link: "/",
  },
  {
    name: "Search",
    icon: <GoSearch className="size-6" />,
    link: "/search",
  },
  {
    name: "Cart",
    icon: <CiShoppingCart className="size-6" />,
    link: "/cart",
  },
  {
    name: "Profile",
    icon: <CiUser className="size-6" />,
    link: "/profile",
  },
  {
    name: "Settings",
    icon: <CiSettings className="size-6" />,
    link: "/settings",
  },
];

const NavigationBar = () => {
  return (
    <nav className="m-0 p-0">
      {/* mobile */}
      <div className="absolute md:hidden bottom-0 left-0 shadow-lg bg-white w-full px-4 py-4 rounded-t-xl flex items-center justify-around">
        {menuItems.map((item) => (
          <Link href={item.link} className="">
            {item.icon}
          </Link>
        ))}
      </div>

      {/* desktop */}
      <div className="hidden shadow px-4 py-1 m-0 md:flex items-center justify-between">
        <Link href={"/"} className="text-2xl font-bold text-gray-800">
          Logo
        </Link>
        <div className="flex items-center space-x-5">
          {menuItems.map((item) => (
            <Link
              href={item.link}
              className="text-sm font-normal text-gray-800 uppercase"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
