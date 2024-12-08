import { Logo } from "./";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const { userType } = useSelector((store) => store.auth);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer id="footer" className="p-4 shadow-sm md:px-6 md:py-8 bg-slate-300 mt-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Logo />

          <div className="flex flex-col ml-3 justify-center">
            <h1 className="font-display text-xl md:text-2xl">Trọ số</h1>
            <p className="text-xs md:text-sm">
              since 2024
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0">
          <li>
            <Link to="/about" className="mr-4 hover:underline md:mr-6 ">
              Về chúng tôi
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="mr-4 hover:underline md:mr-6">
              Chính sách bảo mật
            </Link>
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-700 sm:mx-auto  lg:my-8" />
      <span className="block text-sm  sm:text-center ">
        2024 |{" "}
        <Link to={`/${userType}`} className="hover:underline">
          Trọ số
        </Link>
      </span>
      <span className="block text-sm  sm:text-center ">
      Email: troso@gmail.com
      </span>
      <span className="block text-sm  sm:text-center ">
      Phone: 0123456789
      </span>
      <button
        className="fixed bottom-8 right-8 bg-white p-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-gray-200 focus:outline-none"
        onClick={scrollToTop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
