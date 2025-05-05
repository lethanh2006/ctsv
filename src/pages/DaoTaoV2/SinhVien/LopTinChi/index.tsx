import ExpandText from '@/components/ExpandText';
import PrintTemplate from '@/components/PrintTemplate';
import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiHocPhanDangKyTinChi,
	ETrangThaiLopHocPhan,
	LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTaoV2/HocKy/constant';
import { CalendarOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import RenderLichHoc from '../../HocKy/LopHocPhan/components/RenderLichHoc';
import ViewDiemLopHocPhan from '../../KetQuaHocTap/DiemLopHocPhan/components/ViewDiemLopHocPhan';
import TitlePrintLopTinChi from './TitlePrintLopTinChi';
import ModalLichHocSinhVien from '../../ThoiKhoaBieu/ModalLichHoc';

type TData = LopHocPhan.IRecordSinhVienLopHP & Partial<HocPhan.IRecord> & { title?: string; maHocKy?: string };

const LopTinChiSinhVien = () => {
	const { getAllModel, loading } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const { getAllModel: getLopHp, loading: loadLop } = useModel('daotaov2.hocky.lophocphan');
	const { loading: loadDiem } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [recHocKy, setHocKy] = useState<HocKy.IRecord>();
	const [danhSachHocKy, setDsHocKy] = useState<HocKy.IRecord[]>([]);
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const [visibleLichHoc, setVisibleLichHoc] = useState<boolean>(false);
	const [sinhVienLhpId, setSinhVienLhpId] = useState<string>(); // Lưu riêng để tránh xung đột
	const [dataLop, setDataLop] = useState<TData[]>([]);
	const [dataPrint, setDataPrint] = useState<Partial<TData>[]>([]);
	const componentRef = useRef(null);
	const dataHienThi = dataLop.filter((i) => !recHocKy?.ma || i.maHocKy === recHocKy?.ma);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const getData = () =>
		recSinhVien?.ssoId &&
		getAllModel(undefined, undefined, { sinhVienSsoId: recSinhVien?.ssoId }).then(async (da) => {
			// Danh sách học phần đã đăng ký có cả lớp Chính và lớp thực hành
			const hocPhanCoLopThucHanh = da
				.filter((item) => !!item?.lopHocPhan?.tenCha)
				.map((item) => item.lopHocPhan?.maHocPhan);
			// Nếu có cả lớp chính và lớp thực hành thì chỉ hiện lớp thực hành
			const danhSachLopHienThi: any[] = da
				.filter(
					(item) =>
						item.lopHocPhan?.trangThaiLop === ETrangThaiLopHocPhan.MO &&
						(!hocPhanCoLopThucHanh.includes(item.lopHocPhan?.maHocPhan) || !!item.lopHocPhan?.tenCha),
				)
				.map((item) => ({ ...item.lopHocPhan?.hocPhan, maHocKy: item.lopHocPhan?.maHocKy, ...item }));
			// Get chi tiết lớp học phần (để lấy thông tin mã hóa lịch học)
			const lopHpIdList = danhSachLopHienThi.map((item) => item.lopHocPhanId);
			const lopHpList = await getLopHp(undefined, undefined, undefined, [
				{ active: true, field: '_id', values: lopHpIdList, operator: EOperatorType.INCLUDE },
			]);
			danhSachLopHienThi.map((item) =>
				Object.assign(item, { lopHocPhan: lopHpList.find((i) => i._id === item.lopHocPhanId) }),
			);
			setDataLop(danhSachLopHienThi);

			// Lấy dữ liệu lúc in: Nhóm theo học kỳ, thêm 1 hàng học kỳ
			const res: Partial<TData>[] = [];
			const dsHocKy: any[] = [];
			const gHocKy = _.groupBy(danhSachLopHienThi, (item) => item.maHocKy); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp tăng dần học kỳ
			aHocKy.forEach(([mahk, lopTinChi]) => {
				const ten = lopTinChi[0]?.lopHocPhan?.hocKy?.ten ?? `Học kỳ ${mahk}`;
				dsHocKy.push({ ma: mahk, ten });
				res.push({ _id: '-1', ten, maHocKy: mahk });
				res.push(
					...lopTinChi.map((item, index) => ({
						...item,
						title: `${index + 1}`,
					})),
				);
			});
			setHocKy(dsHocKy?.[0]);
			setDsHocKy(dsHocKy);
			setDataPrint(res);
		});

	useEffect(() => {
		getData();
	}, [recSinhVien?.ssoId]);

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setSinhVienLhpId(rec._id);
			setVisibleChiTietDiem(true);
		},
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === '-1' ? 600 : undefined,
			backgroundColor: rec._id === '-1' ? '#e8fafdbf' : undefined,
		},
		colSpan: rec._id === '-1' ? 0 : 1,
	});

	const reactToPrintTrigger = useCallback(
		() => (
			<Button icon={<PrinterOutlined />} size='small'>
				In thông tin
			</Button>
		),
		[],
	);

	const columns: IColumn<TData>[] = [
		{
			title: 'Học kỳ',
			dataIndex: ['lopHocPhan', 'maHocKy'],
			align: 'center',
			width: 80,
			hide: !!recHocKy?.ma,
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.lopHocPhan?.maHocPhan,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.lopHocPhan?.hocPhan?.ten,
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 7 : 1,
			}),
		},
		{
			title: 'TC',
			align: 'center',
			width: 40,
			render: (val, rec) => rec?.lopHocPhan?.hocPhan?.soTinChi ?? rec.lopHocPhan?.hocPhan?.soTinChi ?? rec.soTinChi,
			onCell,
		},
		{
			title: 'TT lớp',
			align: 'center',
			width: 80,
			render: (val, rec) =>
				`${rec?.lopHocPhan?.soThuTuLop ?? ''}${
					rec?.lopHocPhan?.soThuTuNhom ? ` (nhóm ${rec?.lopHocPhan?.soThuTuNhom})` : ''
				}`,
			onCell,
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<ExpandText>
					{rec.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						?.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Lịch học',
			width: 200,
			render: (val, rec) => rec?.lopHocPhan && <RenderLichHoc lopHocPhan={rec.lopHocPhan as LopHocPhan.IRecord} />,
		},
		{
			title: 'Loại đăng ký',
			dataIndex: 'loai',
			width: 120,
			render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
			filterType: 'select',
			filterData: Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
				value: item,
				label: LoaiHocPhanDangKyTinChi[item],
			})),
			onCell,
		},
	];

	const columnsPrint: IColumn<TData>[] = [
		{
			title: 'TT',
			dataIndex: 'title',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'ma',
			align: 'center',
			width: 80,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.lopHocPhan?.maHocPhan,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.lopHocPhan?.hocPhan?.ten,
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 8 : 1,
			}),
		},
		{
			title: 'TC',
			align: 'center',
			width: 40,
			render: (val, rec) => rec?.lopHocPhan?.hocPhan?.soTinChi ?? rec.lopHocPhan?.hocPhan?.soTinChi ?? rec.soTinChi,
			onCell,
		},
		{
			title: 'TT lớp',
			align: 'center',
			width: 80,
			render: (val, rec) =>
				`${rec?.lopHocPhan?.soThuTuLop ?? ''}${
					rec?.lopHocPhan?.soThuTuNhom ? ` (nhóm ${rec?.lopHocPhan?.soThuTuNhom})` : ''
				}`,
			onCell,
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<>
					{rec.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						?.join(', ')}
				</>
			),
			onCell,
		},
		{
			title: 'Lịch học',
			width: 200,
			render: (val, rec) =>
				rec?.lopHocPhan && <RenderLichHoc lopHocPhan={rec.lopHocPhan as LopHocPhan.IRecord} showAll />,
			onCell,
		},
		{
			title: 'Loại đăng ký',
			dataIndex: 'loai',
			width: 120,
			render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
			filterType: 'select',
			filterData: Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
				value: item,
				label: LoaiHocPhanDangKyTinChi[item],
			})),
			onCell,
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={dataHienThi}
				addStt
				hasTotal
				loading={loading || loadLop || loadDiem}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 350 } }}
			>
				<Space wrap>
					<Select
						allowClear
						style={{ width: 250 }}
						value={recHocKy?.ma}
						onChange={(val) => setHocKy(danhSachHocKy.find((item) => item.ma === val))}
						options={danhSachHocKy.map((item) => ({ key: item.ma, value: item.ma, label: item.ten }))}
						size='small'
						placeholder='Chọn kỳ học'
						loading={loadLop}
					/>
					<Button icon={<CalendarOutlined />} onClick={() => setVisibleLichHoc(true)} size='small'>
						Xem lịch học
					</Button>
					<ReactToPrint
						content={reactToPrintContent}
						documentTitle='Danh sách lớp tín chỉ'
						trigger={reactToPrintTrigger}
						removeAfterPrint
					/>
				</Space>
			</TableStaticData>

			{sinhVienLhpId ? (
				<ViewDiemLopHocPhan
					visible={visibleChiTietDiem}
					setVisible={setVisibleChiTietDiem}
					sinhVienLopHocPhanId={sinhVienLhpId}
				/>
			) : null}

			<ModalLichHocSinhVien
				visible={visibleLichHoc}
				setVisible={setVisibleLichHoc}
				danhSachLop={dataHienThi.map((item) => item.lopHocPhan?.ten ?? '')}
				tenSinhVien={`${recSinhVien?.ma ?? ''} - ${recSinhVien?.ten ?? ''}`}
			/>

			<PrintTemplate ref={componentRef}>
				<TitlePrintLopTinChi />
				<div className='to-print'>
					<TableStaticData
						columns={columnsPrint}
						data={dataPrint}
						size='small'
						otherProps={{ pagination: false, scroll: false }}
					/>
				</div>
			</PrintTemplate>
		</>
	);
};

export default LopTinChiSinhVien;
