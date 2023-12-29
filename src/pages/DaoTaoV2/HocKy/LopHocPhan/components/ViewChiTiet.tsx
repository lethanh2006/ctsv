import { ETrangThaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Descriptions, Tag } from 'antd';
import { useModel } from 'umi';

const ViewChiTietLopHp = () => {
	const { record } = useModel('daotaov2.hocky.lophocphan');

	return (
		<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} title='Chi tiết lớp'>
			<Descriptions.Item label='Tên lớp tín chỉ'>{record?.ten ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Học kỳ'>{record?.hocKy?.ten ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Học phần'>{record?.hocPhan?.ten ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Mã học phần'>{record?.hocPhan?.ma ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Sĩ số tối đa'>{record?.siSoToiDa ?? ''}</Descriptions.Item>
			<Descriptions.Item label='Tình trạng lớp'>
				{
					<Tag color={record?.trangThaiLop === ETrangThaiLopHocPhan.DONG ? 'red' : 'green'}>
						{record?.trangThaiLop === ETrangThaiLopHocPhan.DONG ? 'Đã hủy' : record?.trangThaiLop}
					</Tag>
				}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ViewChiTietLopHp;
