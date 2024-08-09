import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { CloseOutlined } from '@ant-design/icons';

const GroupTagUsers = (props: {
	users?: ThongBao.IUser[];
	setUsers?: (users: ThongBao.IUser[]) => void;
	type?: string;
}) => {
	const { users, setUsers, type } = props;

	const onClose = (code: string) => {
		const tmp = users?.filter((item) => item.code !== code) ?? [];
		if (setUsers) setUsers(tmp);
	};

	const columns: IColumn<ThongBao.IUser>[] = [
		{
			title: type === EVaiTroBieuMau.SINH_VIEN ? 'Mã sinh viên' : 'Mã cán bộ',
			dataIndex: 'code',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			render: (val, rec) => (
				<ButtonExtend onClick={() => onClose(rec?.code)} type='link' danger icon={<CloseOutlined />} />
			),
		},
	];

	return (
		// <Space wrap style={{ marginTop: 6 }}>
		// 	{users?.map((item) => (
		// 		<Tag key={item.code} closable onClose={() => onClose(item.code)}>
		//       {`${item.fullname?`${item.fullname} - `:''}`} {item.code}
		// 		</Tag>
		// 	))}
		// </Space>

		<TableStaticData
			data={users ?? []}
			columns={columns}
			addStt
			size='small'
			otherProps={{ scroll: { y: 360 }, pagination: true }}
			hasTotal
		>
			<div className='fw500'>Đã chọn</div>
		</TableStaticData>
	);
};

export default GroupTagUsers;
