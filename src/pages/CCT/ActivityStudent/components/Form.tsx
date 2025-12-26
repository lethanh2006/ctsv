import ViewTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/ViewKhaoSat/View';
import { Button, Card, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormActivityStudent = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('cct.activityoutcome');

	const { getByIdModel, loading, record: recBieuMau } = useModel('tienich.bieumau');
	const {
		getByIdModel: getCauTraLoiMe,
		loading: loadingCauTraLoi,
		record: cauTraLoi,
	} = useModel('tienich.cautraloikhaosat');

	useEffect(() => {
		if (record?.answerId) {
			getCauTraLoiMe(record.answerId, true).catch(console.log);
		}

		if (record?.selfAssessmentQuestionsId) {
			getByIdModel(record?.selfAssessmentQuestionsId).catch(console.log);
		}
	}, [record?._id]);

	return (
		<Card title='My activity'>
			<Spin spinning={loadingCauTraLoi || loading}>
				<ViewTraLoiKhaoSat khaoSat={recBieuMau} cauTraLoi={cauTraLoi} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Spin>
		</Card>
	);
};

export default FormActivityStudent;
