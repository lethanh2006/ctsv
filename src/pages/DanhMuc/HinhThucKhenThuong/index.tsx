import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormHinhThucKhenThuong from './components/Form';

const HinhThucKhenThuongPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.hinhthuckhenthuong');

	const columns: IColumn<HinhThucKhenThuong.IRecord>[] = [
		{
			title: 'Mã nội bộ',
			dataIndex: 'ma',
			// align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
		},

		{
			title: 'Tên hình thức khen thưởng',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Loại Khen thưởng',
			dataIndex: 'loaiKhenThuongId',
			width: 120,
			sortable: true,
			render: (val, rec) => rec.loaiKhenThuong?.ten,
		},
		// {
		// 	title: 'Hình thức khen thưởng tham khảo',
		// 	dataIndex: 'maHinhThucKhenThuongHemis',
		// 	width: 120,
		// 	render: (val, rec) => {
		// 		return rec.hinhThucKhenThuongHemis?.ten && rec.hinhThucKhenThuongHemis?.ma
		// 			? rec.hinhThucKhenThuongHemis?.ten + ` (${rec.hinhThucKhenThuongHemis?.ma})`
		// 			: rec.hinhThucKhenThuongHemis?.ten;
		// 	},
		// 	sortable: true,
		// },
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 220,
			filterType: 'string',
			render: (val) => <ExpandText ellipsis={{ rows: 3 }}>{val}</ExpandText>,
			sortable: true,
		},
		// {
		//   title: 'Sử dụng',
		//   dataIndex: 'suDung',
		//   align: 'center',
		//   width: 120,
		//   render: (val, rec) => (
		//     <Switch
		//       checked={val}
		//       onChange={(checked: boolean) => {
		//         putModel(rec._id, { ...rec, suDung: checked });
		//       }}
		//     />
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HinhThucKhenThuong.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa hình thức khen thưởng này?'
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
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.hinhthuckhenthuong'
			title='Hình thức khen thưởng'
			Form={FormHinhThucKhenThuong}
			buttons={{ import: true, export: true }}
			// deleteMany
			// rowSelection
		/>
	);
};

export default HinhThucKhenThuongPage;
