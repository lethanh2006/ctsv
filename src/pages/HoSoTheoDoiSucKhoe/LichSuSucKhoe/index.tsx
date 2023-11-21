import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { colorETinhTrangSucKhoe, type ETinhTrangSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const LichSuSucKhoeSinhVienPage = () => {
	const { getOneModel, danhSach } = useModel('khaibaosuckhoe.suckhoesinhvien');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [sinhVien, setSinhVien] = useState<DotKhamSucKhoe.ISucKhoeSinhVien[]>();

	const getData = () =>
		getOneModel({ sinhVienSsoId: recSinhVien?.ssoId }).then((rec) => {
			const items = danhSach.filter((item: any) => item?._id === rec._id);
			setSinhVien(items);
		});

	useEffect(() => {
		getData();
	}, [recSinhVien?.ssoId]);

	const columns: IColumn<DotKhamSucKhoe.ISucKhoeSinhVien>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'dotKhamSucKhoeId',
			width: 150,
			render: (val, rec) => rec?.dotKhamSucKhoe?.tenHocKy ?? val,
		},
		{
			title: 'Tên đợt khai báo',
			width: 170,
			dataIndex: 'dotKhamSucKhoeId',
			render: (val, rec) => rec?.dotKhamSucKhoe?.ten ?? val,
		},
		{
			title: 'Sức khỏe',
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 150,
			render: (val, rec) => <Tag color={colorETinhTrangSucKhoe[val as ETinhTrangSucKhoe]}>{val}</Tag>,
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={sinhVien ?? []}
				size='middle'
				addStt
				otherProps={{ scroll: { y: 380 }, pagination: false }}
				hasTotal
			/>
		</>
	);
};

export default LichSuSucKhoeSinhVienPage;
