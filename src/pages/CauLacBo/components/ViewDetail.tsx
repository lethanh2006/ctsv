import { primaryColor } from '@/services/base/constant';
import { Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useModel } from 'umi';
import HoatDongCauLacBo from '@/pages/HoatDongChung/CauLacBo';
import PhongBanCauLacBo from '../PhongBan';
import ThanhVienCauLacBo from '../ThanhVien';
import { ETrangThaiThanhVien, ETrangThaiHoatDong } from '@/services/CauLacBo/constant';
import DonutChart from '@/components/Chart/DonutChart';

const ViewDetailCLB = (props: {
	dataThongKe: {
		cauLacBo: string;
		thanhVien: {
			[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
			[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
		};
		tongSoHoatDong: {
			[ETrangThaiHoatDong.CHUA_THUC_HIEN]: number;
			[ETrangThaiHoatDong.DA_THUC_HIEN]: number;
			[ETrangThaiHoatDong.HUY]: number;
		};
	};
}) => {
	const { record } = useModel('caulacbo.caulacbo');
	const { danhSach } = useModel('tochucnhansu.donvi');

	return (
		<Tabs>
			<Tabs.TabPane key={'1'} tab='Thông tin chung'>
				<Row>
					<Col span={12}>
						<DonutChart
							showTotal
							formatY={(val) => `${val} hoạt động`}
							height={200}
							yLabel={['Hoạt động']}
							xAxis={Object.values(ETrangThaiHoatDong)}
							yAxis={[Object.values(props.dataThongKe?.tongSoHoatDong ?? 0)]}
						/>
					</Col>
					<Col span={12}>
						<DonutChart
							formatY={(val) => `${val} thành viên`}
							height={200}
							showTotal
							yLabel={['Thành viên đang hoạt động', 'Thành viên ngừng hoạt động']}
							xAxis={Object.values(ETrangThaiThanhVien)}
							yAxis={[Object.values(props.dataThongKe?.thanhVien ?? 0)]}
						/>
					</Col>
				</Row>

				<Descriptions column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }}>
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
			</Tabs.TabPane>
			<Tabs.TabPane key={'2'} tab='Danh sách ban/bộ phận'>
				<PhongBanCauLacBo />
			</Tabs.TabPane>
			<Tabs.TabPane key={'3'} tab='Danh sách thành viên'>
				<ThanhVienCauLacBo />
			</Tabs.TabPane>
			<Tabs.TabPane key={'4'} tab='Hoạt động của CLB'>
				<HoatDongCauLacBo
					hideCard
					paramCondition={{
						info: {
							type: 'CAU_LAC_BO',
							refId: record?._id,
						},
					}}
				/>
			</Tabs.TabPane>
		</Tabs>
	);
};

export default ViewDetailCLB;
