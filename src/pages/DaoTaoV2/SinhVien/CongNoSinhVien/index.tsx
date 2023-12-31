import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/DaoTaoV2/TaiChinh/HoaDon/typing';
import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
} from '@/services/DaoTaoV2/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Modal, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ThongTinThanhToan from './components/ThongTinThanhToan';

const CongNoSinhVienPage = (props: { sinhVienSsoId?: string }) => {
	const { page, limit, setRecord } = useModel('daotaov2.taichinh.hoadon');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const handleDetail = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	const columns: IColumn<HoaDon.IRecord>[] = [
		{
			title: 'Mã TT',
			dataIndex: 'identityCode',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		// {
		// 	title: 'Mã sinh viên',
		// 	width: 120,
		// 	dataIndex: 'userCode',
		// 	align: 'center',
		// 	filterType: 'string',
		// },
		// {
		// 	title: 'Họ tên',
		// 	width: 180,
		// 	dataIndex: 'userFullname',
		// 	filterType: 'string',
		// },
		{
			title: 'Đợt thu',
			dataIndex: 'idDotThu',
			width: 180,
			render: (val, rec) => rec.dotThu?.tenDot,
		},
		{
			title: 'Khoản thu',
			width: 250,
			render: (val, rec) => (
				<ExpandText>
					{rec?.billItems?.map((item) => (
						<div key={item._id}>- {item?.tenKhoanThu}</div>
					))}
				</ExpandText>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			align: 'center',
			width: 150,
			render: (val: EMaTrangThaiThanhToan) =>
				val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
		},
		{
			title: 'Số tiền phải thu',
			width: 120,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.billItems
					?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
					?.reduce((acc, item) => acc + ((item.amountDue ?? 0) - (item.amountDiscount ?? 0)), 0);
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: 'Số tiền đã thu',
			width: 120,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.billItems
					?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
					?.reduce((acc, item) => acc + (item.amountPaid || 0), 0);
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Thông tin thanh toán'
					onClick={() => handleDetail(rec)}
					type='link'
					icon={<EyeOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ userSsoId: props.sinhVienSsoId }}
				buttons={{ create: false, export: true }}
				hideCard
				dependencies={[page, limit]}
				modelName='daotaov2.taichinh.hoadon'
			/>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
			>
				<ThongTinThanhToan setVisible={setVisibleModal} />
			</Modal>
		</>
	);
};

export default CongNoSinhVienPage;
