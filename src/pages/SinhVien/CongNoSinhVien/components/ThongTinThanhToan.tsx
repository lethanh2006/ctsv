import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import TableDanhSachGiaoDich from './TableDanhSachGiaoDich';
import TableDanhSachKhoanThu from './TableDanhSachKhoanThu';

const ThongTinThanhToan = (props: { setVisible: any }) => {
	const { setVisible } = props;
	const { record } = useModel('taichinh.chitietthu');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<b>Trạng thái:</b>{' '}
					{record?.status ? (
						<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>{ETrangThaiThanhToan?.[record.status] ?? ''}</Tag>
					) : (
						<i>Đang cập nhật</i>
					)}
				</Col>
				<Col span={24}>
					<b>Họ và tên người nộp:</b> {record?.customerInfo?.name ?? <i>Đang cập nhật</i>}
				</Col>
			</Row>

			<Descriptions column={1} bordered>
				<Descriptions.Item label='Số tiền phải thu'>{inputFormat(record?.amountDue ?? 0)} VNĐ</Descriptions.Item>
				<Descriptions.Item label='Số tiền đã thu'>{inputFormat(record?.amountPaid ?? 0)} VNĐ</Descriptions.Item>
				<Descriptions.Item label='Số tiền còn lại phải thu'>
					{inputFormat(record?.amountRemaining ?? 0)} VNĐ
				</Descriptions.Item>
				<Descriptions.Item label='Số tiền hoàn trả'>{inputFormat(record?.amountRefund ?? 0)} VNĐ</Descriptions.Item>
			</Descriptions>

			<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane key={'1'} tab='Chi tiết' />
				<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
			</Tabs>
			{activeTab === '1' ? (
				<TableDanhSachKhoanThu value={record?.items ?? []} />
			) : (
				<TableDanhSachGiaoDich identityCode={record?.identityCode} value={record?.paidHistory ?? []} />
			)}

			<div className='form-footer' style={{ marginTop: 18 }}>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ThongTinThanhToan;
