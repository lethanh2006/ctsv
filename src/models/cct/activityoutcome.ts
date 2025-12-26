import useInitModel from '@/hooks/useInitModel';
import { putApproveActivity } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const putApproveActivityModel = async (
		idActivity: string,
		payLoad: {
			workflow: EApprovalStatus;
			activityRejectionNote?: string;
			revisionNote?: string;
		},
		getData?: () => void,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putApproveActivity(idActivity, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		putApproveActivityModel,
	};
};
