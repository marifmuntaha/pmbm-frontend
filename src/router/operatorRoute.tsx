import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Navigate, Outlet } from "react-router";

const OperatorRoute = () => {
    const { user } = useAuthContext()
    return (
        user?.role !== 2 ? <Navigate to={"/error/403"} /> : <Outlet />
    )
}

export default OperatorRoute