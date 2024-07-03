import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	EChucVuThanhVienCauLacBo,
	ELoaiThanhVienCauLacBo,
	ETrangThaiThanhVien,
	MapKeyChucVuThanhVienCLB,
	MapKeyVaiTroThanhVienPhongBanCLB,
} from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormThanhVienCLB from './Form';

const ThanhVienCauLacBo = () => {
	const { handleEdit, deleteModel, getModel, putModel } = useModel('caulacbo.thanhvien');
	const { danhSach, getAllModel } = useModel('caulacbo.phongban');
	const { record: recCLB } = useModel('caulacbo.caulacbo');
	const getData = () => {
		getModel({ cauLacBoId: recCLB?._id });
	};
	useEffect(() => {
		getAllModel(false, undefined, { cauLacBoId: recCLB?._id });
	}, [recCLB?._id]);

	const columns: IColumn<CauLacBo.ThanhVien>[] = [
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 150,
			filterType: 'select',
			align: 'center',
			filterData: Object.values(ETrangThaiThanhVien).map((item) => ({ value: item, label: item })),
			render: (val, rec) => (
				<Switch
					size='small'
					checkedChildren='Đang hoạt động'
					unCheckedChildren='Đang hoạt động'
					checked={val === ETrangThaiThanhVien.DANG_HOAT_DONG ? true : false}
					onChange={(checked) =>
						putModel(rec._id, {
							...rec,
							trangThai: checked ? ETrangThaiThanhVien.DANG_HOAT_DONG : ETrangThaiThanhVien.NGUNG_HOAT_DONG,
						} as CauLacBo.ThanhVien)
					}
				/>
			),
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 200,
			align: 'center',
			filterType: 'string',
		},

		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 150,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Vai trò',
			width: 200,
			align: 'center',
			dataIndex: 'chucVuThanhVienCauLacBo',
			render: (val, rec: CauLacBo.ThanhVien) => (
				<div>
					{rec.chucVuThanhVienCauLacBo ? (
						<div>{MapKeyChucVuThanhVienCLB[rec.chucVuThanhVienCauLacBo]}</div>
					) : (
						<div>Thành viên</div>
					)}
				</div>
			),
			filterType: 'select',
			filterData: Object.values(EChucVuThanhVienCauLacBo).map((item) => ({
				value: item,
				label: MapKeyChucVuThanhVienCLB[item],
			})),
		},
		{
			title: 'Loại',
			width: 200,
			align: 'center',
			dataIndex: 'loaiThanhVien',
			filterType: 'select',
			filterData: Object.values(ELoaiThanhVienCauLacBo).map((item) => ({
				value: item,
				label: item,
			})),
		},
		{
			title: 'Ban/bộ phận',
			width: 200,
			dataIndex: 'danhSachBanBoPhan.banBoPhanId',
			render: (val, rec: CauLacBo.ThanhVien) => (
				<div>
					{rec?.danhSachBanBoPhan?.map((item) => (
						<div key={item.banBoPhanId}>
							{`- ${[
								danhSach.find((ele) => ele._id === item.banBoPhanId)?.ten,
								MapKeyVaiTroThanhVienPhongBanCLB?.[item?.vaiTroThanhVienBanBoPhan ?? ''],
							]
								.filter((ele) => ele)
								.join(': ')}`}
						</div>
					))}
				</div>
			),
			filterType: 'select',
			filterData: danhSach.map((item) => ({
				value: item._id,
				label: item.ten,
			})),
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.ThanhVien) => (
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
			params={{ cauLacBoId: recCLB?._id }}
			buttons={{ import: true }}
			getData={getData}
			otherProps={{ size: 'small' }}
			hideCard
			widthDrawer={600}
			Form={FormThanhVienCLB}
			title='Quản lý câu lạc bộ'
			modelName={'caulacbo.thanhvien'}
			columns={columns}
			dependencies={[recCLB?._id]}
		/>
	);
};

export default ThanhVienCauLacBo;
