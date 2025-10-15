import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
import AuditEditorPage from "../components/AuditEditorPage";
import UserList from "../feature/users/UserListPage";
import UserInfo from "../feature/users/UserInfo";
import NewAuditPage from "../components/NewAudit";
import UserForm from "../components/UserForm";


export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/users/list" element={<UserList />} />
                    <Route path="/users/info" element={<UserInfo />} />
                    <Route path="/users/user-form/creation" element={<UserForm mode={'creation'} />} />
                    <Route path="/users/user-form/:id" element={<UserForm mode={'edition'} />} />
                    <Route path="/audit" element={<AuditEditorPage />} />
                    <Route path="/newaudit" element={<NewAuditPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
