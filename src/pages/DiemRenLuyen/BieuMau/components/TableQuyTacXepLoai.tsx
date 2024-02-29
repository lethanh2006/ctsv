import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormQuyTacXepLoai from './FormQuyTacXepLoai';
import type { EXepLoai } from '@/services/DiemRenLuyen/constants';
import { MapKeyNameXepLoai } from '@/services/DiemRenLuyen/constants';

const TableQuyTacXepLoai = () => {
	const { record, loading, setRecord, setRecordQuyTacXepLoai } = useModel('diemrenluyen.bieumau');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleQuyTacXepLoai, setVisibleQuyTacXepLoai] = useState<boolean>(false);

	const onCancelFormQuyTacXepLoai = () => {
		setVisibleQuyTacXepLoai(false);
		setRecordQuyTacXepLoai(undefined);
	};

	const onSortEndCauHinh = (recordTemp: MauDiemRenLuyen.QuyTacXepLoai, newIndex: number): void => {
		if (!record) return;
		const danhSachQuyTacXepLoai =
			record?.danhSachQuyTacXepLoai?.filter((item) => item.xepLoai !== recordTemp.xepLoai) ?? [];
		danhSachQuyTacXepLoai?.splice(newIndex, 0, recordTemp);
		setRecord({ ...record, danhSachQuyTacXepLoai });
	};

	const columns: IColumn<MauDiemRenLuyen.QuyTacXepLoai>[] = [
		{
			title: 'Xếp loại',
			dataIndex: 'xepLoai',
			width: 170,
			filterType: 'string',
			render: (val: EXepLoai) => MapKeyNameXepLoai[val],
		},
		{
			title: 'Thang điểm',
			align: 'center',
			width: 80,
			render: (rec: MauDiemRenLuyen.QuyTacXepLoai) => (
				<div>
					{rec.canDuoi} - {rec.canTren}
				</div>
			),
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: MauDiemRenLuyen.QuyTacXepLoai) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleQuyTacXepLoai(true);
								setRecordQuyTacXepLoai(rec);
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
										danhSachQuyTacXepLoai: record?.danhSachQuyTacXepLoai?.filter(
											(item) => item.xepLoai !== rec.xepLoai,
										),
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
				Danh sách quy tắc xếp loại
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={record?.danhSachQuyTacXepLoai ?? []}
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
							setRecordQuyTacXepLoai(undefined);
							setEdit(false);
							setVisibleQuyTacXepLoai(true);
						}}
					>
						Thêm mới
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				destroyOnClose
				width={500}
				footer={false}
				bodyStyle={{ padding: 0 }}
				visible={visibleQuyTacXepLoai}
				onCancel={onCancelFormQuyTacXepLoai}
			>
				<FormQuyTacXepLoai setEdit={setEdit} onCancel={onCancelFormQuyTacXepLoai} edit={edit} />
			</Modal>
		</div>
	);
};

export default TableQuyTacXepLoai;
