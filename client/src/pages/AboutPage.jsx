import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import about1 from "../assets/images/about1.svg";
import about2 from "../assets/images/about2.svg";
import { Link } from "react-router-dom";

const AboutPageComponent = () => {
  return (
    <div className="flex flex-col items-center mx-auto w-3/4 mb-12">
      <h2 className="font-heading font-bold mt-8 uppercase">TRỌ SỐ</h2>
      <div className="">
        <div className="mt-6">
          <p>
          Đây là một website quản lý nhà trọ phát triển năm 2024. Bạn có thể đăng ký với tư cách là chủ phòng hoặc người ở trọ. Chủ phòng có thể đăng phòng và quản lý người ở trọ. Người ở trọ có thể tìm phòng cho thuê.
          </p>
        </div>
        <div className="flex mt-6 justify-center flex-col md:flex-row">
          <div className="md:w-1/2">
            <h4 className="font-bold">Chủ thuê</h4>
            <div>
              <p>
              Bên cho thuê có nhiều chức năng khác nhau như đăng bài
                và quản lý phòng của mình, tạo hợp đồng cho thuê và cập nhật 
                chi tiết thuê, quản lý người ở trọ, đăng ký thanh toán tiền thuê nhà, và
                xem lịch sử thanh toán tiền thuê. Ngoài ra, bạn có thể gửi
                thông báo thanh toán cho người thuê để đảm bảo thanh toán kịp thời.
              </p>
            </div>
          </div>
          <div>
            <img src={about1} alt="" />
          </div>
        </div>
        <div className="flex mt-6 justify-center flex-col md:flex-row">
          <div className="hidden md:block">
            <img src={about2} alt="" className="max-w-sm" />
          </div>
          <div className="md:w-1/2">
            <h4 className="font-bold">Người thuê</h4>
            <div>
              <p>
              Người thuê có thể tìm phòng trống và liên hệ
                bên cho thuê để được tư vấn thuê phòng. Bạn có thể lưu phòng
                để xem sau và xem chi tiết các phòng mà mình quan tâm. Khi
                đồng ý thuê phòng, bạn có thể xem và ký vào hợp đồng thuê
                hợp đồng được bên thuê gửi. Bạn cũng có thể xem
                chi tiết thanh toán, ngày đến hạn, lịch sử thanh toán và nhận
                nhắc nhở thanh toán từ chủ sở hữu.
              </p>
            </div>
          </div>
          <div className="md:hidden">
            <img src={about2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div>
        <header className="flex m-1 shadow-sm">
          <Logo />
          <div className="flex flex-col justify-center ml-2">
            <h5 className="font-display">Trọ số</h5>
            <p className="hidden text-xs md:block md:text-sm">
              since 2024
            </p>
          </div>
        </header>
        <AboutPageComponent />
        <footer className="p-4 shadow-sm md:px-6 md:py-8 bg-slate-300 mt-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Logo />

              <div className="flex flex-col ml-3 justify-center">
                <h1 className="font-display text-xl md:text-2xl">
                  Trọ số
                </h1>
                <p className="text-xs md:text-sm">
                  since 2024
                </p>
              </div>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0">
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
            <Link to="/" className="hover:underline">
              Trọ số
            </Link>
          </span>
        </footer>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <AboutPageComponent />
      <Footer />
    </div>
  );
};

export default AboutPage;
