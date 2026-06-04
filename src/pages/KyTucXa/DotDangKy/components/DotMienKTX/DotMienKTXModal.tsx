import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import FormMienKTX from './FormMienKTX';

type Props = {
	open: boolean;
	id?: string;
	onClose: () => void;
};

const DotMienKTXModal: React.FC<Props> = ({ open, id, onClose }) => {
	const { handleEdit, deleteModel, getModel, getMienDangKy, setDanhSach } = useModel('kytucxa.dotmiendangkyktx');

	const normalizeList = (res: any) => {
		const root = res?.data ?? res;
		const body = root?.data ?? root;
		if (Array.isArray(body)) return body;
		if (Array.isArray(body?.result)) return body.result;
		return [];
	};

	useEffect(() => {
		if (open && id && getMienDangKy) {
			getMienDangKy(id)
				.then((res: any) => setDanhSach(normalizeList(res)))
				.catch((er: any) => console.error(er));
		}
	}, [open, id]);

	const columns: IColumn<KyTucXa.IDotMienDangKyKTX>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 220,
			render: (value) => (value ? value : '--'),
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Minh chứng',
			dataIndex: 'urlMinhChung',
			width: 220,
			filterType: 'string',
			render: (value) => (value ? value : '--'),
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'ngayDuyet',
			width: 180,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: 'Ghi chú duyệt',
			dataIndex: 'ghiChuDuyet',
			width: 220,
			render: (value) => (value ? value : '--'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiMinhChung',
			width: 150,
			align: 'center',
			render: (value) => (value ? String(value) : '--'),
		},

		{
			title: 'Thao tác',
			width: 150,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đợt đăng ký này?'
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
		<Modal title='ID Đợt' open={open} onOk={onClose} onCancel={onClose} okText='Đóng' width={900} style={{ top: 20 }}>
			<TableBase
				columns={columns}
				modelName='kytucxa.dotmiendangkyktx'
				title='Đợt miễn đăng ký ký túc xá'
				Form={FormMienKTX}
				formProps={{ dotId: id }}
				getData={(params?: any) =>
					id ? getMienDangKy(id, params).then((res: any) => setDanhSach(normalizeList(res))) : Promise.resolve([])
				}
				widthDrawer={900}
			/>
		</Modal>
	);
};

export default DotMienKTXModal;
