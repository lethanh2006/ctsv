import { Card, Segmented } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import ThongKePhieuDiemTheoKhoaHoc from './TheoKhoaHoc';
import ThongKePhieuDiemTheoNganh from './TheoNganh';
import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';

const ThongKePhieuDiem = () => {
	const { record, setRecord, danhSach } = useModel('diemrenluyen.dot');
	const [type, setType] = useState<string>('nganh');
	const [trinhdo, setTrinhdo] = useState('7');
	const [hinhThuc, setHinhThuc] = useState('1');
	return (
		<Card title='Thống kê'>
			<SelectDotDiemRenLuyen
				value={record?._id}
				isSetRecord
				allowClear={false}
				onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
			/>
			<SelectTrinhDo
				value={trinhdo}
				onChange={(val: any) => setTrinhdo(val)}
				allowClear
				selectMa
				style={{ width: 200, marginLeft: 8 }}
			/>
			<SelectHinhThuc
				value={hinhThuc}
				selectMa
				onChange={(val: any) => setHinhThuc(val)}
				allowClear
				style={{ width: 200, marginLeft: 8 }}
			/>
			<Segmented
				style={{ marginLeft: 8 }}
				value={type}
				onChange={(val: any) => setType(val)}
				options={[
					{ value: 'nganh', label: 'Ngành' },
					{ value: 'khoa', label: 'Khóa' },
				]}
			/>
			{type === 'nganh' && <ThongKePhieuDiemTheoNganh trinhDo={trinhdo} hinhThuc={hinhThuc} />}
			{type === 'khoa' && <ThongKePhieuDiemTheoKhoaHoc trinhDo={trinhdo} hinhThuc={hinhThuc} />}
		</Card>
	);
};

export default ThongKePhieuDiem;
