import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormBieuMau from './components/Form';
import { MapKeyNameLoaiDoiTuongChamDiem } from '@/services/DiemRenLuyen/constants';
import dayjs from 'dayjs';

import { useEffect } from 'react';
import type { BieuMau } from '@/services/DiemRenLuyen/BieuMau/typing';

const DotDiemRenLuyenComponent = () => {
	const { handleEdit, deleteModel, page, limit } = useModel('diemrenluyen.dotvwa');
	const { danhSach, getAllModel } = useModel('daotaov2.hocky.hocky');

	useEffect(() => {
		if (!danhSach.length) getAllModel(false, { ma: -1 });
	}, []);

	const column: IColumn<DotChamDiemRenLuyen.IRecordVWA>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'maHocKy',
			width: 300,
			render: (val) => danhSach.find((item) => item.ma === val)?.ten,
		},
		{
			title: 'Đối tượng',
			dataIndex: 'danhSachDoiTuongChamDiem',
			width: 300,
			render: (val: DotChamDiemRenLuyen.DoiTuongChamDiem[]) => (
				<div>
					{val?.map((item) => (
						<div key={item.loaiDoiTuongChamDiem}>
							{MapKeyNameLoaiDoiTuongChamDiem[item.loaiDoiTuongChamDiem]} (
							{dayjs(item.thoiGianBatDauCham).format('HH:mm DD/MM/YYYY')} -{' '}
							{dayjs(item.thoiGianKetThucCham).format('HH:mm DD/MM/YYYY')})
						</div>
					))}
				</div>
			),
		},
		{
			title: 'Mẫu đánh giá',
			dataIndex: 'mauDrl',
			width: 300,
			render: (val: BieuMau.IRecordVWA) => val?.ten,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotChamDiemRenLuyen.IRecordVWA) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={700}
				Form={FormBieuMau}
				title='Đợt đánh giá'
				columns={column}
				modelName={'diemrenluyen.dotvwa'}
				dependencies={[page, limit]}
			/>
		</>
	);
};

export default DotDiemRenLuyenComponent;
