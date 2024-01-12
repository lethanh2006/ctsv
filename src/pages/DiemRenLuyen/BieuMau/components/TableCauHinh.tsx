import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormCauHinh from './FormCauHinh';

const TableCauHinh = () => {
	const { loading, setRecordCauHinh, setVisiblePreview, recordTieuChi, setRecordTieuChi } =
		useModel('diemrenluyen.bieumau');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	const onCancelFormCauHinh = () => {
		setVisibleCauHinh(false);
	};

	const onSortEndCauHinh = (recordTemp: LoaiHinh.TruongThongTin, newIndex: number): void => {
		if (!recordTieuChi) return;
		const danhSachCauHinhMinhChung =
			recordTieuChi?.danhSachCauHinhMinhChung?.filter((item) => item.ma !== recordTemp.ma) ?? [];
		danhSachCauHinhMinhChung?.splice(newIndex, 0, recordTemp);
		setRecordTieuChi({ ...recordTieuChi, danhSachCauHinhMinhChung });
	};

	const columns: IColumn<LoaiHinh.TruongThongTin>[] = [
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
			render: (rec: LoaiHinh.TruongThongTin) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleCauHinh(true);
								setRecordCauHinh(rec);
								setEdit(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordTieuChi) {
									setRecordTieuChi({
										...recordTieuChi,
										danhSachCauHinhMinhChung:
											recordTieuChi?.danhSachCauHinhMinhChung?.filter((item) => item.ma !== rec.ma) ?? [],
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
				Cấu hình thông tin khai báo minh chứng
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={recordTieuChi?.danhSachCauHinhMinhChung ?? []}
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
							setRecordCauHinh(undefined);
							setEdit(false);
							setVisibleCauHinh(true);
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
				visible={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh setEdit={setEdit} edit={edit} onCancel={onCancelFormCauHinh} />
			</Modal>
		</div>
	);
};

export default TableCauHinh;
