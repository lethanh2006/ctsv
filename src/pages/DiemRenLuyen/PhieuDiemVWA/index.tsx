import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiem/typings';
import {
	ETrangThaiChamDiem,
	EXepLoai,
	MapKeyNameTrangThaiChamDiem,
	MapKeyNameXepLoai,
} from '@/services/DiemRenLuyen/constants';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../DotVWA/components/SelectDot';
import FormPhieuDiem from './components/Form';
import FormCapNhatTrangThai from './components/FormCapNhatTrangThai';

const PhieuDiemRenLuyenComponent = (props: { ssoId?: string; hideCard?: boolean }) => {
	const {
		handleEdit,
		deleteModel,
		page,
		limit,
		condition,
		setCondition,
		getModel,
		// danhSach: danhSachPhieuDiem,
	} = useModel('diemrenluyen.phieudiem');
	const { danhSach } = useModel('diemrenluyen.dotvwa');
	const { danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const getData = () => {
		getModel({ 'thongTinNguoiTao.ssoId': props?.ssoId });
	};
	const [visibleFormDoiTrangThai, setVisibleFormDoiTrangThai] = useState(false);

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
			render: (val, rec) => rec.thongTinNguoiTao.ten,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinNguoiTao', 'ma'],
			width: 120,
			filterType: 'string',
			render: (val, rec) => rec.thongTinNguoiTao.ma,
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
			sortable: true,
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
			title: 'Điểm trung bình',
			width: 150,
			dataIndex: 'diemTrungBinh',
			align: 'center',
			// hide: props.ssoId ? false : true,
			// sortable: true,
			// render: (val, rec, index) => {
			// 	return (
			// 		danhSachPhieuDiem?.filter((item, ind) => ind <= index)?.reduce((pre, cur) => pre + cur?.diemSo ?? 0, 0) /
			// 		(index + 1)
			// 	).toFixed(2);
			// },
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: PhieuDiemRenLuyen.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getData)}
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
				buttons={{ import: true, export: true }}
				hideCard={props?.hideCard}
				getData={getData}
				otherButtons={[
					<SelectDotDiemRenLuyen
						allowClear
						value={condition?.dotDrlId}
						isSetRecord
						style={{ width: 250 }}
						onChange={(val) => {
							setCondition({ ...condition, dotDrlId: val });
						}}
						key={'dot'}
					/>,
					<Tooltip title={!condition?.dotDrlId ? 'Vui lòng chọn một học kỳ' : ''} key={'trangthai'}>
						<Button
							disabled={!condition?.dotDrlId}
							onClick={() => {
								setVisibleFormDoiTrangThai(true);
							}}
							type='primary'
							icon={<CheckOutlined />}
						>
							Cập nhật trạng thái
						</Button>
					</Tooltip>,
				]}
				widthDrawer={700}
				Form={Form}
				title='Kết quả rèn luyện'
				columns={column}
				modelName={'diemrenluyen.phieudiem'}
				dependencies={[page, limit]}
			/>
			<Modal
				visible={visibleFormDoiTrangThai}
				onCancel={() => {
					setVisibleFormDoiTrangThai(false);
				}}
				footer={false}
				bodyStyle={{ padding: 0 }}
			>
				<FormCapNhatTrangThai getData={getData} onCancel={() => setVisibleFormDoiTrangThai(false)} />
			</Modal>
		</>
	);
};

export default PhieuDiemRenLuyenComponent;
