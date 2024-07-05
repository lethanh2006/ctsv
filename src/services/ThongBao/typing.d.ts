import type { EVaiTroBieuMau } from '../TienIch/constant';
import type { ENotificationSource, ESourceTypeNotification } from './constant';
import { type EReceiverType } from './constant';

declare module ThongBao {
	export interface IRecord {
		_id: string;
		title: string;
		senderName: string;
		sender?: string;
		description?: string;
		content?: string;
		imageUrl?: string;

		filter?: {
			roles: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopTinChi: string;
		};
		receiverType: EReceiverType;
		users?: string[];

		// oneSignalData?: any;
		taiLieuDinhKem?: string[];
		createdAt: string; // '2023-06-27T07:47:29.693Z';
		read: boolean;

		sourceType?: ESourceTypeNotification;
		notificationInternal: boolean;
		thoiGianHieuLuc: Date;

		metadata?: TNotificationSource;
	}

	export type TNotificationSource = {
		entityId?: string;
		entitySource?: ENotificationSource;
	} & Record<string, any>;

	export interface IThongKe {
		tatCa: 20;
		theoKhoaSinhVien: 4;
		theoLopHanhChinh: 5;
		theoLopHocPhan: 1823;
		theoNganh: 2;
		theoNguoiDung: 25;
		theoTopic: 0;
		theoKhoa: 2;
	}
	export interface IThongKeNguoiNhan {
		chuaDoc: 54;
		daDoc: 1;
	}
	export interface IUser {
		ssoId: string;
		code: string;
		// firstname: string;
		// lastname: string;
		fullname: string;
		username: string;
		maKhoaSinhVien: string;
		maNganh: string;
		vaiTro?: EVaiTroBieuMau;
	}

	export type TReceiver = {
		ssoId: string;
		username: string;
		fullname: string;
		read?: boolean;
	};
}
