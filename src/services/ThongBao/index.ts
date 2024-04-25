import axios from '@/utils/axios';
import { ipNotif } from '@/utils/ip';

export async function postReceiver(payload: any, params: { page: number; limit: number }) {
	return axios.post(`${ipNotif}/notification/receiver/page`, payload, { params });
}

export async function readNotification(payload: { type: 'ONE' | 'ALL'; notificationId?: any }) {
	return axios.post(`${ipNotif}/notification/read`, payload);
}
export async function thongKeNotification() {
	return axios.get(`${ipNotif}/notification/thong-ke`);
}
export async function deleteThongBao(id: string) {
	return axios.delete(`${ipNotif}/notification/${id}`);
}
export async function thongKeNotificationNguoiNhan(id: string) {
	return axios.get(`${ipNotif}/notification/${id}/receiver/thong-ke`);
}

export async function getThongBao(payload: {
	page: number;
	limit: number;
	condition: any;
	sort: { createdAt: 1 | -1 };
}) {
	return axios.get(`${ipNotif}/notification/me/page`, { params: payload });
}

export async function getReceiver(
	notificationId: string,
	payload: {
		page: number;
		limit: number;
		condition?: any;
		sort?: { createdAt: 1 | -1 };
	},
) {
	return axios.get(`${ipNotif}/notification/${notificationId}/receiver/page`, { params: payload });
}
