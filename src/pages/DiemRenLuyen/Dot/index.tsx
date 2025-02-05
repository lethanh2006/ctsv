import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import FormThemMoi from '@/pages/DiemRenLuyen/Dot/components/FormThemMoi';
import ViewChiTiet from '@/pages/DiemRenLuyen/Dot/components/ViewChiTiet';
import { useModel } from '@@/plugin-model/useModel';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

const DotPage = () => {
	const { handleEdit, deleteModel, isView, handleView } = useModel('diemrenluyen.dot');
	const { danhSach: danhSachKyHoc, getAllModel: getAllKyHoc } = useModel('daotaov2.hocky.hocky');

	const onCell = (record: DotChamDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(record);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotChamDiemRenLuyen.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: 'Kỳ học',
			dataIndex: 'kyHoc',
			align: 'center',
			filterType: 'customselect',
			filterCustomSelect: <SelectHocKy selectMa multiple />,
			width: 150,
			onCell,
			render: (val) => {
				const kyHoc = danhSachKyHoc?.find((item) => item?.ma === val);
				return kyHoc?.ten;
			},
		},
		{
			title: 'Thời gian tiếp nhận minh chứng',
			render: (val, rec) =>
				`${
					rec.thoiGianTiepNhanMinhChung?.thoiGianBatDau
						? moment(rec.thoiGianTiepNhanMinhChung.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianTiepNhanMinhChung?.thoiGianKetThuc
						? moment(rec.thoiGianTiepNhanMinhChung.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: 'Thời gian SV tự chấm điểm',
			render: (val, rec) =>
				`${
					rec.thoiGianSVChamDiem?.thoiGianBatDau
						? moment(rec.thoiGianSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianSVChamDiem?.thoiGianKetThuc
						? moment(rec.thoiGianSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: 'Thời gian BCS chấm điểm',
			render: (val, rec) =>
				`${
					rec.thoiGianBCSChamDiem?.thoiGianBatDau
						? moment(rec.thoiGianBCSChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianBCSChamDiem?.thoiGianKetThuc
						? moment(rec.thoiGianBCSChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: 'Thời gian chủ nhiệm lớp xác nhận',
			render: (val, rec) =>
				`${
					rec.thoiGianCoVanChamDiem?.thoiGianBatDau
						? moment(rec.thoiGianCoVanChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianCoVanChamDiem?.thoiGianKetThuc
						? moment(rec.thoiGianCoVanChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: 'Thời gian gửi khiếu nại',
			render: (val, rec) =>
				`${
					rec.thoiGianKhieuNai?.thoiGianBatDau
						? moment(rec.thoiGianKhieuNai.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianKhieuNai?.thoiGianKetThuc
						? moment(rec.thoiGianKhieuNai.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},

		// {
		// 	title: 'Thời gian phòng CTSV chấm điểm',
		// 	render: (val, rec) =>
		// 		`${
		// 			rec.thoiGianPhongCTSVChamDiem?.thoiGianBatDau
		// 				? moment(rec.thoiGianPhongCTSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
		// 				: ''
		// 		} - ${
		// 			rec.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc
		// 				? moment(rec.thoiGianPhongCTSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
		// 				: ''
		// 		}`,
		// 	width: 150,
		// 	onCell,
		// 	align: 'center',
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Xem chi tiết'
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							handleView(rec);
						}}
					/>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							handleEdit(rec);
						}}
					/>
					<Popconfirm
						title={'Bạn có chắc chắn muốn xoá biểu mẫu này'}
						placement={'topLeft'}
						onConfirm={() => {
							deleteModel(rec?._id);
						}}
					>
						<ButtonExtend tooltip='Xoá' type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	useEffect(() => {
		getAllKyHoc();
	}, []);

	return (
		<>
			<TableBase
				Form={isView ? ViewChiTiet : FormThemMoi}
				title={'Đợt chấm điểm rèn luyện'}
				modelName={'diemrenluyen.dot'}
				columns={columns}
				widthDrawer={700}
				destroyModal
			/>
		</>
	);
};
export default DotPage;
