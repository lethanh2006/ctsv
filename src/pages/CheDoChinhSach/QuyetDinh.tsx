import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { DeleteOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useModel } from 'umi';
import ViewRender from '../QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/ViewRender';
import { buildFilter } from './components/BuildFilter';
import FormGiaoNopSanPham from './components/FormGiaoNopSanPham';
import FormImport from './components/FormImport';
import SelectCheDoChinhSach from './components/SelectCheDoChinhSach';
import ViewQuyetDinh from './components/ViewQuyetDinh';

const QuyetDinh = (props: { title: string; loaiCheDoSinhVien: ELoaiCheDoSinhVien }) => {
	const {
		handleEdit,
		deleteModel,
		setVisibleView,
		visibleView,
		setRecord: setRecordQuyetDinh,
		getModel,
		page,
		limit,
		setDanhSach,
	} = useModel('chedochinhsach.quyetdinhchedosinhvien');
	const { danhSach, getAllModel: getAllDanhMuc } = useModel('quytrinh.danhmuc');
	const {
		record: recordCheDoChinhSach,
		loading,
		getTemplateImportCheDoSinhVienModel,
		visibleImport,
		setVisibleImport,
		setRecord: setRecordCheDoChinhSach,
		danhSach: danhSachCheDoChinhSach,
	} = useModel('chedochinhsach.chedochinhsach');

	const getData = () => {
		if (recordCheDoChinhSach?._id) {
			getModel({ cheDoSinhVienId: recordCheDoChinhSach?._id });
		} else setDanhSach([]);
	};

	const onCancelView = () => {
		setVisibleView(false);
	};

	const onCell = (record: CheDoSinhVien.QuyetDinhCheDoSinhVien) => ({
		onClick: () => {
			setVisibleView(true);
			setRecordQuyetDinh(record);
		},
		style: { cursor: 'pointer' },
	});

	useEffect(() => {
		getAllDanhMuc(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	}, []);

	const columns: IColumn<CheDoSinhVien.QuyetDinhCheDoSinhVien>[] = [
		{
			title: 'Họ và tên',
			dataIndex: 'hoVaTen',
			width: 150,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Lớp',
			dataIndex: 'lop.ten',
			width: 100,
			align: 'center',
			filterType: 'string',
			onCell,
			render: (val, rec) => rec.lop.ten,
		},
		{
			title: 'Ngành',
			dataIndex: 'nganh.ten',
			width: 200,
			align: 'center',
			onCell,
			filterType: 'string',
			render: (val, rec) => rec.nganh.ten,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
			onCell,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			align: 'center',
			onCell,
		},
		{
			title: 'Dân tộc',
			dataIndex: 'danToc',
			width: 100,
			align: 'center',
			onCell,
			filterType: 'string',
		},
	];

	recordCheDoChinhSach?.danhSachCauHinhThongTin?.map((item) => {
		if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
		columns.push({
			title: item.ten,
			dataIndex: `thongTinQuyetDinh.${item.ma}.value`,
			width: 200,
			align: 'center',
			specialFilter: true,
			onCell,
			render: (val, rec) => <ViewRender cauHinh={item} recordSanPham={{ thongTinKhaiBao: rec.thongTinQuyetDinh }} />,
			...buildFilter(item, danhSach),
		});
	});

	columns.push({
		title: 'Thao tác',
		align: 'center',
		width: 120,
		fixed: 'right',
		render: (record: CheDoSinhVien.QuyetDinhCheDoSinhVien) => {
			return (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			);
		},
	});

	const Form = useCallback(() => <FormGiaoNopSanPham getData={getData} />, [recordCheDoChinhSach?._id]);

	return (
		<>
			<TableBase
				buttons={{ create: recordCheDoChinhSach?._id ? true : false }}
				otherButtons={[
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={() => getTemplateImportCheDoSinhVienModel(recordCheDoChinhSach?._id ?? '')}>
										Tải mẫu nhập dữ liệu
									</Menu.Item>
									<Menu.Item onClick={() => setVisibleImport(true)}>Nhập dữ liệu</Menu.Item>
								</Menu>
							}
						>
							<ButtonExtend loading={loading} icon={<ImportOutlined />}>
								Nhập dữ liệu
							</ButtonExtend>
						</Dropdown>

						<SelectCheDoChinhSach
							onChange={(val) => {
								setRecordCheDoChinhSach(danhSachCheDoChinhSach.find((item) => item._id === val));
							}}
							style={{ width: 400 }}
							isSetRecord
							value={recordCheDoChinhSach?._id}
							condition={{ loaiCheDoSinhVien: props.loaiCheDoSinhVien }}
							key='filter'
						/>
					</>,
				]}
				getData={getData}
				widthDrawer={800}
				Form={Form}
				dependencies={[page, limit, recordCheDoChinhSach?._id]}
				title={props.title || 'Chế độ chính sách'}
				modelName={'chedochinhsach.quyetdinhchedosinhvien'}
				columns={columns}
			/>
			<Modal destroyOnClose width={900} title='Chi tiết' footer={false} visible={visibleView} onCancel={onCancelView}>
				<ViewQuyetDinh />
			</Modal>
			<Modal onCancel={() => setVisibleImport(false)} footer={false} visible={visibleImport} title='Nhập dữ liệu'>
				<FormImport getData={getData} />
			</Modal>
		</>
	);
};

export default QuyetDinh;
