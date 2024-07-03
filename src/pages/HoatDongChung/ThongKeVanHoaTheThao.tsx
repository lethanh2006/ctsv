import TableStaticData from '@/components/Table/TableStaticData';
import { thongKeSinhVienHoatDongChiTiet } from '@/services/HoatDongChung';
import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';
import type { IColumn } from '@/components/Table/typing';
import { thongKeTongHop } from '@/services/CauLacBo';

const ThongKeVanHoaTheThao = () => {
	const [data, setData] = useState<any[]>([]);
	const [dataCLB, setDataCLB] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const { getAllModel, danhSach: danhSachNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { getAllModel: getAllCLB, danhSach: danhSachCLB } = useModel('caulacbo.caulacbo');
	const { danhSach: danhSachAllDonVi, getAllModel: getAllDonVi } = useModel('tochucnhansu.donvi');

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
	const getDataCLB = async () => {
		if (recHocKy) {
			const res = await thongKeTongHop(recHocKy?.ma);
			setDataCLB(res?.data?.data ?? []);
		}
	};

	useEffect(() => {
		getData();
		getDataCLB();
	}, [recHocKy?._id]);

	useEffect(() => {
		getAllModel();
	}, []);

	useEffect(() => {
		getAllCLB();
	}, []);

	useEffect(() => {
		if (!danhSachAllDonVi.length) getAllDonVi();
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
			<Row gutter={[16, 8]}>
				<Col span={24}>
					<SelectHocKy
						style={{ width: 300, marginBottom: 8 }}
						value={recHocKy?._id}
						onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
						isSetRecord
					/>
				</Col>
				<Col span={24}>
					<b>Kết quả hoạt động văn hóa, văn nghệ, thể thao</b>
				</Col>
				<Col span={24}>
					<TableStaticData otherProps={{ pagination: false }} addStt columns={column} data={data} />
				</Col>
				<Col span={24}>
					<b>Tổng hợp hoạt động câu lạc bộ sinh viên</b>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						columns={[
							{
								title: 'Câu lạc bộ',
								dataIndex: 'ten',
								width: 200,
							},
							{
								title: 'Đơn vị trực thuộc (Khoa/Viện/Đoàn TN)',
								dataIndex: 'ten',
								width: 200,
								render: (val) =>
									danhSachAllDonVi?.find((dv) => {
										return dv._id === danhSachCLB.find((item) => item.ten === val)?.donViQuanLy;
									})?.ten,
							},
							{
								title: 'Thành viên CLB',
								align: 'center',
								width: 150,
								children: [
									{
										title: 'Thành viên chính thức',
										align: 'center',
										width: 150,
										dataIndex: 'thanhVienChinhThuc',
									},
									{
										title: 'Cộng tác viên',
										align: 'center',
										width: 150,
										dataIndex: 'congTacVien',
									},
								],
							},
							{
								title: 'Hoạt động của CLB',
								align: 'center',
								width: 150,
								children: [
									{
										title: 'Hoạt động do Học viện tổ chức',
										align: 'center',
										width: 150,
										dataIndex: 'hoatDongHv',
									},
									{
										title: 'Hoạt động do đơn vị bên ngoài tổ chức',
										align: 'center',
										width: 150,
										dataIndex: 'hoatDongNgoaiHv',
									},
								],
							},
							{
								title: 'Lượt sinh viên tham gia họat động',
								align: 'center',
								width: 150,
								children: [
									{
										title: 'Hoạt động do Học viện tổ chức',
										align: 'center',
										width: 150,
										dataIndex: 'svThamGiaHv',
									},
									{
										title: 'Hoạt động do đơn vị bên ngoài tổ chức',
										align: 'center',
										width: 150,
										dataIndex: 'svThamGiaNgoaiHv',
									},
								],
							},
							{
								title: 'Kinh phí hoạt động',
								align: 'center',
								width: 150,
								children: [
									{
										title: 'Nguồn  do Học viện phân bổ (VNĐ)',
										align: 'center',
										width: 150,
										// dataIndex: 'thanhVienChinhThuc',
									},
									{
										title: 'Nguồn khác(VNĐ)',
										align: 'center',
										width: 150,
										// dataIndex: 'congTacVien',
									},
								],
							},
						]}
						data={dataCLB}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeVanHoaTheThao;
