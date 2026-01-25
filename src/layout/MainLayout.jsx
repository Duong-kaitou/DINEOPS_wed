import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // d-flex và flex-column là các class của Bootstrap thay cho flex flex-col
    // min-vh-100 thay cho min-h-screen
    <div className="d-flex flex-column min-vh-100">
      
      {/* Header của bạn */}
      
      
      {/* main với class flex-grow-1 để chiếm hết phần không gian còn lại */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;