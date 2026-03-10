import { useAuthContext } from "@/common/hooks/useAuthContext";
import StudentTreasure from "@/pages/student/partials/treasure";
import StudentOperator from "@/pages/student/partials/operator";
import StudentCottage from "@/pages/student/partials/cottage";

const Student = () => {
    const { user } = useAuthContext()
    switch (user?.role) {
        case 2:
            return <StudentOperator />
        case 3:
            return <StudentTreasure />
        case 5:
            return <StudentCottage />
        default:
            return "Halaman Data Siswa"
    }
}

export default Student