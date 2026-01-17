import { Route, Routes } from "react-router-dom";
import Todolist from "../pages/todolist";
import RealChat from "../pages/realChat";
import Authentication from "../pages/authentication";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "../pages/dashboard";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/authentication" element={<Authentication />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/todolist" element={<Todolist />} />
        <Route path="/realchat" element={<RealChat />} />
        <Route path="/" element={<RealChat />} />
      </Route>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
