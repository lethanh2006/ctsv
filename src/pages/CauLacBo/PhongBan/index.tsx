import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormPhongBan from './Form';

const PhongBanCauLacBo = () => {
	const { handleEdit, deleteModel, getModel } = useModel('caulacbo.phongban');

	const getData = () => {
		getModel(undefined, undefined, undefined, 1, 100);
	};

	const columns: IColumn<CauLacBo.PhongBan>[] = [
		{
			title: 'Tên ban/bộ phận',
			dataIndex: 'ten',
			width: 200,
		},

		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 150,
			align: 'center',
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
			otherProps={{ size: 'small', pagination: false }}
			hideCard
			widthDrawer={600}
			Form={FormPhongBan}
			title='Quản lý câu lạc bộ'
			modelName={'caulacbo.phongban'}
			columns={columns}
		/>
	);
};

export default PhongBanCauLacBo;
