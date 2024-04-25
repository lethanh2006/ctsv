import TableBase from '@/components/Table';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { useModel } from 'umi';
import GroupTagUsers from './GroupTagUsers';

const TableSelectUser = (props: {
	type: EVaiTroBieuMau;
	selectedUsers?: ThongBao.IUser[];
	setSelectedUsers?: (val: ThongBao.IUser[]) => void;
	danhSachDoiTuong?: Record<string, string[]>;
	readOnly?: boolean;
}) => {
	const { selectedUsers = [], setSelectedUsers, danhSachDoiTuong, readOnly, type } = props;
	const { page, limit } = useModel(type === EVaiTroBieuMau.SINH_VIEN ? 'thongbao.sinhvien' : 'thongbao.nhansu');

	const onChange = (keys?: string[], rows?: ThongBao.IUser[]) => {
		if (setSelectedUsers)
			setSelectedUsers(
				rows?.map((item) => ({
					...item,
					vaiTro: type,
				})) ?? [],
			);
	};
	const onCell = (recordVal: ThongBao.IUser) => ({
		onClick: () => {
			const arr = [...selectedUsers];
			const obj = arr?.find((item) => {
				return item?.code === recordVal?.code;
			});
			if (obj) {
				arr.forEach((item, index) => {
					if (item?.code === recordVal?.code) {
						arr.splice(index, 1);
					}
				});
			} else {
				arr.push({
					...recordVal,
					vaiTro: type,
				});
			}
			if (setSelectedUsers) setSelectedUsers(arr);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<ThongBao.IUser>[] = [
		{
			title: type === EVaiTroBieuMau.SINH_VIEN ? 'Mã sinh viên' : 'Mã cán bộ',
			dataIndex: 'code',
			filterType: 'string',
			width: 80,
			onCell,
			align: 'center',
			render: (val, rec) => val || rec.code,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			filterType: 'string',
			width: 180,
			onCell,
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
					dependencies={[page, limit, JSON.stringify(danhSachDoiTuong), type]}
					params={danhSachDoiTuong}
					modelName={type === EVaiTroBieuMau.SINH_VIEN ? 'thongbao.sinhvien' : 'thongbao.nhansu'}
					hideCard
					buttons={{ create: false, reload: false }}
					otherProps={{
						size: 'small',
						rowKey: 'code',
						rowSelection: {
							selectedRowKeys: selectedUsers?.map((item) => item.code),
							onChange,
							preserveSelectedRowKeys: true,
						},
					}}
				/>
			)}
		</>
	);
};

export default TableSelectUser;
