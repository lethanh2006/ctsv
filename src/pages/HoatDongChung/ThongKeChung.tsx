import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { thongKeChung } from '@/services/HoatDongChung';
import type { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { tienVietNam } from '@/utils/utils';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';

const ThongKeChung = (props: { phanLoaiCap1: EHoatDongChungType1; phanLoaiCap2?: EHoatDongChungType2 }) => {
	const { phanLoaiCap1, phanLoaiCap2 } = props;
	const [data, setData] = useState<
		{
			phanLoaiCap1: string;
			phanLoaiCap2: string;
			tongKinhPhi: number;
			tongSoHoatDong: number;
			tongThamGia: number;
		}[]
	>();
	const getData = async () => {
		const res = await thongKeChung({ condition: { phanLoaiCap1, phanLoaiCap2 } });
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Row gutter={[16, 16]}>
			<Col md={12} lg={12}>
				<Card size='small' title={'Số lượng hoạt động'}>
					<DonutChart
						showTotal
						formatY={(val) => `${val} hoạt động`}
						height={250}
						yLabel={['Hoạt động']}
						xAxis={data?.map((item) => item.phanLoaiCap2) ?? []}
						yAxis={[data?.map((item) => item?.tongSoHoatDong ?? 0) ?? []]}
					/>
				</Card>
			</Col>
			<Col md={12} lg={12}>
				<Card size='small' title={'Số lượng người tham gia'}>
					<DonutChart
						showTotal
						formatY={(val) => `${val} người`}
						height={250}
						yLabel={['Hoạt động']}
						xAxis={data?.map((item) => item.phanLoaiCap2) ?? []}
						yAxis={[data?.map((item) => item?.tongThamGia ?? 0) ?? []]}
					/>
				</Card>
			</Col>
			<Col md={12} lg={24}>
				<Card size='small' title={'Kinh phí'}>
					<DonutChart
						showTotal
						formatY={(val) => tienVietNam(val || 0)}
						height={250}
						yLabel={['VND']}
						xAxis={data?.map((item) => item.phanLoaiCap2) ?? []}
						yAxis={[data?.map((item) => item?.tongKinhPhi ?? 0) ?? []]}
					/>
				</Card>
			</Col>
		</Row>
	);
};

export default ThongKeChung;
