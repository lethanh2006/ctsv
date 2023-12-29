import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { Space, message } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import ViewDiemLopHocPhan from '../../DiemLopHocPhan/components/ViewDiemLopHocPhan';
import TitlePrintKQHT from './TitlePrintKQHT';
import './style.less';

interface DataType extends LopHocPhan.IRecordSinhVienLopHP {
	title?: string;
	maHocPhan?: string;
	tenHocPhan?: string;
	maHocKy?: string;
}

const TableDiemHocPhan = (props: {
	sinhVienSsoId: string;
	maHocKy?: string;
	namHocId?: string;
	hideTitle?: boolean;
}) => {
	const { danhSach: danhSachKQHK } = useModel('daotaov2.ketquahoctap.ketquahocky');
	const { getAllModel, getByHocPhanNamHocModel, setRecord } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const [data, setData] = useState<DataType[]>([]);
	const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
	const componentRef = useRef(null);
	const { sinhVienSsoId, maHocKy, namHocId, hideTitle } = props;

	/** Get Data theo điều kiện: Học kỳ, Năm học hoặc Toàn khóa */
	const getData = (): Promise<LopHocPhan.IRecordSinhVienLopHP[]> => {
		if (sinhVienSsoId) {
			if (maHocKy) return getAllModel(false, undefined, { maSvHk: `${sinhVienSsoId}|${maHocKy}` });
			else if (namHocId) return getByHocPhanNamHocModel(sinhVienSsoId, { namHocId });
			else return getAllModel(false, undefined, { sinhVienSsoId });
		}
		return Promise.reject('Invalid sinhVien');
	};

	useEffect(() => {
		getData().then((da) => {
			const res: DataType[] = [];
			const gHocKy = _.groupBy(da, (item) => item.lopHocPhan?.hocKy?.ma); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp tăng dần học kỳ
			aHocKy.forEach(([mahk, lopHpSvList]) => {
				// Thêm 1 hàng trống => Tên học kỳ
				if (lopHpSvList[0].lopHocPhan?.hocKy?.ten)
					res.push({
						_id: '-1',
						idPhieuDktc: '-1',
						lopHocPhanId: '-1',
						sinhVienSsoId: '-1',
						tenHocPhan: lopHpSvList[0].lopHocPhan?.hocKy?.ten,
						maHocKy: mahk,
					});
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(
					...lopHpSvList.map((lop, index) => ({
						...lop,
						title: `${index + 1}`,
						maHocPhan: lop.lopHocPhan?.hocPhan?.ma,
						tenHocPhan: lop.lopHocPhan?.hocPhan?.ten,
					})),
				);
			});

			setData(res);
		});
	}, [sinhVienSsoId, maHocKy, namHocId]);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => <ButtonExtend icon={<PrinterOutlined />}>In bảng điểm</ButtonExtend>,
		[],
	);

	const onCell = (rec: DataType) => ({
		onClick: () => {
			if (rec._id !== '-1') {
				setRecord(rec);
				setVisibleChiTietDiem(true);
			}
		},
		style: {
			cursor: rec._id !== '-1' ? 'pointer' : undefined,
			fontWeight: rec._id === '-1' ? 600 : undefined,
			backgroundColor: rec._id === '-1' ? '#e8fafdbf' : undefined,
		},
		colSpan: rec._id === '-1' ? 0 : 1,
	});

	const columns: IColumn<DataType>[] = [
		{
			title: 'TT',
			dataIndex: 'title',
			width: 40,
			align: 'center',
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 200,
			filterType: 'string',
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 7 : 1,
			}),
		},
		{
			title: 'Số TC',
			width: 80,
			align: 'center',
			render: (val, rec) => rec.lopHocPhan?.hocPhan?.soTinChi,
			onCell,
		},
		{
			title: 'Điểm thang 10',
			dataIndex: 'diemTongKet',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Điểm thang 4',
			dataIndex: 'diemThang4',
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Điểm chữ',
			dataIndex: 'diemChu',
			width: 80,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			onCell,
		},
	];

	const dataDisplay = data.map((item) => {
		if (item._id === '-1' && danhSachKQHK.length > 1) {
			const kqhk = danhSachKQHK.find((j) => j.maHocKy === item.maHocKy);
			if (kqhk)
				return {
					...item,
					tenHocPhan: `${item.tenHocPhan} (TB học kỳ: ${kqhk.trungBinhHocKy}, số TC đạt: ${kqhk.tongSoTinChiHocKy}, tổng số TC tích lũy: ${kqhk.tongSoTinChiTichLuyToanKhoa})`,
				};
		}
		return item;
	});

	return (
		<>
			{!hideTitle ? (
				<div className='ant-descriptions-title' style={{ fontSize: '16px', padding: '16px 0 8px 0' }}>
					Danh sách học phần chi tiết
				</div>
			) : null}
			<Space wrap>
				<ButtonExtend
					icon={<ExportOutlined />}
					onClick={() => {
						message.warn('Đang phát triển...');
					}}
				>
					Xuất dữ liệu
				</ButtonExtend>
				<ReactToPrint
					content={reactToPrintContent}
					documentTitle='Danh sách học phần chi tiết'
					trigger={reactToPrintTrigger}
					removeAfterPrint
				/>
			</Space>

			<TableStaticData
				columns={columns}
				data={dataDisplay}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			/>

			<PrintTemplate ref={componentRef}>
				<TitlePrintKQHT />
				<div className='to-print'>
					<TableStaticData columns={columns} data={dataDisplay} size='small' otherProps={{ pagination: false }} />
				</div>
			</PrintTemplate>

			<ViewDiemLopHocPhan visible={visibleChiTietDiem} setVisible={setVisibleChiTietDiem} />
		</>
	);
};

export default TableDiemHocPhan;
