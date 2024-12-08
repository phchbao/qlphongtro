import React from "react";
import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import { Link } from "react-router-dom";
import about1 from "../assets/images/about1.svg";
import landingTitle from "../assets/images/landingTitle.svg";

const BlogComponent = () => {
  const blogs = [
    {
      title: "Tân Sinh Viên Thuê Trọ Cần Lưu Ý Điều Gì Để Không Bị Lừa?",
      content:
        "Việc tìm nhà trọ cho sinh viên là một phần quan trọng của hành trình học tập tại các thành phố lớn. Đối với những bạn tân sinh viên, đây có thể là một công việc khá thử thách. Để giúp các bạn sinh viên bớt đi nỗi lo về tìm nhà và an tâm bước chân vào cánh cửa đại học, chúng mình cung cấp một cẩm nang dành cho sinh viên thuê trọ...",
      thumbnail: about1,
      link: "https://glints.com/vn/blog/kinh-nghiem-thue-phong-tro-cho-sinh-vien/",
    },
    {
      title: "Người ở 'thủ phủ nhà trọ' bày cách sống tiết kiệm tối đa",
      content:
        "Chưa tìm được việc hoặc ít được tăng ca khiến nhiều người ở thủ phủ nhà trọ tại TP.HCM chắt bóp chi tiêu. Nhiều người sống tiết kiệm hết mức có thể. 17 giờ chiều, người dân ở các xóm trọ trên đường Trần Thanh Mại (Q.Bình Tân) trò chuyện cho khuây khỏa sau một ngày ở trong phòng trọ. Một số người nói về chuyện thu nhập giảm suốt mấy tháng qua và cùng nhau chỉ mẹo hay tiết kiệm giữa thời buổi khó khăn...",
      thumbnail: landingTitle,
      link: "https://thanhnien.vn/nguoi-o-thu-phu-nha-tro-bay-cach-song-tiet-kiem-toi-da-chi-tieu-50000-dong-ngay-185231006082738795.htm",
    },
    {
      title: "Cách tính tiền điện, nước nhà trọ theo quy định mới",
      content:
        "Ngoài tiền thuê nhà, những người ở trọ hiện nay còn phải gánh thêm chi phí điện, nước do chủ nhà tự đặt ra với mức cao khó chấp nhận. Pháp luật hiện nay đã có những quy định cụ thể về cách tính tiền điện, nước nhà trọ mà người thuê nhà cần biết để bảo vệ quyền lợi...",
      thumbnail: landingTitle,
      link: "https://luatvietnam.vn/tin-phap-luat/cach-tinh-tien-dien-nuoc-nha-tro-theo-quy-dinh-moi-230-18375-article.html",
    },
  ];

  return (
    <div className="flex flex-col items-center mx-auto w-3/4 mb-12">
      <h2 className="font-heading font-bold mt-8 uppercase">Có thể bạn chưa biết</h2>
      <div style={{ height: '35px' }}></div> 
      <div>
        {blogs.map((blog, index) => (
          <div key={index} className="mt-6">
            <h3 className="font-bold">{blog.title}</h3>
            <div className="flex mt-3 justify-center flex-col md:flex-row">
              <div className="md:w-1/2">
                <p>{blog.content}</p>
                <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2">
                  Đọc thêm
                </a>
              </div>
              <div>
                <img src={blog.thumbnail} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogPage = () => {
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
        <BlogComponent />
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <BlogComponent />
      <Footer />
    </div>
  );
};

export default BlogPage;
