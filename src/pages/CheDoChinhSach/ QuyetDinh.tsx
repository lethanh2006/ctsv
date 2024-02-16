import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { DeleteOutlined, DownloadOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useCallback, useEffect } from 'react';
import { useModel } from 'umi';
import ViewRender from '../QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/ViewRender';
import { buildFilter } from './components/BuildFilter';
import FormGiaoNopSanPham from './components/FormGiaoNopSanPham';
import FormImport from './components/FormImport';
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
	} = useModel('quyetdinhchedosinhvien');
	const { danhSach, getAllModel: getAllDanhMuc } = useModel('quytrinh.danhmuc');
	const {
		record: recordCheDoChinhSach,
		loading,
		getTemplateImportCheDoSinhVienModel,
		visibleImport,
		setVisibleImport,
		getAllModel,
	} = useModel('chedochinhsach');

	useEffect(() => {
		getAllModel(true, undefined, { loaiCheDoSinhVien: props.loaiCheDoSinhVien });
	}, []);

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

	const columns: IColumn<CheDoSinhVien.QuyetDinhCheDoSinhVien>[] = [];

	recordCheDoChinhSach?.danhSachCauHinhThongTin?.map((item) => {
		if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
		columns.push({
			title: item.ten,
			dataIndex: `thongTinQuyetDinh.${item.ma}`,
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
					<Button
						loading={loading}
						key={'dowload'}
						onClick={() => getTemplateImportCheDoSinhVienModel(recordCheDoChinhSach?._id ?? '')}
						icon={<DownloadOutlined />}
					>
						{' '}
						Tải mẫu nhập dữ liệu
					</Button>,
					<Button loading={loading} key={'import'} onClick={() => setVisibleImport(true)} icon={<ImportOutlined />}>
						{' '}
						Nhập dữ liệu
					</Button>,
				]}
				getData={getData}
				widthDrawer={800}
				Form={Form}
				dependencies={[page, limit, recordCheDoChinhSach?._id]}
				title={props.title || 'Chế độ chính sách'}
				modelName={'quyetdinhchedosinhvien'}
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
