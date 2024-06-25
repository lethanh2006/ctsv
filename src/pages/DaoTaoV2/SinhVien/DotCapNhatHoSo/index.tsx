import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormThemDot from './components/form';

const DotCapNhatHoSoPage = () => {
	const { handleEdit, getModel, page, limit, deleteModel } = useModel('daotaov2.sinhvien.dotcapnhathoso');

	const getData = () => {
		try {
			getModel();
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<DotCapNhatHoSo.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			width: 150,
			filterType: 'string',
			sortable: true,
		},

		{
			title: 'Thời gian bắt đầu',
			width: 120,
			dataIndex: 'thoiGianBatDau',
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			width: 120,
			dataIndex: 'thoiGianKetThuc',
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotCapNhatHoSo.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getData())}
							title='Bạn có chắc chắn muốn xóa học bổng này?'
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
				dependencies={[page, limit]}
				modelName={'daotaov2.sinhvien.dotcapnhathoso'}
				title={'Đợt cập nhật hồ sơ'}
				Form={FormThemDot}
				rowSelection
				deleteMany
				formProps={{ getData: getData }}
			/>
		</>
	);
};

export default DotCapNhatHoSoPage;
