import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./Footer";
import { AuthProvider } from "../feature/auth/AuthProvider";

export default function BaseLayout() {
  return (
    <AuthProvider>
      <div className="app-layout flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
