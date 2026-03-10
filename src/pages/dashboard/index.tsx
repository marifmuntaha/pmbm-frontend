import { useAuthContext } from "@/common/hooks/useAuthContext";
import Administrator from "@/pages/dashboard/partials/administrator";
import Treasurer from "@/pages/dashboard/partials/treasurer";
import Student from "@/pages/dashboard/partials/student";
import Operator from "@/pages/dashboard/partials/operator";
import Guest from "@/pages/dashboard/partials/guest";
import Cottage from "@/pages/dashboard/partials/cottage";

const Dashboard = () => {
    const { user } = useAuthContext()
    switch (user?.role) {
        case 1:
            return <Administrator />
        case 2:
            return <Operator />
        case 3:
            return <Treasurer />
        case 4:
            return <Student />
        case 5:
            return <Cottage />
        default:
            return <Guest />
    }
}
export default Dashboard;