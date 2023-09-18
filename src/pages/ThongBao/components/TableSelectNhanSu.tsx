import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { useModel } from 'umi';
import GroupTagUsers from './GroupTagUsers';
import TableStaticData from '@/components/Table/TableStaticData';

const TableSelectNhanSu = (props: {
	selectedUsers?: ThongBao.IUser[];
	setSelectedUsers?: (val: ThongBao.IUser[]) => void;
	danhSachDoiTuong?: Record<string, string[]>;
	readOnly?: boolean;
}) => {
	const { selectedUsers = [], setSelectedUsers, danhSachDoiTuong, readOnly } = props;
	const { page, limit } = useModel('thongbao.nhansu');

	const onChange = (keys?: string[], rows?: ThongBao.IUser[]) => {
		if (setSelectedUsers)
			setSelectedUsers(
				rows?.map((item) => ({
					...item,
					vaiTro: EVaiTroBieuMau.NHAN_VIEN,
				})) ?? [],
			);
	};

	const columns: IColumn<ThongBao.IUser>[] = [
		{
			title: 'Mã cán bộ',
			dataIndex: 'code',
			width: 80,
		},
		{
			title: 'Họ tên',
			width: 150,
			render: (val, rec) => [rec.lastname, rec.firstname].join(' '),
		},
	];

	return (
		<>
			{!readOnly && selectedUsers?.length ? (
				<div style={{ marginBottom: 12 }}>
					<div className='fw500'>Đã chọn</div>
					<GroupTagUsers users={selectedUsers} setUsers={setSelectedUsers} />
				</div>
			) : null}

			{readOnly ? (
				<TableStaticData hasTotal size='small' addStt columns={columns} data={selectedUsers} />
			) : (
				<TableBase
					columns={columns}
					dependencies={[page, limit, danhSachDoiTuong]}
					params={danhSachDoiTuong}
					modelName='thongbao.nhansu'
					hideCard
					buttons={{ create: false, reload: false }}
					rowSelection
					detailRow={{
						selectedRowKeys: selectedUsers?.map((item) => item.code),
						onChange,
						preserveSelectedRowKeys: true,
					}}
					otherProps={{ size: 'small', rowKey: 'code' }}
				/>
			)}
		</>
	);
};

export default TableSelectNhanSu;
