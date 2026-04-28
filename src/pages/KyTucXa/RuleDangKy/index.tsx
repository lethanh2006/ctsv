import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ERuleType, colorRuleType, transRuleType } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const RuleDangKyPhongKTXPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit, putModel } = useModel('kytucxa.dangkythuerule');

	const columns: IColumn<KyTucXa.IRuleDangKyThueKTX>[] = [
		{
			title: 'STT',
			dataIndex: 'stt',
			width: 60,
			align: 'center',
			sortable: true,
		},
		{
			title: 'Mã rule',
			dataIndex: 'ma',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Tên rule',
			width: 200,
			dataIndex: 'ten',
			filterType: 'string',
		},
		{
			title: 'Loại',
			dataIndex: 'loai',
			width: 160,
			filterType: 'select',
			filterData: Object.values(ERuleType),
			render: (val: ERuleType) =>
				val && <Tag color={colorRuleType[val]}>{transRuleType[val] ?? val}</Tag>,
		},
		{
			title: 'Tòa áp dụng',
			dataIndex: 'maToaNha',
			width: 120,
		},
		{
			title: 'Phòng áp dụng',
			dataIndex: 'maPhong',
			width: 130,
		},
		{
			title: 'Kích hoạt',
			dataIndex: 'isActive',
			width: 90,
			align: 'center',
			render: (val: boolean, record) => (
				<Switch
					checked={val}
					size='small'
					onChange={(checked) =>
						putModel(record._id, { isActive: checked } as any, getModel, true)
					}
				/>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa rule này?'
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
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.dangkythuerule'
			title='Cấu hình quy tắc đăng ký'
			Form={Form}
			rowSelection
			deleteMany
		/>
	);
};

export default RuleDangKyPhongKTXPage;
