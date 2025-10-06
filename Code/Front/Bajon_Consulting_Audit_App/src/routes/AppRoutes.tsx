import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
<<<<<<< Updated upstream
import UserListPage from "../components/UserListPage";
=======
import AuditEditorPage from "../components/AuditEditorPage";
>>>>>>> Stashed changes

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/" element={<LoginPage />} />
<<<<<<< Updated upstream
                    <Route path="/users" element={<UserListPage />} />
=======
                    <Route path="/audit" element={<AuditEditorPage />} />
>>>>>>> Stashed changes
                </Route>
            </Routes>
        </Router>
    );
}
