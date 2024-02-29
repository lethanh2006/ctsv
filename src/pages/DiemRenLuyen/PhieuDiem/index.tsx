import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiem/typings';
import {
	ETrangThaiChamDiem,
	EXepLoai,
	MapKeyNameTrangThaiChamDiem,
	MapKeyNameXepLoai,
} from '@/services/DiemRenLuyen/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/components/SelectDot';
import FormPhieuDiem from './components/Form';

const PhieuDiemRenLuyenComponent = () => {
	const { handleEdit, deleteModel, page, limit, condition, setCondition } = useModel('diemrenluyen.phieudiem');

	const column: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: 'Họ và tên',
			dataIndex: ['thongTinNguoiTao', 'ten'],
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinNguoiTao', 'ma'],
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Lớp',
			dataIndex: 'maLopHanhChinh',
			width: 100,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Ngành',
			dataIndex: 'nganh',
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val) => val?.ten,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 150,
			filterType: 'select',
			filterData: Object.values(ETrangThaiChamDiem).map((item) => ({
				value: item,
				label: MapKeyNameTrangThaiChamDiem[item],
			})),
			render: (val: ETrangThaiChamDiem) => MapKeyNameTrangThaiChamDiem[val],
			align: 'center',
		},
		{
			title: 'Điểm',
			dataIndex: 'diemSo',
			width: 100,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Xếp loại',
			dataIndex: 'xepLoai',
			width: 150,
			filterType: 'select',
			filterData: Object.values(EXepLoai).map((item) => ({
				value: item,
				label: MapKeyNameXepLoai[item],
			})),
			render: (val: EXepLoai) => MapKeyNameXepLoai[val],
			align: 'center',
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: PhieuDiemRenLuyen.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa?'
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
		<>
			<TableBase
				otherButtons={[
					<SelectDotDiemRenLuyen
						style={{ width: 250 }}
						onChange={(val) => {
							setCondition({ ...condition, dotDrlId: val });
						}}
						key={'dot'}
					/>,
				]}
				widthDrawer={700}
				Form={FormPhieuDiem}
				title='Kết quả rèn luyện'
				columns={column}
				modelName={'diemrenluyen.phieudiem'}
				dependencies={[page, limit]}
			/>
		</>
	);
};

export default PhieuDiemRenLuyenComponent;
