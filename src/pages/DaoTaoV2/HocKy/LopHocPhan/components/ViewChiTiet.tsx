import { ETrangThaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Descriptions, Tag } from 'antd';
import { useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ViewChiTietLopHp = () => {
	const { record } = useModel('daotaov2.hocky.lophocphan');

	return (
		<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} title='Chi tiết lớp'>
			<Descriptions.Item label='Tên lớp tín chỉ'>
				{record?.ten ?? ''} {record?.lopNhuCau ? '(lớp nhu cầu)' : ''}
			</Descriptions.Item>
			<Descriptions.Item label='Học kỳ'>{record?.hocKy?.ten ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Học phần'>{record?.hocPhan?.ten ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Mã học phần'>{record?.hocPhan?.ma ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Sĩ số tối đa'>{record?.siSoToiDa ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Trạng thái lớp'>
				{
					<Tag color={record?.trangThaiLop === ETrangThaiLopHocPhan.DONG ? 'red' : 'green'}>
						{record?.trangThaiLop === ETrangThaiLopHocPhan.DONG ? 'Đã hủy' : record?.trangThaiLop}
					</Tag>
				}
			</Descriptions.Item>

			<Descriptions.Item label='Giảng viên'>
				{record?.nhanSuList
					?.map((item) => (item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu))
					?.join(', ')}
			</Descriptions.Item>
			{record?._id ? (
				<Descriptions.Item label='Lịch học'>
					{record.tenLopGhepTkb ? (
						<div style={{ marginBottom: 8 }}>Tên lớp ghép thời khóa biểu: {record.tenLopGhepTkb}</div>
					) : null}
					<div>
						<RenderLichHoc lopHocPhan={record} showAll />
					</div>
				</Descriptions.Item>
			) : null}

			<Descriptions.Item label='Khóa ngành dự kiến' span={2}>
				{record?.listLopHpKn?.map((i) => i.khoaNganh?.ten ?? i.maKn).join(', ')}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ViewChiTietLopHp;
