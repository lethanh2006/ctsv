import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeHoKhauSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { Button, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { ExportOutlined } from '@ant-design/icons';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';

const ThongKeHoKhau = (props: { mode: 'table' | 'donut' }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<
		{ tinh: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }[]
	>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeHoKhauSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{ tinh: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }>[] = [
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

	const handleExportDuLieu = async () => {
		try {
			const payload = transformDataColumnsTableToJson(columns, data);
			jsonToXlsx(payload, 'Thống kê sinh viên theo hộ khẩu');
		} catch (e) {
			console.log(e);
		}
	};

	return props.mode === 'table' ? (
		<>
			<Button
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					handleExportDuLieu();
				}}
			>
				Xuất dữ liệu
			</Button>
			<TableStaticData
				otherProps={{
					summary: (pageData: any[]) => {
						let allSoLuong = 0;
						let allNu = 0;
						let allNam = 0;
						let allKhongThongTin = 0;
						pageData.map((item) => {
							allSoLuong += item?.tongSoSv ?? 0;
							allNu += item?.nu ?? 0;
							allNam += item?.nam ?? 0;
							allKhongThongTin += item?.noInfoGioiTinh ?? 0;
						});
						return (
							<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
								<Table.Summary.Cell index={0} />
								<Table.Summary.Cell index={1}>Tổng số</Table.Summary.Cell>
								<Table.Summary.Cell index={2}>{allSoLuong}</Table.Summary.Cell>
								<Table.Summary.Cell index={3}>{allNu}</Table.Summary.Cell>
								<Table.Summary.Cell index={4}>{allNam}</Table.Summary.Cell>
								<Table.Summary.Cell index={5}>{allKhongThongTin}</Table.Summary.Cell>
							</Table.Summary.Row>
						);
					},
				}}
				addStt
				columns={columns}
				data={data}
			/>
		</>
	) : (
		<Row>
			<Button
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					handleExportDuLieu();
				}}
			>
				Xuất dữ liệu
			</Button>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên`}
					height={220}
					yLabel={['Sinh viên']}
					xAxis={data.map((item) => (item.tinh ? item.tinh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nữ`}
					height={220}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.tinh ? item.tinh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nu)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nam`}
					height={220}
					yLabel={['Sinh viên nam']}
					xAxis={data.map((item) => (item.tinh ? item.tinh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nam)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeHoKhau;
