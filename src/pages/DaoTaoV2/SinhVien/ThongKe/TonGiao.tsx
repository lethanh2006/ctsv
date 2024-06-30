import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeTonGiaoSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeTonGiao = (props: { mode: 'table' | 'donut' }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<{ tonGiao: string; tongSoSv: number; gioiTinh: number }[]>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeTonGiaoSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{ tonGiao: string; tongSoSv: number; gioiTinh: number }>[] = [
		{
			title: 'Tôn giáo',
			dataIndex: 'tonGiao',
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

	return props.mode === 'table' ? (
		<TableStaticData addStt columns={columns} data={data} />
	) : (
		<Row>
			<Col span={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên`}
					height={320}
					yLabel={['Sinh viên']}
					xAxis={data.map((item) => (item.tonGiao ? item.tonGiao : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col span={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên nữ`}
					height={320}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.tonGiao ? item.tonGiao : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.gioiTinh)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeTonGiao;
