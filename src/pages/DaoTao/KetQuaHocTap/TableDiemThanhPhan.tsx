import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type LopHocPhan } from '@/services/DaoTao/LopHocPhan/typing';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface DataType extends LopHocPhan.IRecordSinhVienLopHP {
	title?: string;
	maHocPhan?: string;
	tenHocPhan?: string;
	maHocKy?: string;
}

const TableDiemHocPhan = (props: { sinhVienSsoId: string }) => {
	const { getAllModel } = useModel('daotao.sinhvienlophocphan');
	const [data, setData] = useState<DataType[]>([]);
	const { sinhVienSsoId } = props;

	/** Get Data theo điều kiện: Toàn khóa */
	const getData = (): Promise<LopHocPhan.IRecordSinhVienLopHP[]> => {
		if (sinhVienSsoId) {
			return getAllModel(false, undefined, { sinhVienSsoId });
		}
		return Promise.reject('Invalid sinhVien');
	};

	useEffect(() => {
		getData().then((da) => {
			const res: DataType[] = [];
			const gHocKy = _.groupBy(da, (item) => item.lopHocPhan?.hocKy?.ma); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp tăng dần học kỳ
			aHocKy.forEach(([mahk, lopHpSvList]) => {
				// Thêm 1 hàng trống => Tên học kỳ
				if (lopHpSvList[0].lopHocPhan?.hocKy?.ten)
					res.push({
						_id: '-1',
						idPhieuDktc: '-1',
						lopHocPhanId: '-1',
						sinhVienSsoId: '-1',
						tenHocPhan: lopHpSvList[0].lopHocPhan?.hocKy?.ten,
						maHocKy: mahk,
					});
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(
					...lopHpSvList.map((lop, index) => ({
						...lop,
						title: `${index + 1}`,
						maHocPhan: lop.lopHocPhan?.hocPhan?.ma,
						tenHocPhan: lop.lopHocPhan?.hocPhan?.ten,
					})),
				);
			});

			setData(res);
		});
	}, [sinhVienSsoId]);

	const onCell = (rec: DataType) => ({
		style: {
			fontWeight: rec._id === '-1' ? 600 : undefined,
			backgroundColor: rec._id === '-1' ? '#e8fafdbf' : undefined,
		},
		colSpan: rec._id === '-1' ? 0 : 1,
	});

	const columns: IColumn<DataType>[] = [
		{
			title: 'TT',
			dataIndex: 'title',
			width: 40,
			align: 'center',
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 200,
			filterType: 'string',
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 7 : 1,
			}),
		},
		{
			title: 'Số TC',
			width: 80,
			align: 'center',
			render: (val, rec) => rec.lopHocPhan?.hocPhan?.soTinChi,
			onCell,
		},
		{
			title: 'Điểm thang 10',
			dataIndex: 'diemTongKet',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Điểm thang 4',
			dataIndex: 'diemThang4',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Điểm chữ',
			dataIndex: 'diemChu',
			width: 80,
			align: 'center',
			onCell,
		},
	];

	// const dataDisplay = data.map((item) => {
	// 	if (item._id === '-1' && danhSachKQHK.length > 1) {
	// 		const kqhk = danhSachKQHK.find((j) => j.maHocKy === item.maHocKy);
	// 		if (kqhk)
	// 			return {
	// 				...item,
	// 				tenHocPhan: `${item.tenHocPhan} (TB học kỳ: ${kqhk.trungBinhHocKy}, số TC đạt: ${kqhk.soTinChiDat}, tổng số TC tích lũy: ${kqhk.tongSoTinChiTichLuy})`,
	// 			};
	// 	}
	// 	return item;
	// });

	return (
		<>
			{/* <Space wrap>
				<ButtonExtend
					icon={<ExportOutlined />}
					onClick={() => {
						message.warn('Đang phát triển...');
					}}
				>
					Xuất dữ liệu
				</ButtonExtend>
			</Space> */}

			<TableStaticData
				columns={columns}
				data={data}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			/>
		</>
	);
};

export default TableDiemHocPhan;
