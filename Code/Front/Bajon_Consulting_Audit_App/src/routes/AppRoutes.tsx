import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
import AuditEditorPage from "../components/AuditEditorPage";
import UserList from "../components/UserListPage";


export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/users" element={<UserList />} />
                    
                    <Route path="/audit" element={<AuditEditorPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
