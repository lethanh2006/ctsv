import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import type { SinhVien } from '@/services/SinhVien/typings';

import { ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import TitlePrintKQHT from '../KetQuaHocKy/components/TitlePrintKQHT';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { exportPhuLucVanBang, exportKetQuaHocTap } from '@/services/DaoTaoV2/SinhVien';
import { ETrangThaiDiemHocPhanSv } from '@/services/SinhVien/constant';

/** Bảng Điểm học phần (cuối cùng) của sinh viên */
const DiemHocPhanSvTable = (props: { sinhVienSsoId: string; maKhoaNganh?: string }) => {
	const { getAllModel, danhSach } = useModel('daotaov2.sinhvien.diemhocphan');
	const { record } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const componentRef = useRef(null);
	// const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const { sinhVienSsoId, maKhoaNganh } = props;

	const getData = () => sinhVienSsoId && getAllModel(false, { maHocKyKeHoach: 1 }, { sinhVienSsoId, maKhoaNganh });

	useEffect(() => {
		getData();
	}, [sinhVienSsoId, maKhoaNganh]);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => <ButtonExtend icon={<PrinterOutlined />}>In bảng điểm</ButtonExtend>,
		[],
	);

	const onExportPhuLucVanBang = (): void => {
		if (sinhVienSsoId) {
			setLoadingExport(true);
			exportPhuLucVanBang(sinhVienSsoId ?? '', {
				condition: {
					maKhoaNganh,
				},
			}).then((res) => {
				fileDownload(
					res.data,
					`Phụ lục văn bằng - ${record?.sinhVien?.ma ?? recSinhVien?.ma} - ${
						record?.sinhVien?.ten ?? recSinhVien?.ten
					}.pdf`,
				);
				setLoadingExport(false);
			});
		}
	};

	const onExportBangDiemToanKhoa = (): void => {
		if (sinhVienSsoId) {
			setLoadingExport(true);
			exportKetQuaHocTap(sinhVienSsoId ?? '', {
				condition: {
					maKhoaNganh,
				},
			}).then((res) => {
				fileDownload(
					res.data,
					`Kết quả học tập tích lũy - ${record?.sinhVien?.ma ?? recSinhVien?.ma} - ${
						record?.sinhVien?.ten ?? recSinhVien?.ten
					}.pdf`,
				);
				setLoadingExport(false);
			});
		}
	};

	const columns: IColumn<SinhVien.IDiemHocPhanSv>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Số TC',
			dataIndex: ['hocPhan', 'soTinChi'],
			width: 80,
			align: 'center',
		},
		{
			title: 'Điểm hệ 10',
			dataIndex: 'diemTongKet',
			width: 80,
			align: 'center',
		},
		{
			title: 'Điểm hệ 4',
			dataIndex: 'diemThang4',
			width: 80,
			align: 'center',
		},
		{
			title: 'Điểm chữ',
			dataIndex: 'diemChu',
			width: 80,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			render: (val, rec) => (
				<>
					{val} {rec?.trangThai === ETrangThaiDiemHocPhanSv.QUY_DOI_DIEM && <>(R)</>}
				</>
			),
		},
	];

	return (
		<>
			<Space wrap>
				<Dropdown
					overlay={
						<Menu>
							<Menu.Item onClick={() => onExportBangDiemToanKhoa()}>Bảng điểm tích lũy</Menu.Item>
							<Menu.Item onClick={() => onExportPhuLucVanBang()}>Phụ lục văn bằng</Menu.Item>
						</Menu>
					}
				>
					<ButtonExtend loading={loadingExport} icon={<ExportOutlined />}>
						Xuất bảng điểm
					</ButtonExtend>
				</Dropdown>
				<ReactToPrint
					content={reactToPrintContent}
					documentTitle='Bảng điểm học phần sinh viên'
					trigger={reactToPrintTrigger}
					removeAfterPrint
				/>
			</Space>

			<TableStaticData
				columns={columns}
				data={danhSach}
				size='small'
				otherProps={{ pagination: false, scroll: { y: 600 } }}
				addStt
			/>

			<PrintTemplate ref={componentRef} tenPhongBan={'Phòng Đào tạo'}>
				<TitlePrintKQHT />
				<div className='to-print'>
					<TableStaticData columns={columns} data={danhSach} size='small' otherProps={{ pagination: false }} addStt />
				</div>
			</PrintTemplate>

			{/* <ModalExport
				visible={visibleExport}
				fileName={`Bảng điểm học phần - ${record?.sinhVien?.ma ?? recSinhVien?.ma} - ${
					record?.sinhVien?.ten ?? recSinhVien?.ten
				}.xlsx`}
				modelName='sinhvien.diemhocphan'
				onCancel={() => setVisibleExport(false)}
				condition={{ sinhVienSsoId }}
			/> */}
		</>
	);
};

export default DiemHocPhanSvTable;
