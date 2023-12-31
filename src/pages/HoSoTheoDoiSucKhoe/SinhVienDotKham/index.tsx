import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { ETinhTrangSucKhoe, colorETinhTrangSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormSinhVienDotKham from './Form';

const SinhVienDotKhamPage = (props: { isKetQua?: boolean }) => {
	const { isKetQua } = props;
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('hosotheodoisuckhoe.suckhoesinhvien');
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { handleView: handleViewSinhVien } = useModel('sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: DotKhamSucKhoe.ISucKhoeSinhVien) => ({
		onClick: () => {
			if (rec.sinhVienSsoId) {
				setSinhVienSsoId(rec.sinhVienSsoId);
				handleViewSinhVien();
			}
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotKhamSucKhoe.ISucKhoeSinhVien>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tình trạng sức khỏe',
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 170,
			filterType: 'select',
			filterData: Object.values(ETinhTrangSucKhoe),
			render: (val, rec) => <Tag color={colorETinhTrangSucKhoe[val as ETinhTrangSucKhoe]}>{val}</Tag>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: any) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Loại bỏ'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id }))}
							title='Bạn có chắc chắn muốn bỏ sinh viên này khỏi đợt khám?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
			hide: isKetQua,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ dotKhamSucKhoeId: recDotKhaiBao?._id }}
				dependencies={[page, limit]}
				modelName='hosotheodoisuckhoe.suckhoesinhvien'
				title='Sinh viên đợt khám sức khỏe'
				Form={FormSinhVienDotKham}
				hideCard
				rowSelection={isKetQua ? false : true}
				deleteMany={isKetQua ? false : true}
				buttons={{ import: !isKetQua ? true : false, create: false }}
			/>

			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} hasDetail />
		</>
	);
};

export default SinhVienDotKhamPage;
