import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Button, Popconfirm, Modal } from 'antd';
import { useModel } from 'umi';
import FormBieuMau from './components/Form';
import { useEffect } from 'react';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import FormGiaoNopMinhChung from '../MinhChung/components/FormGiaoNopMinhChung';

const BieuMauDiemRenLuyen = () => {
	const { handleEdit, deleteModel, page, limit, recordTieuChi, visiblePreview, setVisiblePreview } =
		useModel('diemrenluyen.bieumau');
	const { getAllModel: getAllDanhMucChung, danhSach: danhSachDanhMucChung } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		if (!danhSachDanhMucChung.length) {
			getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
		}
	}, []);

	const onCancelPreview = () => {
		setVisiblePreview(false);
	};

	const column: IColumn<MauDiemRenLuyen.IRecord>[] = [
		{
			title: 'Tên biểu mẫu',
			dataIndex: 'ten',
			width: 300,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: MauDiemRenLuyen.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={1000}
				Form={FormBieuMau}
				title='Biểu mẫu đánh giá'
				columns={column}
				modelName={'diemrenluyen.bieumau'}
				dependencies={[page, limit]}
			/>
			<Modal
				destroyOnClose
				title={recordTieuChi?.ten}
				zIndex={1001}
				footer={
					<Button type='primary' onClick={onCancelPreview}>
						OK
					</Button>
				}
				width={800}
				visible={visiblePreview}
				onCancel={onCancelPreview}
			>
				<FormGiaoNopMinhChung isView getData={() => {}} />
			</Modal>
		</>
	);
};

export default BieuMauDiemRenLuyen;
