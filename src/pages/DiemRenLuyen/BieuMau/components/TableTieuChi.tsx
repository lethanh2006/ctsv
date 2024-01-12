import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormTieuChi from './FormTieuChi';

const TableTieuChi = () => {
	const { record, loading, setRecord, setRecordTieuChi, setVisiblePreview } = useModel('diemrenluyen.bieumau');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleTieuChi, setVisibleTieuChi] = useState<boolean>(false);

	const onCancelFormTieuChi = () => {
		setVisibleTieuChi(false);
		setRecordTieuChi(undefined);
	};

	const onSortEndCauHinh = (recordTemp: MauDiemRenLuyen.TieuChiDanhGia, newIndex: number): void => {
		if (!record) return;
		const danhSachTieuChiDanhGia = record?.danhSachTieuChiDanhGia?.filter((item) => item.ma !== recordTemp.ma) ?? [];
		danhSachTieuChiDanhGia?.splice(newIndex, 0, recordTemp);
		setRecord({ ...record, danhSachTieuChiDanhGia });
	};

	const onCell = (recordTieuChi: MauDiemRenLuyen.TieuChiDanhGia) => ({
		onClick: () => {
			if (recordTieuChi.yeuCauMinhChung) setVisiblePreview(true);
			setRecordTieuChi(recordTieuChi);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MauDiemRenLuyen.TieuChiDanhGia>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thang điểm',
			align: 'center',
			width: 80,
			render: (rec: MauDiemRenLuyen.TieuChiDanhGia) => (
				<div>
					{rec.canDuoi} - {rec.canTren}
				</div>
			),
			onCell,
		},
		{
			title: 'Yêu cầu minh chứng',
			align: 'center',
			dataIndex: 'yeuCauMinhChung',
			width: 80,
			render: (val, rec) => (
				<div>
					{val ? (
						<div>
							Có (
							<a
								onClick={() => {
									setVisiblePreview(true);
									setRecordTieuChi(rec);
								}}
							>
								Mẫu khai báo minh chứng
							</a>
							)
						</div>
					) : (
						'Không'
					)}
				</div>
			),
			filterType: 'select',
			filterData: [
				{ value: true, label: 'Có' },
				{ value: false, label: 'Không' },
			],
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: MauDiemRenLuyen.TieuChiDanhGia) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleTieuChi(true);
								setRecordTieuChi(rec);
								setEdit(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (record) {
									setRecord({
										...record,
										danhSachTieuChiDanhGia: record?.danhSachTieuChiDanhGia?.filter((item) => item.ma !== rec.ma),
									});
								}
							}}
							title='Bạn có chắc chắn muốn xóa?'
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
		<div>
			<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
				Danh sách tiêu chí đánh giá
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={record?.danhSachTieuChiDanhGia ?? []}
				addStt
				hasTotal
				loading={loading}
			>
				<Space wrap>
					<Button
						size='small'
						type='primary'
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecordTieuChi(undefined);
							setEdit(false);
							setVisibleTieuChi(true);
						}}
					>
						Thêm mới
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				destroyOnClose
				width={800}
				footer={false}
				bodyStyle={{ padding: 0 }}
				visible={visibleTieuChi}
				onCancel={onCancelFormTieuChi}
			>
				<FormTieuChi setEdit={setEdit} onCancel={onCancelFormTieuChi} edit={edit} />
			</Modal>
		</div>
	);
};

export default TableTieuChi;
