import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ManagementPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Thông báo chung", path: "notiall" },
    { label: "Điện", path: "electric" },
    { label: "Nước", path: "water" },
    { label: "Dịch vụ", path: "services" },
  ];

  const [selected, setSelected] = useState("rooms");

  const handleNavigation = (item) => {
    setSelected(item.path);
    navigate(item.path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Quản lý</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`p-2 cursor-pointer ${
                selected === item.path ? "bg-gray-700" : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagementPage;
