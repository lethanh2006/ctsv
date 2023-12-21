import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	EChucVuThanhVienCauLacBo,
	MapKeyChucVuThanhVienCLB,
	MapKeyVaiTroThanhVienPhongBanCLB,
} from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormThanhVienCLB from './Form';

const ThanhVienCauLacBo = () => {
	const { handleEdit, deleteModel, getModel } = useModel('caulacbo.thanhvien');
	const { danhSach } = useModel('caulacbo.phongban');

	const columns: IColumn<CauLacBo.ThanhVien>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 200,
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
								deleteModel(record._id, getModel);
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
			otherProps={{ size: 'small' }}
			hideCard
			widthDrawer={600}
			Form={FormThanhVienCLB}
			title='Quản lý câu lạc bộ'
			modelName={'caulacbo.thanhvien'}
			columns={columns}
		/>
	);
};

export default ThanhVienCauLacBo;
