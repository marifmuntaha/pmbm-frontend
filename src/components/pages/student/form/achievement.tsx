import React, { useEffect, useState } from "react";
import AchievementModal from "./partials/achievementModal";
import type { StudentAchievementType, UserType } from "@/types";
import { get as getAchievement } from "@/common/api/student/achievement"
import AchievementTable from "@/components/pages/achievement/table";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "@/components";

interface StudentAchievementProps {
    user?: UserType
}
const StudentAchievementForm = ({ user }: StudentAchievementProps) => {
    const [modal, setModal] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [achievements, setAchievements] = useState<StudentAchievementType[]>()
    const [achievement, setAchievement] = useState<StudentAchievementType>({
        id: undefined,
        level: undefined,
        champ: undefined,
        type: undefined,
        name: '',
        file: ''
    })
    const navigate = useNavigate();

    useEffect(() => {
        if (loadData) getAchievement({ userId: user?.id })
            .then((resp) => setAchievements(resp))
            .finally(() => setLoadData(false))

    }, [loadData]);

    return (
        <React.Fragment>
            <AchievementTable
                achievements={achievements}
                withImage={true}
                withAction={true}
                withAdd={true}
                setAchievement={setAchievement}
                setModal={setModal}
                setLoadData={setLoadData}
            />
            <AchievementModal
                modal={modal}
                setModal={setModal}
                achievement={achievement}
                setAchievement={setAchievement}
                setLoadData={setLoadData}
            />
            <div className="gy-0 mt-4 d-flex flex-row-reverse">
                <div className="form-group">
                    <Button color="light" type="button" onClick={() => navigate('/pendaftaran/unggah-berkas')}>
                        <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default StudentAchievementForm;