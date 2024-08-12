import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { thongKeTongHop } from '@/services/CauLacBo';
import { thongKeSinhVienHoatDongChiTiet } from '@/services/HoatDongChung';
import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';

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

		const dataFinal = res?.data?.data?.map((item: any) => {
			const keyObj: any = {};
			Object.keys(item).map((key) => {
				keyObj[`${key}soLuong`] = item?.[key]?.soLuong ?? 0;
			});

			return {
				...item,
				...keyObj,
			};
		});
		setData(dataFinal);
	};
	const getDataCLB = async () => {
		if (recHocKy && danhSachAllDonVi.length && danhSachCLB.length) {
			const res = await thongKeTongHop(recHocKy?.ma);
			const dataFinal = res?.data?.data?.map((item: any) => ({
				...item,
				donViTrucThuoc: danhSachAllDonVi?.find((dv) => {
					return dv._id === danhSachCLB.find((clb) => clb?.ten === item?.ten)?.donViQuanLy;
				})?.ten,
			}));
			setDataCLB(dataFinal);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?._id]);

	useEffect(() => {
		getDataCLB();
	}, [recHocKy?._id, danhSachAllDonVi.length, danhSachCLB.length]);

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
				dataIndex: `${item.ma}soLuong`,
				width: 150,
				align: 'center',
				render: (val) => <div>{val || 0}</div>,
			});
		});

	const handleExportDuLieu = async (columnParam: any, dataParam: any, title: string) => {
		try {
			const payload = transformDataColumnsTableToJson(columnParam, dataParam, 0);
			jsonToXlsx(payload, title);
		} catch (e) {
			console.log(e);
		}
	};

	const columnCLB: IColumn<any>[] = [
		{
			title: 'Câu lạc bộ',
			dataIndex: 'ten',
			width: 200,
		},
		{
			title: 'Đơn vị trực thuộc (Khoa/Viện/Đoàn TN)',
			dataIndex: 'donViTrucThuoc',
			width: 200,
		},
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
		{
			title: 'Lượt sinh viên tham gia hoạt động do Học viện tổ chức',
			align: 'center',
			width: 150,
			dataIndex: 'svThamGiaHv',
		},
		{
			title: 'Lượt sinh viên tham gia hoạt động do đơn vị bên ngoài tổ chức',
			align: 'center',
			width: 150,
			dataIndex: 'svThamGiaNgoaiHv',
		},
		{
			title: 'Kinh phí hoạt động - Nguồn do Học viện phân bổ (VNĐ)',
			align: 'center',
			width: 150,
			dataIndex: 'kinhPhiHv',
		},
		{
			title: 'Kinh phí hoạt động - Nguồn khác (VNĐ)',
			align: 'center',
			width: 150,
			dataIndex: 'kinhPhiKhac',
		},
	];

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
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<b>Kết quả hoạt động văn hóa, văn nghệ, thể thao</b>
						<Button
							onClick={() => handleExportDuLieu(column, data, 'Kết quả hoạt động văn hóa, văn nghệ, thể thao')}
							icon={<ExportOutlined />}
							type='primary'
						>
							Xuất dữ liệu
						</Button>
					</div>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{
							pagination: false,
							summary: (pageData: any[]) => {
								return (
									<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
										<Table.Summary.Cell index={0} />
										<Table.Summary.Cell index={1}>Tổng số</Table.Summary.Cell>
										{column
											.filter((item) => item.dataIndex !== 'hoatDong')
											?.map((item: any, index: number) => {
												const total = pageData.reduce((pre, cur) => {
													return pre + cur?.[item?.dataIndex ?? ''] ?? 0;
												}, 0);
												return (
													<Table.Summary.Cell key={index} index={index}>
														{total || 0}
													</Table.Summary.Cell>
												);
											})}
									</Table.Summary.Row>
								);
							},
						}}
						addStt
						columns={column}
						data={data}
					/>
				</Col>
				<Col span={24}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<b>Tổng hợp hoạt động câu lạc bộ sinh viên</b>
						<Button
							onClick={() => handleExportDuLieu(columnCLB, dataCLB, 'Tổng hợp hoạt động câu lạc bộ sinh viên')}
							icon={<ExportOutlined />}
							type='primary'
						>
							Xuất dữ liệu
						</Button>
					</div>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{
							pagination: false,
							summary: (pageData: any[]) => {
								let thanhVienChinhThuc = 0;
								let congTacVien = 0;
								let hoatDongHv = 0;
								let svThamGiaHv = 0;
								let hoatDongNgoaiHv = 0;
								let svThamGiaNgoaiHv = 0;
								let kinhPhiHv = 0;
								let kinhPhiKhac = 0;
								pageData.map((item) => {
									thanhVienChinhThuc += item?.thanhVienChinhThuc ?? 0;
									congTacVien += item?.congTacVien ?? 0;
									hoatDongHv += item?.hoatDongHv ?? 0;
									hoatDongNgoaiHv += item?.hoatDongNgoaiHv;
									svThamGiaHv += item?.svThamGiaHv;
									svThamGiaNgoaiHv += item?.svThamGiaNgoaiHv;
									kinhPhiHv += item?.kinhPhiHv;
									kinhPhiKhac += item?.kinhPhiKhac;
								});
								return (
									<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
										<Table.Summary.Cell index={0} />
										<Table.Summary.Cell index={0} />
										<Table.Summary.Cell index={1}>Tổng số</Table.Summary.Cell>
										<Table.Summary.Cell index={2}>{thanhVienChinhThuc}</Table.Summary.Cell>
										<Table.Summary.Cell index={3}>{congTacVien}</Table.Summary.Cell>
										<Table.Summary.Cell index={4}>{hoatDongHv}</Table.Summary.Cell>
										<Table.Summary.Cell index={5}>{hoatDongNgoaiHv}</Table.Summary.Cell>
										<Table.Summary.Cell index={5}>{svThamGiaHv}</Table.Summary.Cell>
										<Table.Summary.Cell index={5}>{svThamGiaNgoaiHv}</Table.Summary.Cell>
										<Table.Summary.Cell index={5}>{kinhPhiHv}</Table.Summary.Cell>
										<Table.Summary.Cell index={5}>{kinhPhiKhac}</Table.Summary.Cell>
									</Table.Summary.Row>
								);
							},
						}}
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
										title: 'Nguồn do Học viện phân bổ (VNĐ)',
										align: 'center',
										width: 150,
										dataIndex: 'kinhPhiHv',
									},
									{
										title: 'Nguồn khác(VNĐ)',
										align: 'center',
										width: 150,
										dataIndex: 'kinhPhiKhac',
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
