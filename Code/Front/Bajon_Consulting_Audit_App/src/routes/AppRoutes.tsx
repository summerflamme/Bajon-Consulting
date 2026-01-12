import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/components/ui/ToastProvider";
import BaseLayout from "../layouts/BaseLayout";
import LoginPage from "../feature/auth/LoginPage";
import AuditEditorPage from "../feature/audits/AuditEditorPage";
import UserList from "../feature/users/UserListPage";
import UserInfo from "../feature/users/UserInfo";
import NewAuditPage from "../feature/audits/NewAudit/NewAudit";
import UserForm from "../feature/users/UserForm";
import AuditListPage from "../feature/audits/AuditListPage/AuditListPage";
import TemplateListPage from "@/feature/templates/TemplateListPage/TemplateListPage";
import ClientList from "../feature/clients/ClientListPage";
import ClientInfo from "../feature/clients/ClientInfo"
import ClientEdit from "../feature/clients/ClientEdit"



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
                    <Route path="/templates" element={<TemplateListPage />} />
                    <Route path="/users/list" element={<UserList />} />
                    <Route path="/users/info/:id" element={<UserInfo />} />
                    <Route path="/users/userForm/creation" element={<UserForm mode={'creation'} />} />
                    <Route path="/users/userForm/:id" element={<UserForm mode={'edition'} />} />
                    <Route path="/clients/list" element={<ClientList />} />
                    <Route path="/clients/info/:id" element={<ClientInfo />} />
                    <Route path="/clients/edit/:id" element={<ClientEdit />} />
                    
                </Route>
            </Routes>
            </ToastProvider>
        </Router>
    );
}
