import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function AppRoutesTree() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppRoutesTree />
      </GoogleOAuthProvider>
    );
  }
  return <AppRoutesTree />;
}
