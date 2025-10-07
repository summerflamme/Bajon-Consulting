import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./Footer";

export default function BaseLayout() {
    return (
        <div className="app-layout flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-4">
                <Outlet /> {/* Les pages s’affichent ici */}
            </main>
            <Footer />
        </div>
    );
}
