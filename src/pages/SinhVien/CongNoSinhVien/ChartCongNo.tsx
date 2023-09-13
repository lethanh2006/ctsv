import DonutChart from '@/components/Chart/DonutChart';
import { getThongKeCongNoSinhVien } from '@/services/TaiChinh/ChiTietThu';
import { type ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ChartCongNoSinhVien = () => {
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [data, setData] = useState<ChiTietThu.TThongKeCongNo>();

	const fetchData = async () => {
		if (recSinhVien?.ssoId)
			getThongKeCongNoSinhVien(recSinhVien.ssoId)
				.then((res) => setData(res.data))
				.catch((er) => console.log(er));
	};

	useEffect(() => {
		fetchData();
	}, [recSinhVien?.ssoId]);

	return (
		<DonutChart
			yAxis={[[data?.tongTienDaThu ?? 0, data?.tongTienPhaiThu ?? 0]]}
			xAxis={['Đã nộp', 'Chưa nộp']}
			yLabel={['Số tiền']}
			height={320}
			otherOptions={{
				legend: {
					position: 'bottom',
					horizontalAlign: 'center',
				},
			}}
		/>
	);
};

export default ChartCongNoSinhVien;
