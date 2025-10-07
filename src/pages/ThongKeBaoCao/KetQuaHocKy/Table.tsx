import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { colorLoaiHocLuc, type ELoaiHocLuc } from '@/services/DaoTaoV2/HocKy/constant';
import { ETrinhDoKqhtHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { exportSinhVienXetHocBong } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy';
import type { KetQuaHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy/typing';
import { colorTrangThaiHocSv, ETrangThaiHocSv } from '@/services/SinhVien/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import { ExportOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const KetQuaHocKyTablePage = () => {
	const intl = useIntl();
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { record: recHinhThuc } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { page, limit, getModel, filters, setFilters, setDanhSachTongQuan } = useModel(
		'daotaov2.ketquahoctap.ketquahocky',
	);
	const { handleView: viewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const condition = { maHocKy: recHocKy?.ma };

	const onChangeSinhVienFilter = (params: { [key in keyof SinhVien.IRecord]?: string }) => {
		const allQuery = Object.keys(params);
		const temp = [...(filters ?? [])].filter((fil) => allQuery.every((q) => !fil.field.includes(q)));
		Object.entries(params).map(
			([k, v]) => !!v && temp.push({ field: ['sinhVien', k as string], values: [v], operator: EOperatorType.INCLUDE }),
		);
		setFilters(temp);
	};

	const getData = () =>
		getModel(condition, undefined, undefined, undefined, undefined, undefined, undefined, false).then((res) =>
			setDanhSachTongQuan(res),
		);

	useEffect(() => {
		onChangeSinhVienFilter({
			maTrinhDo: recTrinhDo?.ma,
			maHinhThuc: recHinhThuc?.ma,
			maKhoaSinhVien: recKhoa?.ma,
			maNganh: recNganh?.ma,
		});
	}, [recTrinhDo?.ma, recHinhThuc?.ma, recKhoa?.ma, recNganh?.ma]);

	const onClickSinhVien = (rec: KetQuaHocKy.IRecord) => {
		if (rec.sinhVienSsoId) {
			setSinhVienSsoId(rec.sinhVienSsoId);
			viewSinhVien();
		}
	};

	const handleExportSinhVienXetHocBong = () => {
		if (recHocKy?.ma) {
			setLoadingExport(true);
			exportSinhVienXetHocBong(recHocKy.ma)
				.then((res) => fileDownload(res.data, `DS sinh viên xét học bổng ${recHocKy.ten}.xlsx`))
				.catch((er) => console.log(er))
				.finally(() => setLoadingExport(false));
		}
	};

	const columns: IColumn<KetQuaHocKy.IRecord>[] = [
		{
			title: 'Mã HK',
			dataIndex: 'maHocKy',
			width: 80,
			align: 'center',
			sortable: true,
			hide: !!recHocKy?.ma,
		},
		{
			title: 'Mã SV',
			dataIndex: ['sinhVien', 'ma'],
			width: 120,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => (
				<a
					onClick={(e) => {
						e.preventDefault();
						onClickSinhVien(rec);
					}}
				>
					{rec.sinhVien?.ma}
				</a>
			),
		},
		{
			title: 'Họ tên',
			dataIndex: ['sinhVien', 'ten'],
			width: 160,
			// render: (val, rec) => rec.sinhVien?.ten,
			filterType: 'string',
			// filterCustomSelect: <SelectSinhVienDebounce multiple allowClear />,
		},
		{
			title: 'Số tín chỉ',
			width: 180,
			children: [
				{
					title: 'Đạt',
					dataIndex: 'tongSoTinChiHocKy',
					width: 60,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
				{
					title: 'TL',
					dataIndex: 'tongSoTinChiTichLuyHocKy',
					width: 60,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
				{
					title: 'Xét HB',
					dataIndex: 'tongSoTinChiHocBongHocKy',
					width: 60,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
				{
					title: 'Nợ',
					dataIndex: 'tongSoTinChiNoHocKy',
					width: 60,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
			],
		},
		{
			title: 'TB học kỳ',
			width: 120,
			children: [
				{
					title: 'Hệ 4',
					dataIndex: 'trungBinhHocKyThang4',
					width: 70,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
				{
					title: 'HB',
					dataIndex: 'trungBinhHocBongHocKyThang4',
					width: 70,
					align: 'center',
					sortable: true,
					filterType: 'number',
				},
			],
		},
		{
			title: 'Trình độ',
			dataIndex: 'trinhDo',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrinhDoKqhtHocKy),
		},
		{
			title: 'Học lực HK',
			dataIndex: 'hocLucHocKy',
			align: 'center',
			width: 120,
			// filterType: 'select',
			// filterData: Object.values(ELoaiHocLuc),
			render: (val: ELoaiHocLuc) => val && <b style={{ color: colorLoaiHocLuc[val] }}>{val}</b>,
		},
		// {
		// 	title: 'Khóa ngành',
		// 	dataIndex: 'maKhoaNganh',
		// 	width: 180,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectKhoaNganh multiple />,
		// 	render: (val, rec) => rec.khoaNganh?.ten ?? val,
		// },
		{
			title: 'Trạng thái',
			dataIndex: ['sinhVien', 'trangThaiHoc'],
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrangThaiHocSv),
			render: (val, rec) => <Tag color={colorTrangThaiHocSv[val as ETrangThaiHocSv]}>{val}</Tag>,
		},
		{ title: 'Khóa ngành', width: 120, dataIndex: 'maKhoaNganh' },
	];

	return (
		<>
			<TableBase
				modelName='daotaov2.ketquahoctap.ketquahocky'
				dependencies={[page, limit, recHocKy?.ma]}
				getData={getData}
				params={condition}
				columns={columns}
				dataState='danhSachTongQuan'
				title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.title' })}
				buttons={{ create: false, export: true }}
				hideCard
				otherButtons={[
					<ButtonExtend
						key={'1'}
						disabled={!recHocKy?.ma}
						icon={<ExportOutlined />}
						loading={loadingExport}
						onClick={handleExportSinhVienXetHocBong}
					>
						KQ Xét học bổng
					</ButtonExtend>,
				]}
			/>

			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} hasDetail />
		</>
	);
};

export default KetQuaHocKyTablePage;
