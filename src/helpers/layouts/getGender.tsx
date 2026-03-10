import {GENDER_OPTIONS} from "@/common/constants";

export const getGender = (value: number|null) => {
    const gender = GENDER_OPTIONS.find((item) => item.value === value)
    return gender?.label
}