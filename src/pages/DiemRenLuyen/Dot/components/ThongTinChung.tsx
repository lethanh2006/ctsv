import { useModel } from '@@/plugin-model/useModel';
import { Descriptions } from 'antd';
import moment from 'moment';

const ThongTinChung = () => {
	const { record } = useModel('diemrenluyen.dot');

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label='Tên đợt'>{record?.tenDot}</Descriptions.Item>
				<Descriptions.Item label='Kỳ học'>{record?.kyHoc}</Descriptions.Item>
				<Descriptions.Item label='Thời gian tiếp nhận minh chứng' span={24}>
					{record?.thoiGianTiepNhanMinhChung
						? `${moment(record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
								record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian SV tự chấm điểm' span={24}>
					{record?.thoiGianSVChamDiem
						? `${moment(record?.thoiGianSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
								record?.thoiGianSVChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian BCS chấm điểm' span={24}>
					{record?.thoiGianBCSChamDiem
						? `${moment(record?.thoiGianBCSChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
								record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian CVHT xác nhận' span={24}>
					{record?.thoiGianCoVanChamDiem
						? `${moment(record?.thoiGianCoVanChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
								record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>

				<Descriptions.Item label='Thời gian phòng CTSV chấm điểm' span={24}>
					{record?.thoiGianPhongCTSVChamDiem
						? `${moment(record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
								record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};
export default ThongTinChung;
