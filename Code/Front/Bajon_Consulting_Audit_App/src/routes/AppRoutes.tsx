import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/components/ui/ToastProvider";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
import AuditEditorPage from "../feature/audits/AuditEditorPage";
import UserList from "../feature/users/UserListPage";
import UserInfo from "../feature/users/UserInfo";
import NewAuditPage from "../feature/audits/NewAudit/NewAudit";
import UserForm from "../feature/users/UserForm";
import AuditListPage from "../feature/audits/AuditListPage";


export default function AppRoutes() {
    return (
        <Router>
            <ToastProvider>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                        <Route path="/audit/:id/edit" element={<AuditEditorPage mode="edit" />} />
                        <Route path="/audit/:id/view" element={<AuditEditorPage mode="view" />} />
                    <Route path="/audits" element={<AuditListPage />} />
                    <Route path="/newaudit" element={<NewAuditPage />} />
                    <Route path="/users/list" element={<UserList />} />
                    <Route path="/users/info" element={<UserInfo />} />
                    <Route path="/users/user-form/creation" element={<UserForm mode={'creation'} />} />
                    <Route path="/users/user-form/:id" element={<UserForm mode={'edition'} />} />
                    
                </Route>
            </Routes>
            </ToastProvider>
        </Router>
    );
}
