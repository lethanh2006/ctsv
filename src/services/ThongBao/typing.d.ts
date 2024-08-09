import type { EVaiTroBieuMau } from '../TienIch/constant';
import { type ESourceTypeNotification, type EReceiverType } from './constant';

declare module ThongBao {
	export interface IRecord {
		_id: string;
		title: string;
		senderName: string;
		sender?: string;
		description?: string;
		type?: string;
		content?: string;
		imageUrl?: string;
		idTagEmail?: string;

		tagEmail: {
			_id: '65582e549dcae9f3309e415e';
			ten: 'Thông báo trúng tuyển';
			moTa: 'Đây là thông báo trúng tuyển';
			__v: 0;
		};
		filter?: {
			roles: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopTinChi: string;
		};
		receiverType: EReceiverType;
		topics?: string[];
		users?: string[];

		data?: any;
		oneSignalData?: any;
		urlFile?: string[];
		createdAt: string; // '2023-06-27T07:47:29.693Z';
		read: boolean;

		sourceType?: ESourceTypeNotification;
		notificationInternal: boolean;
		thoiGianHieuLuc: Date;
		taiLieuDinhKem: string[];

		metadata?: TNotificationSource;
	}
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

	export type TNotificationSource = {
		entityId?: string;
		entitySource?: ENotificationSource;
		pathWeb?: string;
	} & Record<string, any>;
}
