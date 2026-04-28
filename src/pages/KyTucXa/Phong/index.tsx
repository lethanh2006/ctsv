import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import Form from './components/Form';

const PhongKTXPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('kytucxa.phong');
	const { danhSach: danhSachKhoanThu, getAllModel: getAllKhoanThu } = useModel('kytucxa.khoanthu');

	useEffect(() => {
		getAllKhoanThu();
	}, []);

	const columns: IColumn<KyTucXa.IPhongKyTucXa>[] = [
		{
			title: 'Mã phòng',
			dataIndex: 'ma',
			width: 100,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên phòng',
			dataIndex: 'ten',
			width: 150,
			sortable: true,
		},
		{
			title: 'Tòa nhà',
			dataIndex: 'maToaNha',
			width: 120,
		},
		{
			title: 'Sức chứa',
			dataIndex: 'soLuongToiDa',
			align: 'center',
			width: 100,
		},
		{
			title: 'Đang ở',
			dataIndex: 'soLuongHienTai',
			align: 'center',
			width: 100,
		},
		{
			title: 'Giới tính',
			dataIndex: 'maGioiTinh',
			align: 'center',
			width: 100,
		},
		{
			title: 'Tên khoản thu phòng',
			dataIndex: 'maKhoanThuPhong',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: any) => item?._id === val)?.ten || val,
		},
		{
			title: 'Tên khoản thu cọc',
			dataIndex: 'maKhoanThuCoc',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: any) => item?._id === val)?.ten || val,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa phòng ký túc xá này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.phong'
			title="Phòng"
			Form={Form}
			rowSelection
			deleteMany
			buttons={{ import: true, export: true, create: false }}
		/>
	);
};

export default PhongKTXPage;
