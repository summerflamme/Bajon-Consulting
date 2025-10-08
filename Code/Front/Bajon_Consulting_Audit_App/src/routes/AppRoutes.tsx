import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
import AuditEditorPage from "../components/AuditEditorPage";
import UserList from "../components/UserListPage";
import UserForm from "../components/UserForm";


export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                    <Route element={<BaseLayout />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/audit" element={<AuditEditorPage />} />
                    <Route path="/users/user-form/creation" element={<UserForm mode={'creation'} />} />
                    <Route path="/users/user-form/:id" element={<UserForm mode={'edition'} />} />
                    <Route path="*" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
