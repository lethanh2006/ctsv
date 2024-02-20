import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormCheDoChinhSach from './components/Form';
import FormGiaoNopSanPham from './components/FormGiaoNopSanPham';

const CheDoSinhVienComponent = () => {
	const { handleEdit, deleteModel, getModel, setRecord, setVisibleViewForm, visibleViewForm, postModel } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	const onCell = (record: CheDoSinhVien.IRecord) => ({
		onClick: () => {
			setRecord(record);
			setVisibleViewForm(true);
		},
		style: { cursor: 'pointer' },
	});

	const onCancelPreview = () => {
		setVisibleViewForm(false);
	};

	const columns: IColumn<CheDoSinhVien.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 200,
			onCell,
			filterType: 'string',
		},

		{
			title: 'Loại',
			dataIndex: 'loaiCheDoSinhVien',
			width: 120,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ELoaiCheDoSinhVien).map((item) => ({ value: item, label: item })),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CheDoSinhVien.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getModel);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Sao chép'>
						<Button
							type='link'
							icon={<CopyOutlined />}
							onClick={() => {
								postModel({ ...record, ten: record.ten + ' - sao chép' });
							}}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={800}
				Form={FormCheDoChinhSach}
				title='Chế độ chính sách'
				modelName={'chedochinhsach.chedochinhsach'}
				columns={columns}
			/>
			<Modal
				zIndex={1000}
				bodyStyle={{ padding: 0 }}
				footer={
					<Button type='primary' onClick={onCancelPreview}>
						OK
					</Button>
				}
				width={900}
				visible={visibleViewForm}
				onCancel={onCancelPreview}
			>
				<FormGiaoNopSanPham isView getData={() => {}} />
			</Modal>
		</>
	);
};

export default CheDoSinhVienComponent;
