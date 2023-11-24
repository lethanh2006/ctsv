import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormKhoaNganhDotKham from './Form';

const KhoaNganhDotKhamPage = () => {
	const { page, limit, deleteModel, getModel } = useModel('hosotheodoisuckhoe.dotkhamkhoanganh');
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');

	const columns: IColumn<DotKhamSucKhoe.IDotKhamKhoaNganh>[] = [
		{
			title: 'Khóa sinh viên',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'tenKhoaNganh',
			width: 150,
		},
		{
			title: 'Mã ngành',
			dataIndex: 'maNganh',
			width: 100,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec) => (
				<>
					{/* <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip> */}
					<Tooltip title='Loại bỏ'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id }))}
							title='Bạn có chắc chắn muốn bỏ khóa ngành này khỏi đợt khám sức khỏe?'
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
		<>
			<TableBase
				columns={columns}
				params={{ dotKhamSucKhoeId: recDotKhaiBao?._id }}
				dependencies={[page, limit]}
				modelName='hosotheodoisuckhoe.dotkhamkhoanganh'
				title='Khóa ngành - đợt khám sức khỏe'
				Form={FormKhoaNganhDotKham}
				hideCard
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default KhoaNganhDotKhamPage;
