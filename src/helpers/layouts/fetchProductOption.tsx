import type {OptionsType} from "@/types";
import {UNIT_OPTIONS} from "@/common/constants";

export function fetchProductOption(data: string){
    const gender: OptionsType[] = JSON.parse(data)
    let value = ''
    if (gender?.length === 0) {
        value = '-'
    } else {
        gender?.map((item) => {
            value += item?.label + " | "
        })
        value = value.slice(0, value.length - 3)
    }
    return <span>{value}</span>
}

export function fetchUnit(data: number) {
    const unit = UNIT_OPTIONS.find((item) => item.value === data)
    return <> {unit ? unit.label : '-'} </>
}