import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeHoKhauSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeHoKhau = (props: { mode: 'table' | 'donut' }) => {
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
					xAxis={data.map((item) => (item.tinh ? item.tinh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col span={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên nữ`}
					height={320}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.tinh ? item.tinh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.gioiTinh)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeHoKhau;
