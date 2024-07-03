import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeDanTocSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeDanToc = (props: { mode: 'table' | 'donut' }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<
		{ danToc: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }[]
	>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeDanTocSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{ danToc: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }>[] = [
		{
			title: 'Dân tộc',
			dataIndex: 'danToc',
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
			dataIndex: 'nu',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Nam',
			dataIndex: 'nam',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Không có thông tin',
			dataIndex: 'noInfoGioiTinh',
			width: 200,
			sortable: true,
			align: 'center',
		},
	];

	return props.mode === 'table' ? (
		<TableStaticData addStt columns={columns} data={data} />
	) : (
		<Row>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên`}
					height={220}
					yLabel={['Sinh viên']}
					xAxis={data.map((item) => (item.danToc ? item.danToc : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nữ`}
					height={220}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.danToc ? item.danToc : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nu)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nam`}
					height={220}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.danToc ? item.danToc : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nam)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeDanToc;
