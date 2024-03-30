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
import { useCallback } from 'react';

const PhieuDiemRenLuyenComponent = (props: { ssoId?: string; hideCard?: boolean }) => {
	const { handleEdit, deleteModel, page, limit, condition, setCondition, getModel } =
		useModel('diemrenluyen.phieudiem');
	const { danhSach, record } = useModel('diemrenluyen.dot');
	const { danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const getData = () => {
		getModel({ 'thongTinNguoiTao.ssoId': props?.ssoId });
	};

	const column: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'dotDrlId',
			width: 150,
			render: (val) => danhSachHocKy.find((item) => item.ma === danhSach.find((ele) => ele._id === val)?.maHocKy)?.ten,
		},
		{
			title: 'Họ và tên',
			dataIndex: ['thongTinNguoiTao', 'ten'],
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinNguoiTao', 'ma'],
			width: 120,
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
							onConfirm={() => deleteModel(record._id, getData)}
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

	const Form = useCallback(() => <FormPhieuDiem ssoId={props.ssoId} />, [props.ssoId]);

	return (
		<>
			<TableBase
				params={{ dotDrlId: condition?.dotDrlId }}
				buttons={{ import: true }}
				hideCard={props?.hideCard}
				getData={getData}
				otherButtons={[
					<SelectDotDiemRenLuyen
						value={condition?.dotDrlId}
						isSetRecord
						style={{ width: 250 }}
						onChange={(val) => {
							setCondition({ ...condition, dotDrlId: val });
						}}
						key={'dot'}
					/>,
				]}
				widthDrawer={700}
				Form={Form}
				title='Kết quả rèn luyện'
				columns={column}
				modelName={'diemrenluyen.phieudiem'}
				dependencies={[page, limit]}
			/>
		</>
	);
};

export default PhieuDiemRenLuyenComponent;
