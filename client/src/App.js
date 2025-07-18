import Navbar from "./componants/navbar/index";
import Footer from "./componants/footer/index";
import AllRoutes from "./componants/allroutes";
import { useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname ==="/dashboard" || location.pathname === "/authentication";

  return (
    <div className="text-center h-screen bg-gray-100 flex flex-col">
      {!isDashboard && <Navbar />}
      <div>
        <AllRoutes />
      </div>
      <Footer />
    </div>
  )
}
