import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import { ETrangThaiKhaiBaoSucKhoe, colorETrangThaiKhaiBaoSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ModalDotKhamSucKhoe from './components/ModalDotKhamSucKhoe';

const DotKhamSucKhoePage = () => {
	const { page, limit, deleteModel, handleEdit } = useModel('khaibaosuckhoe.dotkhaibaosuckhoe');
	const { record: recHocKy, setRecord, danhSach: danhSachHocKy } = useModel('hocky.hocky');

	const onCell = (record: DotKhamSucKhoe.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<any>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'tenHocKy',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectHocKy selectMa />,
			onCell,
		},
		{
			title: 'Tên đợt khai báo',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiKhaiBaoSucKhoe),
			render: (val, rec) => <Tag color={colorETrangThaiKhaiBaoSucKhoe[val as ETrangThaiKhaiBaoSucKhoe]}>{val}</Tag>,
			width: 120,
			onCell,
		},
		// {
		// 	title: 'Kích hoạt',
		// 	dataIndex: 'kichHoat',
		// 	width: 80,
		// 	align: 'center',
		// 	// render: (val, rec) => <Switch size='small' checked={val} onChange={(checked) => onChecked(checked, rec)} />,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id)}
							title='Bạn có chắc chắn muốn xóa đợt đăng ký này?'
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
		<Card title='Đợt khai báo sức khỏe'>
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
				<SelectHocKy
					style={{ width: 250 }}
					value={recHocKy?.ma}
					onChange={(val) => {
						setRecord(danhSachHocKy.find((item) => item.ma === val));
					}}
					isSetRecord
					selectMa
				/>
			</div>

			<TableBase
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='khaibaosuckhoe.dotkhaibaosuckhoe'
				title='Đợt khai báo sức khỏe'
				Form={ModalDotKhamSucKhoe}
				widthDrawer={1000}
				hideCard
				rowSelection
				deleteMany
			/>
		</Card>
	);
};

export default DotKhamSucKhoePage;
