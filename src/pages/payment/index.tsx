import { useAuthContext } from "@/common/hooks/useAuthContext";
import Treasure from "./partials/treasure";
import Student from "./partials/student";

const Payment = () => {
    const { user } = useAuthContext();
    if (user?.role === 3) {
        return <Treasure />
    }
    return <Student />
}

export default Payment
