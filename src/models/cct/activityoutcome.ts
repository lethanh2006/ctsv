import useInitModel from '@/hooks/useInitModel';
import { getAnalyticsStaff, putApproveActivity } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus } from '@/services/CCT/constant';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<ActivityOutCome.IAnalyticsStaff>();

	const putApproveActivityModel = async (
		idActivity: string,
		payLoad: {
			workflow: EApprovalStatus;
			activityRejectionNote?: string;
			revisionNote?: string;
		},
		getData?: () => void,
		messageText?: string,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putApproveActivity(idActivity, payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getAnalyticsStaffModel = async (
		activityCategory: EActivityCategory,
	): Promise<ActivityOutCome.IAnalyticsStaff> => {
		setLoadingThongKe(true);
		try {
			const res = await getAnalyticsStaff(activityCategory);
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		loadingThongKe,
		putApproveActivityModel,
		getAnalyticsStaffModel,
	};
};
