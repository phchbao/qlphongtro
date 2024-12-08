import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import { Link } from "react-router-dom";

const PrivacyComponent = () => {
  return (
    <div className="flex flex-col items-center mx-auto w-3/4 mb-12">
      <h2 className="font-heading font-bold mt-8 uppercase">
        Chính sách bảo mật
      </h2>
      <div className="">
        <div className="mt-6">
          <h4 className="font-bold">Thu thập dữ liệu</h4>
          <div>
            <p>
            Chúng tôi thu thập thông tin cá nhân như tên, địa chỉ email, số điện thoại
              và chi tiết phòng để cung cấp dịch vụ cho người dùng.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Sử dụng dữ liệu</h4>
          <div>
            <p>
            Dữ liệu được thu thập sẽ chỉ được sử dụng để cung cấp dịch vụ cho chúng tôi
              người dùng chẳng hạn như quản lý phòng của họ và liên hệ với người thuê tiềm năng.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Bảo mật</h4>
          <div>
            <p>
            Chúng tôi thực hiện các biện pháp bảo mật để bảo vệ dữ liệu được thu thập khỏi
              truy cập, tiết lộ hoặc sửa đổi trái phép.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Chia sẻ dữ liệu</h4>
          <div>
            <p>
            Chúng tôi không chia sẻ bất kỳ thông tin cá nhân nào với bên thứ ba
              mà không có sự đồng ý rõ ràng của người dùng.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Lưu trữ dữ liệu</h4>
          <div>
            <p>
            Chúng tôi sẽ lưu giữ dữ liệu đã thu thập trong thời gian người dùng sử dụng
              dịch vụ của chúng tôi hoặc theo yêu cầu của pháp luật.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Quyền hạn người dùng</h4>
          <div>
            <p>
            Người dùng có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của họ
              thông tin bằng cách liên hệ với chúng tôi.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Thay đổi chính sách</h4>
          <div>
            <p>
            Chúng tôi có quyền thay đổi chính sách bảo mật này bất cứ lúc nào.
              Người dùng sẽ được thông báo về bất kỳ thay đổi nào qua email hoặc thông qua chúng tôi
              trang mạng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyPoliciesPage = () => {
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
        <PrivacyComponent />
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
                <Link to="/about" className="mr-4 hover:underline md:mr-6 ">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-700 sm:mx-auto  lg:my-8" />
          <span className="block text-sm  sm:text-center ">
            2024 |{" "}
            <Link to="/" className="hover:underline">
              trọ số
            </Link>
          </span>
        </footer>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <PrivacyComponent />
      <Footer />
    </div>
  );
};

export default PrivacyPoliciesPage;
