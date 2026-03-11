import { fetch } from "@/src/libs/helpers";

export interface NotificationItem {
    id: string;
    title?: string;
    body?: string;
    type?: string;
    isRead?: boolean;
    createdAt: string;
};

export interface NotificationListResponse {
    list: NotificationItem[];
    hasMany: boolean;
};

export const getNotifications = async (params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
}): Promise<NotificationListResponse> => {
    return fetch<NotificationListResponse>({
        url: "/notification",
        method: "GET",
        params,
    });
};

export const updateNotificationPreference = async (
    notificationsEnabled: boolean
) => {
    return fetch({
        url: "/notification/update-notification-preference",
        method: "PUT",
        params: {
            notificationsEnabled,
        },
    });
};
