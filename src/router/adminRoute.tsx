import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Navigate, Outlet } from "react-router";

interface AdminRouteProps {
    roles?: number[]
}

const AdminRoute = ({ roles = [1] }: AdminRouteProps) => {
    const { user } = useAuthContext()

    if (!user || !user.role) {
        return <Navigate to="/auth/masuk" />
    }

    if (roles.includes(user.role)) {
        return <Outlet />
    }

    return <Navigate to="/error/403" />
}

export default AdminRoute