import DonutChart from '@/components/Chart/DonutChart';
import { thongKeChung } from '@/services/CauLacBo';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import SelectCLB from '../components/SelectCLB';
import { ETrangThaiHoatDong, ETrangThaiThanhVien } from '@/services/CauLacBo/constant';
import TableStaticData from '@/components/Table/TableStaticData';

const ThongKeCLB = () => {
	const [clb, setClb] = useState<string>();

	const [dataThongKe, setDataThongKe] = useState<
		{
			cauLacBo: string;
			thanhVien: {
				[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
				[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
			};
			tongSoHoatDong: {
				[ETrangThaiHoatDong.CHUA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.DA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.HUY]: number;
			};
		}[]
	>([]);
	const getThongKe = async () => {
		const res = await thongKeChung();

		setDataThongKe(res?.data?.data ?? []);
	};

	useEffect(() => {
		getThongKe();
	}, []);

	const dataHoatDong = dataThongKe.map((item) => ({
		ten: item.cauLacBo,
		value:
			item.tongSoHoatDong[ETrangThaiHoatDong.CHUA_THUC_HIEN] +
			item.tongSoHoatDong[ETrangThaiHoatDong.DA_THUC_HIEN] +
			item.tongSoHoatDong[ETrangThaiHoatDong.HUY],
	}));
	const dataThanhVien = dataThongKe.map((item) => ({
		ten: item.cauLacBo,
		value: item.thanhVien[ETrangThaiThanhVien.DANG_HOAT_DONG] + item.thanhVien[ETrangThaiThanhVien.NGUNG_HOAT_DONG],
	}));

	return (
		<Card title='Thống kê'>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<SelectCLB allowClear onChange={(val) => setClb(val)} keyValue='ten' style={{ width: 250 }} />
				</Col>
				<Col span={12}>
					<DonutChart
						showTotal
						formatY={(val) => `${val} hoạt động`}
						height={250}
						yLabel={['Hoạt động']}
						xAxis={clb ? Object.values(ETrangThaiHoatDong) : dataThongKe.map((item) => item.cauLacBo)}
						yAxis={[
							clb
								? Object.values(dataThongKe.find((item) => item.cauLacBo === clb)?.tongSoHoatDong ?? 0)
								: dataHoatDong.map((item) => item.value),
						]}
					/>
				</Col>
				<Col span={12}>
					<DonutChart
						formatY={(val) => `${val} thành viên`}
						height={250}
						showTotal
						yLabel={['Thành viên đang hoạt động', 'Thành viên ngừng hoạt động']}
						xAxis={clb ? Object.values(ETrangThaiThanhVien) : dataThongKe.map((item) => item.cauLacBo)}
						yAxis={[
							clb
								? Object.values(dataThongKe.find((item) => item.cauLacBo === clb)?.thanhVien ?? 0)
								: dataThanhVien.map((item) => item.value),
						]}
					/>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ size: 'small' }}
						data={clb ? dataThongKe.filter((item) => item.cauLacBo === clb) : dataThongKe}
						addStt
						columns={[
							{
								title: 'Tên câu lạc bộ',
								dataIndex: 'cauLacBo',
								width: 200,
							},
							{
								title: 'Thành viên',
								width: 200,
								children: [
									{
										title: ETrangThaiThanhVien.DANG_HOAT_DONG,
										width: 100,
										align: 'center',
										render: (rec) => rec.thanhVien[ETrangThaiThanhVien.DANG_HOAT_DONG],
									},
									{
										title: ETrangThaiThanhVien.NGUNG_HOAT_DONG,
										width: 100,
										align: 'center',
										render: (rec) => rec.thanhVien[ETrangThaiThanhVien.NGUNG_HOAT_DONG],
									},
								],
							},
							{
								title: 'Hoạt động',
								width: 200,
								children: [
									{
										title: ETrangThaiHoatDong.CHUA_THUC_HIEN,
										width: 100,
										align: 'center',
										render: (rec) => rec.tongSoHoatDong[ETrangThaiHoatDong.CHUA_THUC_HIEN],
									},
									{
										title: ETrangThaiHoatDong.DA_THUC_HIEN,
										width: 100,
										align: 'center',
										render: (rec) => rec.tongSoHoatDong[ETrangThaiHoatDong.DA_THUC_HIEN],
									},
									{
										title: ETrangThaiHoatDong.HUY,
										width: 100,
										align: 'center',
										render: (rec) => rec.tongSoHoatDong[ETrangThaiHoatDong.HUY],
									},
								],
							},
						]}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeCLB;
