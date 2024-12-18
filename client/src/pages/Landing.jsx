import { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo, AlertToast, Footer } from "../components";
import landingImg from "../assets/images/landing1.svg";
import landingImg2 from "../assets/images/landing2.svg";
import { Button } from "@mui/material";
import { clearAlert } from "../features/auth/authSlice";
import zalo from "../assets/images/zalo.svg";
import facebook from "../assets/images/facebook.svg";
import twitter from "../assets/images/twitter.svg";
import telegram from "../assets/images/telegram.svg";
import introJs from "intro.js";
import "intro.js/introjs.css";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const { user, userType, errorFlag, alertType, errorMsg } = useSelector(
    (store) => store.auth
  );

  const startTour = useCallback(() => {
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          element: document.querySelector(".intro-header"),
          intro: "Đây là header, bạn có thể tìm thấy logo và các liên kết mạng xã hội ở đây.",
          position: "top",
        },
        {
          element: document.querySelector(".intro-guide"),
          intro: "Đây là phần hướng dẫn sử dụng website. Bạn có thể tìm hiểu các chức năng của trang tại đây.",
          position: "bottom",
        },
        {
          element: document.querySelector(".intro-footer"),
          intro: "Cuối cùng là footer với thông tin liên hệ và các liên kết quan trọng.",
          position: "top",
        },
      ],
      showProgress: true,
      showBullets: true,
      overlayOpacity: 0.8,
      nextLabel: "Tiếp theo",
      prevLabel: "Trước",
      skipLabel: "Bỏ qua",
    });

    intro.start();
  }, []);

  useEffect(() => {
    startTour();
  }, [startTour]);

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  return (
    <div>
      <header className="flex m-1 shadow-sm justify-between items-center intro-header">
        <div className="flex items-center">
          <Logo />
          <div className="flex flex-col justify-center ml-2">
            <h5 className="font-display">Trọ số</h5>
            <p className="hidden text-xs md:block md:text-sm">since 2024</p>
          </div>
        </div>
        <a href="#/blog" className="text-gray-700 text-sm md:text-base mr-4 font-bold text-yellow">
          Blog
        </a>
        <a href="https://www.facebook.com/61570515562039" target="_blank">
          <img className="hidden md:block" src={facebook} height="30" width="30" alt="" />
        </a>
        <a href="https://chat.zalo.me/" target="_blank">
          <img className="hidden md:block" src={zalo} height="30" width="30" alt="" />
        </a>
        <a href="https://x.com/" target="_blank">
          <img className="hidden md:block" src={twitter} height="30" width="30" alt="" />
        </a>
        <a href="https://web.telegram.org/" target="_blank">
          <img className="hidden md:block" src={telegram} height="30" width="30" alt="" />
        </a>
      </header>

      <div className="flex flex-col items-center background-image">
        <div style={{ height: "150px" }}></div>
        <div className="md:w-2/3 intro-main-text">
          <h1 className="text-2xl md:text-4xl font-heading text-center font-extrabold text-zoom">
            <span className="text-white">Muốn thuê một chỗ? Tìm ngay Trọ Số</span>
          </h1>
          <p className="mt-8 text-center text-white w-4/5 mx-auto text-zoom">
            "Kết nối chủ thuê và người thuê chỉ bằng vài cú click chuột"
          </p>
          <div style={{ height: "75px" }}></div>
          <div className="flex mt-8 gap-8 flex-wrap justify-center">
            <Button
              variant="contained"
              sx={{
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={() => ref.current.scrollIntoView({ behavior: "smooth" })}
            >
              Bắt đầu
            </Button>
            <Button
              color="secondary"
              sx={{
                fontWeight: "bold",
              }}
              variant="outlined"
              onClick={useCallback(() => navigate("/about"), [navigate])}
            >
              Xem thêm
            </Button>
          </div>
          <div style={{ height: "75px" }}></div>
        </div>
      </div>

      <main className="flex flex-col items-center my-16">
        <div className="md:w-2/3 intro-main-text">
          <h1 className="text-2xl md:text-4xl font-heading text-center font-extrabold">
            Vì sao nên chọn chúng tôi?
          </h1>
          <p className="mt-8 text-center text-gray-700 w-4/5 mx-auto text-yellow">
            &#x2713; Không quảng cáo
          </p>
          <p className="mt-8 text-center text-gray-700 w-4/5 mx-auto text-yellow">
            &#x2713; Không trung gian
          </p>
          <p className="mt-8 text-center text-gray-700 w-4/5 mx-auto text-yellow">
            &#x2713; Đơn giản, dễ thao tác
          </p>
          <p className="mt-8 text-center text-gray-700 w-4/5 mx-auto text-yellow">
            &#x2713; Lắng nghe ý kiến người dùng
          </p>
        </div>
        <div style={{ height: "35px" }}></div>
        <div className="md:w-4/5 intro-guide">
  <h1 className="text-2xl md:text-4xl font-heading text-center font-extrabold">
    Hướng dẫn sử dụng website
  </h1>
  <div style={{ height: "35px" }}></div>
  <div className="flex justify-center items-center">
    <iframe
      className="video-frame"
      width="672"
      height="378"
      src="https://www.youtube.com/embed/7qgoFudPFLg"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  </div>
</div>
        <section className="flex gap-16">
          <img className="hidden md:block" src={landingImg2} height="306" width="306" alt="" />
          <div className="flex flex-col self-center mx-auto p-4 w-full">
            <h3 className="font-display mb-2">Bạn có phòng muốn cho thuê?</h3>
            <p>Đăng tin thuê phòng thu hút người thuê trọ</p>
            <p>Tạo chi tiết hợp đồng</p>
            <p>Quản lí chi phí cho thuê</p>
            <div className="flex justify-start mt-7">
              <Button
                onClick={useCallback(() => navigate("/login/owner"), [navigate])}
                variant="contained"
                size="medium"
                color="secondary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Đăng nhập
              </Button>
              <span className="mx-3 sm:text-2xl">|</span>
              <Button
                onClick={useCallback(() => navigate("/register/owner"), [navigate])}
                variant="contained"
                size="medium"
                color="tertiary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "tertiary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </section>

        <hr className="my-4" />

        <section className="flex gap-16 mt-5">
          <img className="hidden md:block" src={landingImg} height="306" width="306" alt="" />
          <div className="flex flex-col self-center mx-auto p-4 w-full">
            <h3 className="font-display mb-2">Bạn cần thuê trọ?</h3>
            <p>Truy cập thông tin phòng trọ</p>
            <p>Thương lượng trực tiếp với chủ trọ</p>
            <div className="flex justify-start mt-7">
              <Button
                onClick={useCallback(() => navigate("/login/renter"), [navigate])}
                variant="contained"
                size="medium"
                color="secondary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Đăng nhập
              </Button>
              <span className="mx-3 sm:text-2xl">|</span>
              <Button
                onClick={useCallback(() => navigate("/register/renter"), [navigate])}
                variant="contained"
                size="medium"
                color="tertiary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "tertiary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AlertToast
        open={errorFlag}
        message={errorMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />
    </div>
  );
};

export default Landing;
