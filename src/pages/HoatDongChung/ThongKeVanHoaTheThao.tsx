import TableStaticData from '@/components/Table/TableStaticData';
import { thongKeSinhVienHoatDongChiTiet } from '@/services/HoatDongChung';
import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';
import type { IColumn } from '@/components/Table/typing';

const ThongKeVanHoaTheThao = () => {
	const [data, setData] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const { getAllModel, danhSach: danhSachNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const getData = async () => {
		const res = await thongKeSinhVienHoatDongChiTiet({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.VAN_HOA_THE_THAO,
				phanLoaiCap2: EHoatDongChungType2.VAN_HOA_VAN_NGHE_THE_THAO,
				maHocKy: recHocKy?.ma,
			},
		});
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?._id]);

	useEffect(() => {
		getAllModel();
	}, []);

	const column: IColumn<any>[] = [
		{
			title: 'Tên hoạt động',
			dataIndex: 'hoatDong',
			align: 'center',
			width: 200,
		},
	];

	danhSachNganh
		?.filter((item) => item.trinhDo?.ma === '7')
		.sort((a, b) => +b.ma - +a.ma)
		?.map((item) => {
			column.push({
				title: item.ten,
				dataIndex: item.ma,
				width: 150,
				align: 'center',
				render: (val: { ten: string; soLuong: number }) => <div>{val?.soLuong ?? 0}</div>,
			});
		});

	return (
		<Card>
			<Row gutter={[16, 0]}>
				<Col span={24}>
					<SelectHocKy
						style={{ width: 300, marginBottom: 8 }}
						value={recHocKy?._id}
						onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
						isSetRecord
					/>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ pagination: false }}
						title='Kết quả hoạt động văn hóa, văn nghệ, thể thao'
						addStt
						columns={column}
						data={data}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeVanHoaTheThao;
