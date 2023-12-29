import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
} from '@/services/DaoTaoV2/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import LichSuThanhToan from './LichSuGiaoDich';
import TableDanhSachKhoanThu from './TableDanhSachKhoanThu';

const ThongTinThanhToan = (props: { setVisible: any }) => {
	const { setVisible } = props;
	const { record } = useModel('daotaov2.taichinh.hoadon');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
						<Descriptions.Item label='Trạng thái'>
							{record?.status ? (
								<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>
									{ETrangThaiThanhToan?.[record.status] ?? ''}
								</Tag>
							) : (
								<i>Đang cập nhật</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Họ tên người nộp'>
							{record?.userFullname ?? <i>Đang cập nhật</i>}
						</Descriptions.Item>
						<Descriptions.Item label='Tổng thành tiền'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền ưu đãi'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền đã thu'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền còn lại phải thu'>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
					</Descriptions>
				</Col>

				<Col span={24}>
					<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
						<Tabs.TabPane key={'1'} tab='Chi tiết' />
						<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
					</Tabs>

					{activeTab === '1' ? <TableDanhSachKhoanThu /> : <LichSuThanhToan />}
				</Col>
			</Row>

			<div className='form-footer' style={{ marginTop: 18 }}>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ThongTinThanhToan;
