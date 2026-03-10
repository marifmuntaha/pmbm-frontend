import {useAuthContext} from "@/common/hooks/useAuthContext";
import {Navigate, Outlet} from "react-router";

const ProtectedRoute = () => {
    const {isLogged} = useAuthContext()
    return (
        !isLogged ? <Navigate to={"/auth/masuk"} /> : <Outlet/>
    )
}

export default ProtectedRoute