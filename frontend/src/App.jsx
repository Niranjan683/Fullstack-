import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import AdminPage from "./components/AdminPage";
import ProfilePage from "./components/ProfilePage"; 
import ChangeProfilePicture from "./components/ChangeProfilePicture";
import UserPhotosPage from "./components/UserPhotoPage";
import RegisterForm from "./components/RegisterForm";
import LoginPage from "./components/loginPage";
import AddContentPage from "./components/AddContentPage";
import IndexPage from "./components/IndexPage";
import ViewContentPage from "./components/ViewContent";
import EditContentPage from "./components/EditContent";
import LogoutButton from "./components/LogoutButton";
import SetPrivilegePage from "./components/SetPrivilegePage";
import AdminAllContents from "./components/AdminViewAllContents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/change-profile/:id" element={<ChangeProfilePicture />} />
        <Route path="/user-photos/:id" element={<UserPhotosPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-content" element={<AddContentPage />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/content/view/:id" element={<ViewContentPage />} />
        <Route path="/content/edit/:id" element={<EditContentPage />} />
        <Route path="/login" element={<LogoutButton />} />
        <Route path="/set-privilege/:userId" element={<SetPrivilegePage />} />
        <Route path="/admin/all-contents" element={<AdminAllContents />} />


      </Routes>
    </Router>
  );
}

export default App;
