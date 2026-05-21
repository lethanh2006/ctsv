import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import Form from './components/Form';
import ImportPhongKTX from './components/Import';
import ExportPhongKTX from './components/Export';

const PhongKTXPage = () => {
	const { danhSach: danhSachToaNha, getAllModel: getAllToaNha } = useModel('kytucxa.toa');
	const { getModel, page, limit, handleEdit } = useModel('kytucxa.phong');
	const { danhSach: danhSachKhoanThu, getAllModel: getAllKhoanThu } = useModel('kytucxa.khoanthu');
	const { danhSach: danhSachTienIchAll, getAllModel: getAllTienIch } = useModel('kytucxa.tienich');

	useEffect(() => {
		getAllToaNha();
		getAllKhoanThu();
		getAllTienIch();
	}, []);

	const customButtons = [
        <ImportPhongKTX key="import" onSuccessReload={getModel} />,
        <ExportPhongKTX key="export" getModel={getModel} danhSachTienIchAll={danhSachTienIchAll} />
    ];

	const columns: IColumn<KyTucXa.IPhongKTX>[] = [
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
			render: (val) => danhSachToaNha?.find((item: KyTucXa.IToaKTX) => item?.ma === val)?.ten || '-',
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
			title: 'Tên khoản thu phòng',
			dataIndex: 'maKhoanThuPhong',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: KyTucXa.IKhoanThuKTX) => item?.maMucThu === val)?.ten || '-',
		},
		{
			title: 'Tên khoản thu cọc',
			dataIndex: 'maKhoanThuCoc',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: KyTucXa.IKhoanThuKTX) => item?.maMucThu === val)?.ten || '-',
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
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.phong'
			title="Cấu hình phòng"
			Form={Form}
			rowSelection
			deleteMany
			otherButtons={customButtons}
			buttons={{ create: false }}
		/>		
	);
};

export default PhongKTXPage;
