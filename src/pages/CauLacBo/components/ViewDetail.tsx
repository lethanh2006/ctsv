import { primaryColor } from '@/services/base/constant';
import { Descriptions, Tag } from 'antd';
import { useModel } from 'umi';
import PhongBanCauLacBo from '../PhongBan';
import ThanhVienCauLacBo from '../ThanhVien';
import HoatDongCauLacBo from '../HoatDong';

const ViewDetailCLB = () => {
	const { record } = useModel('caulacbo.caulacbo');
	const { danhSach } = useModel('tochucnhansu.donvi');
	const { filters } = useModel('caulacbo.thanhvien');
	const { danhSach: danhSachPhongBan } = useModel('caulacbo.phongban');

	return (
		<div>
			<Descriptions title='Thông tin chung' column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label={'Tên câu lạc bộ'}>
					{record?.ten}
				</Descriptions.Item>
				<Descriptions.Item span={3} label={'Đơn vị quản lý'}>
					{danhSach.find((item) => item._id === record?.donViQuanLy)?.ten}
				</Descriptions.Item>
				{record?.logo && (
					<Descriptions.Item span={3} label={'Logo'}>
						<img src={record.logo} style={{ width: 30, height: 30 }} />
					</Descriptions.Item>
				)}
				<Descriptions.Item span={3} label={'Khẩu hiệu'}>
					{record?.slogan}
				</Descriptions.Item>
				<Descriptions.Item span={6} label={'Mục đích'}>
					<div dangerouslySetInnerHTML={{ __html: record?.mucDich ?? '' }} />
				</Descriptions.Item>
				<Descriptions.Item span={6} label={'Ý nghĩa'}>
					<div dangerouslySetInnerHTML={{ __html: record?.yNghia ?? '' }} />
				</Descriptions.Item>

				<Descriptions.Item span={3} label={'Nội quy, quy chế'}>
					<Tag color={primaryColor}>
						<a href={record?.noiQuyQuyChe ?? ''} target='_blank' rel='noreferrer'>
							Xem tập tin
						</a>
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={3} label={'Quyết định thành lập'}>
					<Tag color={primaryColor}>
						<a href={record?.quyetDinhThanhLap ?? ''} target='_blank' rel='noreferrer'>
							Xem tập tin
						</a>
					</Tag>
				</Descriptions.Item>
			</Descriptions>
			<Descriptions title='Danh sách ban/bộ phận' column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }} />
			<PhongBanCauLacBo />
			<br />
			<Descriptions
				title={`Danh sách thành viên ${
					danhSachPhongBan.find((item) =>
						filters.find((ele) => ele.field === 'danhSachBanBoPhan.banBoPhanId')?.values?.includes(item._id),
					)?.ten || 'câu lạc bộ'
				}`}
				column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }}
			/>
			<ThanhVienCauLacBo />
			<br />
			<Descriptions title='Hoạt động của CLB' column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }} />
			<HoatDongCauLacBo />
		</div>
	);
};

export default ViewDetailCLB;
