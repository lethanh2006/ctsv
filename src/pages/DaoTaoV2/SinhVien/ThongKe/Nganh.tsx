import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeNganhSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { Row, Col, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';

const ThongKeNganh = (props: { mode: 'table' | 'donut' }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<
		{ nganh: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }[]
	>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeNganhSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{
		nganh: string;
		tongSoSv: number;
		nu: number;
		nam: number;
		noInfoGioiTinh: number;
		danToc: number;
		tonGiao: number;
	}>[] = [
		{
			title: 'Ngành',
			dataIndex: 'nganh',
			filterType: 'string',
			width: 200,
			// align: 'center',
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
			title: 'Dân tộc',
			dataIndex: 'danToc',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Tôn giáo',
			dataIndex: 'tonGiao',
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
			jsonToXlsx(payload, 'Thống kê sinh viên theo ngành');
		} catch (e) {
			console.log(e);
		}
	};

	return props.mode === 'table' ? (
		<>
			<Button
				icon={<ExportOutlined />}
				onClick={() => {
					handleExportDuLieu();
				}}
			>
				Xuất dữ liệu
			</Button>
			<TableStaticData otherProps={{ pagination: false }} addStt columns={columns} data={data} />
		</>
	) : (
		<Row>
      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          handleExportDuLieu();
        }}
      >
        Xuất dữ liệu
      </Button>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} sinh viên`}
					height={220}
					yLabel={['Sinh viên']}
					xAxis={data.map((item) => (item.nganh ? item.nganh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nữ`}
					height={220}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.nganh ? item.nganh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nu)]}
				/>
			</Col>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${val} nam`}
					height={220}
					yLabel={['Sinh viên nữ']}
					xAxis={data.map((item) => (item.nganh ? item.nganh : 'Không có thông tin'))}
					yAxis={[data.map((item) => item?.nam)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeNganh;
