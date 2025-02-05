import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/KhaoSat/BieuMau/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Switch } from 'antd';
import { useModel } from 'umi';
import FormViewDetailKhaoSat from './components/FormViewDetailKhaoSat';
import Form from './components/Modal';
import { ELoaiBieuMau } from '@/services/KhaoSat/constant';
import ViewDetailDanhGiaCanBo from './components/FormViewDetailDanhGiaCanBo';
import ViewDetailDiemRenLuyen from './components/FormViewDetailDiemRenLuyen';

const KhaoSatPage = () => {
	const {
		page,
		limit,
		deleteModel,
		handleEdit,
		handleView,
		isView,
		kichHoatBieuMauModel,
		record: recordBieuMau,
		getModel,
	} = useModel('khaosat.bieumau');

	const getData = () => {
		getModel({ loai: ELoaiBieuMau.CHAM_DIEM_REN_LUYEN });
	};

	const handleChangeStatus = (rec: BieuMau.IRecord) =>
		kichHoatBieuMauModel({ id: rec._id, data: { kichHoat: !rec.kichHoat } }, getData);

	const onCell = (record: BieuMau.IRecord) => ({
		onClick: () => handleView(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BieuMau.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		// {
		// 	title: 'Loại biểu mẫu',
		// 	dataIndex: 'loai',
		// 	width: 120,
		// 	filterType: 'select',
		// 	filterData: Object.values(ELoaiBieuMau),
		// 	onCell,
		// },
		{
			title: 'Trạng thái',
			dataIndex: 'kichHoat',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, record) => (
				<Switch checked={record.kichHoat} onChange={() => handleChangeStatus(record)} size='small' />
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: BieuMau.IRecord) => (
				<>
					<Tooltip title='Xem trước'>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>

					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							// disabled={!canDelete}
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa khảo sát này?'
							placement='topRight'
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
			columns={columns}
			dependencies={[page, limit]}
			modelName='khaosat.bieumau'
			title='Biểu mẫu'
			widthDrawer={800}
			getData={getData}
			formProps={{ getData: getData }}
			Form={
				(isView
					? recordBieuMau?.loai === ELoaiBieuMau.KHAO_SAT
						? FormViewDetailKhaoSat
						: recordBieuMau?.loai === ELoaiBieuMau.DANH_GIA_CAN_BO
						? ViewDetailDanhGiaCanBo
						: ViewDetailDiemRenLuyen
					: Form) as any
			}
		/>
	);
};

export default KhaoSatPage;
