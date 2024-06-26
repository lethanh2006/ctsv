import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeHoKhauSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeHoKhau = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<{ tinh: string; tongSoSv: number; gioiTinh: number }[]>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeHoKhauSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{ tinh: string; tongSoSv: number; gioiTinh: number }>[] = [
		{
			title: 'Tỉnh/TP',
			dataIndex: 'tinh',
			filterType: 'string',
			width: 200,
			align: 'center',
			render: (val) => val || 'Không có thông tin',
		},
		{
			title: 'Số lượng',
			dataIndex: 'tongSoSv',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Nữ',
			dataIndex: 'gioiTinh',
			width: 200,
			sortable: true,
			align: 'center',
		},
	];

	return <TableStaticData addStt columns={columns} data={data} />;
};

export default ThongKeHoKhau;
