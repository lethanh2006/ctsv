import TableStaticData from '@/components/Table/TableStaticData';
import { thongKeSinhVienHoatDong, thongKeSinhVienHoatDongCap2 } from '@/services/HoatDongChung';
import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';

const ThongKeGiaoDucChinhTriTuTuong = () => {
	const [data, setData] = useState<any[]>([]);
	const [data2, setData2] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const getData = async () => {
		const res = await thongKeSinhVienHoatDong({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG,
				phanLoaiCap2: EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM,
				maHocKy: recHocKy?.ma,
			},
		});
		setData(res?.data?.data ?? []);
	};
	const getData2 = async () => {
		const res = await thongKeSinhVienHoatDongCap2({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG,
				phanLoaiCap2: {
					$in: [
						EHoatDongChungType2.TUAN_LE_CONG_DAN,
						EHoatDongChungType2.HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI,
					],
				},
				maHocKy: recHocKy?.ma,
			},
		});
		setData2(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
		getData2();
	}, [recHocKy?._id]);

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
					<b>Kết quả thực hiện công tác giáo dục chính trị tư tưởng</b>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						columns={[
							{
								title: 'Ngành đào tạo',
								dataIndex: 'nganh',
								align: 'center',
								width: 200,
							},
							{
								title: 'Tuần sinh hoạt công dân sinh viên',
								width: 400,
								align: 'center',
								children: [
									{
										title: 'Số sinh viên thuộc diện phải học',
										dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|total',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
									{
										title: 'Số sinh viên tham gia',
										dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|attended',
										width: 200,
										align: 'center',
									},
								],
							},
							{
								title: 'Hoạt động huy động giáo dục tư tưởng chính trị các cấp (TW Hội, Bộ GD&ĐT...)',
								width: 400,
								align: 'center',
								children: [
									{
										title: 'Số sinh viên thuộc diện được triệu tập',
										dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|total',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
									{
										title: 'Số sinh viên tham gia',
										dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|attended',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
								],
							},
						]}
						data={data2}
					/>
				</Col>
				<Col span={24}>
					<b>Kết quả tổ chức các hoạt động hướng nghiệp, giới thiệu việc làm, kỹ năng mềm</b>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						columns={[
							{
								title: 'Ngành đào tạo',
								dataIndex: 'nganh',
								align: 'center',
								width: 200,
							},
							{
								title: 'Tổng số sinh viên',
								dataIndex: 'tongSoSinhVien',
								align: 'center',
								width: 200,
							},
							{
								title: 'Số SV tham gia Ngày hội việc làm',
								dataIndex: 'Ngày hội việc làm',
								align: 'center',
								width: 200,
							},
							{
								title: 'Số SV tham gia Hội thảo, nói chuyện chuyên đề về việc làm',
								dataIndex: 'Hội thảo, nói chuyện chuyên đề về việc làm',
								align: 'center',
								width: 200,
							},
							{
								title: 'Số SV được đào tạo kỹ năng mềm trong cả năm học',
								dataIndex: 'Đào tạo kỹ năng mềm',
								align: 'center',
								width: 200,
							},
						]}
						data={data}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeGiaoDucChinhTriTuTuong;
