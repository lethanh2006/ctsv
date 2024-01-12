import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormCot from './FormCot';

const TableCot = () => {
	const { loading, setRecordCot, setVisiblePreview, recordCauHinh, setRecordCauHinh } =
		useModel('diemrenluyen.bieumau');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleCot, setVisibleCot] = useState<boolean>(false);

	const onCancelFormCot = () => {
		setVisibleCot(false);
	};

	const onSortEndCot = (recordTemp: LoaiHinh.Cot, newIndex: number): void => {
		if (!recordCauHinh) return;
		const danhSachCot = recordCauHinh?.danhSachCot?.filter((item) => item.ma !== recordTemp.ma) ?? [];
		danhSachCot?.splice(newIndex, 0, recordTemp);
		setRecordCauHinh({ ...recordCauHinh, danhSachCot });
	};

	const columns: IColumn<LoaiHinh.Cot>[] = [
		// {
		// 	title: 'Mã',
		// 	dataIndex: 'ma',
		// 	align: 'center',
		// 	width: 100,
		// 	filterType: 'string',
		// },
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Kiểu dữ liệu',
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 60,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.Cot) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleCot(true);
								setRecordCot(rec);
								setEdit(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordCauHinh) {
									setRecordCauHinh({
										...recordCauHinh,
										danhSachCot: recordCauHinh?.danhSachCot?.filter((item) => item.ma !== rec.ma) ?? [],
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
				Danh sách cột
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCot}
				rowSortable
				size='small'
				columns={columns}
				data={recordCauHinh?.danhSachCot ?? []}
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
							setRecordCot(undefined);
							setEdit(false);
							setVisibleCot(true);
						}}
					>
						Thêm mới
					</Button>
					<Button icon={<EyeOutlined />} size='small' onClick={() => setVisiblePreview(true)}>
						Xem trước
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				destroyOnClose
				width={700}
				footer={false}
				bodyStyle={{ padding: 0 }}
				visible={visibleCot}
				onCancel={onCancelFormCot}
			>
				<FormCot edit={edit} onCancel={onCancelFormCot} />
			</Modal>
		</div>
	);
};

export default TableCot;
