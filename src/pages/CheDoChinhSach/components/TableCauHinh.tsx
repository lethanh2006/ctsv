import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauHinh from './FormCauHinh';

const TableCauHinh = (props: { form: FormInstance; formValues: any; dataState?: string; dataSetState?: string }) => {
	const { record, setRecord, setRecordCauHinh, loading, setEditCauHinh, setVisibleViewForm } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	const onCancelFormCauHinh = () => {
		setVisibleCauHinh(false);
	};

	const onSortEndCauHinh = (recordTemp: LoaiHinh.TruongThongTin, newIndex: number): void => {
		if (!record) return;
		const danhSachCauHinhThongTin =
			record?.danhSachCauHinhThongTin?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		danhSachCauHinhThongTin?.splice(newIndex, 0, recordTemp);
		setRecord({ ...record, danhSachCauHinhThongTin });
	};

	const columns: IColumn<LoaiHinh.TruongThongTin>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
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
			width: 100,
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
								setEditCauHinh(true);
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
										danhSachCauHinhThongTin: record?.danhSachCauHinhThongTin?.filter(
											(item: { ma: string }) => item.ma !== rec.ma,
										),
									});
									props.form.setFieldsValue({
										danhSachCotHienThi: props.formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
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
	useEffect(() => {
		if (!record) {
			// @ts-ignore
			setRecord({
				danhSachCauHinhThongTin: [],
			} as CheDoSinhVien.IRecord);
		}
	}, []);
	return (
		<div>
			<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
				Danh sách các trường thông tin
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={record?.danhSachCauHinhThongTin ?? []}
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
							setEditCauHinh(false);
							setVisibleCauHinh(true);
						}}
					>
						Thêm mới
					</Button>
					<Button
						icon={<EyeOutlined />}
						size='small'
						onClick={() => {
							setRecord(record);
							setVisibleViewForm(true);
						}}
					>
						Xem trước
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				destroyOnHidden
				width={700}
				footer={false}
				styles={{ padding: 0 }}
				open={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh onCancel={onCancelFormCauHinh} dataSetState={props?.dataSetState} dataState={props?.dataState} />
			</Modal>
		</div>
	);
};

export default TableCauHinh;
