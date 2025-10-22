import { useModel } from 'umi';
import { Descriptions } from 'antd';
import dayjs from 'dayjs';

const ThongTinChung = () => {
	const { record } = useModel('diemrenluyen.dot');

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label='Tên đợt'>{record?.tenDot}</Descriptions.Item>
				<Descriptions.Item label='Kỳ học'>{record?.kyHoc}</Descriptions.Item>
				<Descriptions.Item label='Thời gian tiếp nhận minh chứng' span={24}>
					{record?.thoiGianTiepNhanMinhChung
						? `${dayjs(record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian SV tự chấm điểm' span={24}>
					{record?.thoiGianSVChamDiem
						? `${dayjs(record?.thoiGianSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianSVChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian BCS chấm điểm' span={24}>
					{record?.thoiGianBCSChamDiem
						? `${dayjs(record?.thoiGianBCSChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian CVHT xác nhận' span={24}>
					{record?.thoiGianCoVanChamDiem
						? `${dayjs(record?.thoiGianCoVanChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>

				<Descriptions.Item label='Thời gian phòng CTSV chấm điểm' span={24}>
					{record?.thoiGianPhongCTSVChamDiem
						? `${dayjs(record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
						  ).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};
export default ThongTinChung;
