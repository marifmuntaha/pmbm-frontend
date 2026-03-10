export type AnnouncementType = {
    id: number;
    yearId: number;
    institutionId?: number | null;
    title: string;
    description: string;
    type: number;
    user_id?: number | null;
    is_wa_sent: boolean;
    createdBy: number;
    updatedBy: number;
    created_at: string;
    updated_at: string;
}