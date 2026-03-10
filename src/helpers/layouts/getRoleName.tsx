import {ROLE_NAME} from "@/common/constants";

export const getRoleName = (id: number|undefined) => {
    const roleName =  ROLE_NAME.find((item) => {
        return item.id === id
    })
    return roleName?.name;
}