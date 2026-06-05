import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Modal, Popconfirm, Tooltip, message, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import FormMienKTX from './FormMienKTX';

type Props = {
	open: boolean;
	id?: string;
	onClose: () => void;
};

const DotMienKTXModal: React.FC<Props> = ({ open, id, onClose }) => {
	const { deleteModel, getModel, getMienDangKy, setDanhSach, postDuyet, postTuChoi } = useModel(
		'kytucxa.dotmiendangkyktx',
	);

	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [rejectRecord, setRejectRecord] = useState<KyTucXa.IDotMienDangKyKTX | null>(null);
	const [rejectReason, setRejectReason] = useState('');

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
					<Tooltip title='Duyệt'>
						<Popconfirm
							title='Xác nhận duyệt minh chứng?'
							onConfirm={() => {
								if (!postDuyet) return;
								postDuyet(id || '', record._id)
									.then(() => {
										message.success('Duyệt thành công');
										if (getMienDangKy && id) getMienDangKy(id).then((res: any) => setDanhSach(normalizeList(res)));
									})
									.catch((err: any) => {
										console.error(err);
										message.error('Duyệt thất bại');
									});
							}}
							placement='topLeft'
						>
							<Button type='link' icon={<CheckOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Từ chối'>
						<Button
							danger
							type='link'
							icon={<CloseOutlined />}
							onClick={() => {
								setRejectRecord(record);
								setRejectModalOpen(true);
							}}
						/>
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

	const handleRejectSubmit = () => {
		if (!postTuChoi || !rejectRecord) return;
		postTuChoi(id || '', rejectRecord._id, { ghiChuDuyet: rejectReason })
			.then(() => {
				message.success('Từ chối thành công');
				setRejectModalOpen(false);
				setRejectReason('');
				setRejectRecord(null);
				if (getMienDangKy && id) getMienDangKy(id).then((res: any) => setDanhSach(normalizeList(res)));
			})
			.catch((err: any) => {
				console.error(err);
				message.error('Từ chối thất bại');
			});
	};

	const handleRejectCancel = () => {
		setRejectModalOpen(false);
		setRejectReason('');
		setRejectRecord(null);
	};

	return (
		<>
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

			<Modal
				title='Từ chối minh chứng'
				open={rejectModalOpen}
				onOk={handleRejectSubmit}
				onCancel={handleRejectCancel}
				okText='Từ chối'
				cancelText='Hủy'
				okButtonProps={{ danger: true }}
				destroyOnClose
			>
				<p>
					Xác nhận từ chối minh chứng của sinh viên{' '}
					<strong>
						{rejectRecord?.hoTen} ({rejectRecord?.maSinhVien})
					</strong>
					?
				</p>
				<div style={{ marginBottom: 8 }}>Ghi chú từ chối:</div>
				<Input.TextArea
					rows={4}
					placeholder='Nhập lý do từ chối (tùy chọn)...'
					value={rejectReason}
					onChange={(e) => setRejectReason(e.target.value)}
				/>
			</Modal>
		</>
	);
};

export default DotMienKTXModal;
