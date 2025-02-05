import { useModel } from '@@/plugin-model/useModel';
import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import ThongTinChung from '@/pages/DiemRenLuyen/Dot/components/ThongTinChung';
import ViewDetailDiemRenLuyen from '@/pages/DiemRenLuyen/BieuMau/components/FormViewDetailDiemRenLuyen';
const { Step } = Steps;

const ViewChiTiet = () => {
	const { record, setVisibleForm } = useModel('diemrenluyen.dot');
	const { getByIdModel } = useModel('khaosat.bieumau');
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		if (record?.idBieuMau) getByIdModel(record?.idBieuMau, true);
	}, [record]);

	return (
		<Card title={'Chi tiết đợt'}>
			<Steps type={'navigation'} current={current} onChange={(val) => setCurrent(val)} style={{ marginBottom: 16 }}>
				<Step title='Thông tin chung' />
				<Step title='Biểu mẫu' />
			</Steps>
			{current === 0 && <ThongTinChung />}
			{current === 1 && <ViewDetailDiemRenLuyen hideClose hideCard={true} />}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};
export default ViewChiTiet;
