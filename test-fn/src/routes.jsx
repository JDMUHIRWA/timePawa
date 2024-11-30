import { createBrowserRouter } from "react-router-dom";
import { Login, Register, Setup2FA, Verify2FA, Reset, Homepage  } from "./pages/export";
import ProtectedRoute from "./components/ProtectedRoute";

const Router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <div>404</div>,
    },
    {
        element: <ProtectedRoute />,
        children:

            [   
                {
                    path: 'dashboard',
                    element: <Homepage />,
                },
                {
                    path: "/register",
                    element: <Register />,
                    errorElement: <div>404</div>,
                },
                {
                    path: "/setup2fa",
                    element: <Setup2FA />,
                    errorElement: <div>404</div>,
                },
                {
                    path: "/verify2fa",
                    element: <Verify2FA />,
                    errorElement: <div>404</div>,
                },
                {
                    path: "/reset",
                    element: <Reset />,
                    errorElement: <div>404</div>,
                },
            ]
    }



]);

export default Router;