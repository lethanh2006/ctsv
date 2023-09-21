import { currencyFormat } from '@/utils/utils';
import { Badge, Card, Col, Row, Space, Statistic } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import _, { first } from 'lodash';
import { ELoaiMinhChungDiemRenLuyen } from '@/services/DiemRenLuyen/MinhChung/constants';
import { SelectDotChamDiem } from '../DotChamDiem/components/Select';
import TableStaticData from '@/components/Table/TableStaticData';
import { type DotChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/typing';
import { type IColumn } from '@/components/Table/typing';
import { getBaoCaoDiemRL, postBaoCaoMinhChung } from '@/services/DiemRenLuyen/DotChamDiem';

const BaoCaoDiemRenLuyenPage = () => {
	const { danhSach, setRecord, record } = useModel('diemrenluyen.dotchamdiem');
	const [dataLopHanhChinh, setDataLopHanhChinh] = useState<DotChamDiem.BaoCaoLop>();
	const [dataSinhVien, setDataSinhVien] = useState<DotChamDiem.BaoCaoSinhVien>();
	const [dataSuKien, setDataSuKien] = useState<DotChamDiem.BaoCaoSuKien[]>();
	const [soTuyenTruyen, setSoTuyenTruyen] = useState<number>(0);
	const [loading, setLoading] = useState(false);

	const getData = () => {
		if (record?._id) {
			setLoading(true);

			Promise.allSettled([
				getBaoCaoDiemRL(record._id, 'lop-hanh-chinh'),
				getBaoCaoDiemRL(record._id, 'sinh-vien'),
				getBaoCaoDiemRL(record._id, 'su-kien'),
				postBaoCaoMinhChung({
					idDotChamDiem: record._id,
					loaiMinhChung: ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
				}),
			])
				.then(([lop, sinhvien, sukien, tuyentruyen]) => {
					if (lop.status === 'fulfilled') setDataLopHanhChinh(lop.value.data?.data);
					if (sinhvien.status === 'fulfilled') setDataSinhVien(sinhvien.value.data?.data);
					if (sukien.status === 'fulfilled') setDataSuKien(sukien.value.data?.data);
					if (tuyentruyen.status === 'fulfilled') setSoTuyenTruyen(tuyentruyen.value.data?.data);
				})
				.catch((er) => console.log(er))
				.finally(() => setLoading(false));
		}
	};

	useEffect(() => {
		getData();
	}, [record?._id]);

	useEffect(() => {
		setRecord(first(danhSach));
	}, [danhSach]);

	const columns: IColumn<DotChamDiem.BaoCaoSuKien>[] = [
		{
			title: 'Tên sự kiện',
			dataIndex: ['suKien', 'tenSuKien'],
			width: 180,
		},
		{
			title: 'Loại',
			dataIndex: ['suKien', 'loaiMinhChung'],
			width: 120,
		},
		{
			title: 'Thời gian bắt đầu',
			align: 'center',
			dataIndex: ['suKien', 'thoiGianBatDau'],
			width: 150,
			render: (val: string) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			align: 'center',
			width: 150,
			dataIndex: ['suKien', 'thoiGianKetThuc'],
			render: (val: string) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Số lượng SV tham gia',
			align: 'center',
			dataIndex: 'tongSinhVien',
			width: 120,
		},
	];

	return (
		<Card title='Tổng hợp điểm rèn luyện'>
			<Space style={{ marginBottom: 18 }}>
				<SelectDotChamDiem
					style={{ width: 250 }}
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
				/>
			</Space>

			<Row gutter={[12, 12]}>
				<Col span={24} md={8}>
					<Card style={{ height: '100%' }}>
						<Statistic
							title='Số lớp hành chính tham gia chấm điểm'
							value={dataLopHanhChinh?.tongSo ?? '--'}
							loading={loading}
							groupSeparator='.'
						/>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card style={{ height: '100%' }}>
						<Statistic
							title='Số sinh viên tham gia chấm điểm'
							value={dataSinhVien?.tongSo ?? '--'}
							loading={loading}
							groupSeparator='.'
						/>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card style={{ height: '100%' }}>
						<Statistic
							title='Số lượng tiêu chí tuyên truyền'
							value={soTuyenTruyen ?? '--'}
							loading={loading}
							groupSeparator='.'
						/>
					</Card>
				</Col>

				<Col span={24} md={8}>
					<Card style={{ height: '100%' }}>
						<div className='ant-statistic'>
							<div className='ant-statistic-title'>Số lớp đã tổ chức họp lớp</div>
							<Badge style={{ marginRight: 8 }} color='blue' />
							Đầu kỳ:{' '}
							<b>{dataLopHanhChinh?.tongHopLopDauKy ? currencyFormat(dataLopHanhChinh?.tongHopLopDauKy) : '--'}</b>
							<br />
							<Badge style={{ marginRight: 8 }} color='green' />
							Giữa kỳ:{' '}
							<b>{dataLopHanhChinh?.tongHopLopGiuaKy ? currencyFormat(dataLopHanhChinh?.tongHopLopGiuaKy) : '--'}</b>
							<br />
							<Badge style={{ marginRight: 8 }} color='red' />
							Cuối kỳ:{' '}
							<b>{dataLopHanhChinh?.tongHopLopCuoiKy ? currencyFormat(dataLopHanhChinh?.tongHopLopCuoiKy) : '--'}</b>
						</div>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card style={{ height: '100%' }}>
						<div className='ant-statistic'>
							<div className='ant-statistic-title'>Sinh viên khai báo nội-ngoại trú</div>
							<Badge style={{ marginRight: 8 }} color='blue' />
							Nội trú: <b>{dataSinhVien?.tongNoiTru ? currencyFormat(dataSinhVien?.tongNoiTru) : '--'}</b>
							<br />
							<Badge style={{ marginRight: 8 }} color='green' />
							Ngoại trú: <b>{dataSinhVien?.tongNgoaiTru ? currencyFormat(dataSinhVien?.tongNgoaiTru) : '--'}</b>
						</div>
					</Card>
				</Col>

				<Col span={24}>
					<Card>
						<div className='ant-statistic'>
							<div className='ant-statistic-title' style={{ marginBottom: 12 }}>
								Sinh viên tham gia sự kiện
							</div>
							<TableStaticData
								columns={columns}
								data={dataSuKien ?? []}
								addStt
								loading={loading}
								otherProps={{ scroll: { x: 700 }, size: 'small' }}
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</Card>
	);
};

export default BaoCaoDiemRenLuyenPage;
