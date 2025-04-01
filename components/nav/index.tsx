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
    <header className="m-0 p-0 header__bg h-screen">
      {/* mobile */}
      <nav className="fixed md:hidden bottom-0 left-0 shadow bg-white/20 backdrop-blur w-full px-4 py-4 rounded-t-xl flex items-center justify-around z-10">
        {menuItems.map((item, index) => (
          <Link href={item.link} className="" key={index}>
            {item.icon}
          </Link>
        ))}
      </nav>

      {/* desktop */}
      <nav className="hidden px-4 py-1 m-0 md:flex items-center justify-between">
        <Link href={"/"} className="text-3xl font-bold text-gray-50">
          Logo
        </Link>
        <div className="flex items-center space-x-5">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="text-sm font-normal text-gray-100 uppercase"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* header content */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
          <div>
            <h1 className="font-bold text-6xl">Jolt Sport Project</h1>
            <p className="max-w-2xl mx-auto mt-3 text-sm font-medium">
              The issue is that window.screenY is not the correct property to
              use to detect the scroll position. Instead, you can use
              window.scrollY to get the current scroll position.
            </p>
          </div>

          {/* shop now */}
          <div className="mt-20">
            <Link
              href="/"
              className="border px-10 py-1 rounded-full bg-white/20 backdrop-blur"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
