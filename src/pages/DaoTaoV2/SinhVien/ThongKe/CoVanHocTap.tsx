import ColumnChart from '@/components/Chart/ColumnChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeCoVanHocTap } from '@/services/DaoTaoV2/SinhVien';
import { inputFormat, jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { ExportOutlined } from '@ant-design/icons';

interface IThongKeCoVan {
	_id: string;
	maNamHoc: string;
	nhanSuSsoId: string;
	hoTenNhanSu: string;
	maNhanSu: string;
	tenLopHc: string;
	createdAt: string;
	updatedAt: string;
	tong: number;
	dangHoc: number;
	daTotNghiep: number;
	baoLuu: number;
	thoiHoc: number;
}

const CoVanHocTap = (props: { mode: 'table' | 'donut' }) => {
	const { mode } = props;
	const [data, setData] = useState<IThongKeCoVan[]>([]);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const getData = async () => {
		try {
			if (!recHocKy) return;
			const res = await getThongKeCoVanHocTap(recHocKy?.ma);
			setData(res?.data?.data?.result ?? []);
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<IThongKeCoVan>[] = [
		{
			title: 'Mã cố vấn',
			dataIndex: 'maNhanSu',
			filterType: 'string',
			width: 200,
			align: 'center',
			render: (val) => val || 'Không có thông tin',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTenNhanSu',
			width: 200,
			align: 'center',
			filterType: 'string',
			render: (val) => val || 'Không có thông tin',
		},
		{
			title: 'Tổng sinh viên',
			dataIndex: 'tong',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Sinh viên đang học',
			dataIndex: 'dangHoc',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Sinh viên đã tốt nghiệp',
			dataIndex: 'daTotNghiep',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Sinh viên bảo lưu',
			dataIndex: 'baoLuu',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Sinh viên thôi học',
			dataIndex: 'thoiHoc',
			width: 120,
			sortable: true,
			align: 'center',
		},
	];

	const handleExportDuLieu = async () => {
		try {
			const payload = transformDataColumnsTableToJson(columns, data);
			jsonToXlsx(payload, 'Thống kê cố vấn học tập');
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	return mode === 'table' ? (
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
			<TableStaticData addStt columns={columns} data={data} />
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
			<Col span={24}>
				<ColumnChart
					height={500}
					title=''
					yLabel={['Đang học', 'Đã tốt nghiệp', 'Thôi học', 'Bảo lưu']}
					colors={['#1fba36', '#0d6efd', '#0dcaf0', '#ffca2c']}
					xAxis={data.map((item, index) => item?.hoTenNhanSu ?? `${index + 1}`)}
					formatY={(val) => inputFormat(val ?? 0) + ''}
					otherOptionsChart={{
						stacked: true,
					}}
					yAxis={[
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						// [10, 20, 30, 40],
						...data?.map((val) => {
							return [val?.dangHoc, val?.daTotNghiep, val?.thoiHoc, val?.baoLuu];
						}),
					]}
				/>
			</Col>
		</Row>
	);
};
export default CoVanHocTap;
