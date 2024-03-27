import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormPhongBan from './Form';
import { EOperatorType } from '@/components/Table/constant';

const PhongBanCauLacBo = () => {
	const { handleEdit, deleteModel, getModel } = useModel('caulacbo.phongban');
	const { record: recCLB } = useModel('caulacbo.caulacbo');
	const { filters, setFilters } = useModel('caulacbo.thanhvien');

	const getData = () => {
		getModel({ cauLacBoId: recCLB?._id });
	};

	const onCell = (record: CauLacBo.PhongBan) => ({
		onClick: () => {
			setFilters([
				...filters.filter((item) => item.field !== 'danhSachBanBoPhan.banBoPhanId'),
				{ field: 'danhSachBanBoPhan.banBoPhanId', values: [record._id], operator: EOperatorType.INCLUDE, active: true },
			]);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<CauLacBo.PhongBan>[] = [
		{
			title: 'Tên ban/bộ phận',
			dataIndex: 'ten',
			width: 200,
			onCell,
			filterType: 'string',
		},

		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			align: 'center',
			ellipsis: {
				showTitle: false,
			},
			render: (val) => (
				<Tooltip placement='topLeft' title={val}>
					{val}
				</Tooltip>
			),
			onCell,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.PhongBan) => (
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
								deleteModel(record._id, getData);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			addStt
			otherProps={{
				size: 'small',
			}}
			hideCard
			widthDrawer={600}
			Form={FormPhongBan}
			title='Quản lý câu lạc bộ'
			modelName={'caulacbo.phongban'}
			columns={columns}
			dependencies={[recCLB?._id]}
		/>
	);
};

export default PhongBanCauLacBo;
