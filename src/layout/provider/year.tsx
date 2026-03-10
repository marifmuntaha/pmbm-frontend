import { type ReactNode, useEffect, useState } from "react";
import type { YearType } from "@/types";
import { year as getYear } from "@/common/api/public"
import { YearContext } from "@/common/hooks/useYearContext";
import { Loading } from "@/components";

export const YearProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true)
    const [year, setYear] = useState<YearType>()

    useEffect(() => {
        const fetchYear = async () => {
            setLoading(true)
            try {
                await getYear({ active: true }, false).then((resp) => {
                    setYear(resp)
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchYear()
    }, []);

    if (loading) return <Loading />

    return (
        <YearContext.Provider value={year}>
            {children}
        </YearContext.Provider>
    )
}