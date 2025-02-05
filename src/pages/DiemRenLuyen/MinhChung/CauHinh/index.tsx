import { useModel } from '@@/plugin-model/useModel';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import FormThemMoiBieuMau from '@/pages/DiemRenLuyen/MinhChung/CauHinh/components/Form';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import PreviewForm from './components/MauDon/Preview';
import { Button, Checkbox, Modal, Popconfirm, Space, Tag } from 'antd';
import {
	EDoiTuongNhap,
	ELoaiMinhChung,
	MapEDoiTuongNhap,
	MapELoaiMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/MauDon/constants';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';
import { useEffect } from 'react';

const CauHinh = () => {
	const { handleEdit, deleteModel, setRecord } = useModel('diemrenluyen.minhchung.cauhinh');
	const { setVisiblePreview, visiblePreview, setRecord: setRecordLoaiHinh } = useModel('formdong.loaihinh');
	const { getAllModel } = useModel('quytrinh.danhmuc');

	const onCell = (rec: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(rec);
			setRecordLoaiHinh({ cauHinhLoaiHinh: rec?.danhSachCauHinhMinhChung ?? [] } as LoaiHinh.IRecord);
			setVisiblePreview(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: 'Tên minh chứng',
			dataIndex: 'tenMinhChung',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: 'Mã minh chứng',
			dataIndex: 'maMinhChung',
			align: 'center',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: 'Loại minh chứng',
			dataIndex: 'loaiMinhChung',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiMinhChung)?.map((val) => ({
				value: val,
				label: MapELoaiMinhChung?.[val as ELoaiMinhChung],
			})),
			width: 150,
			onCell,
			render: (val) => MapELoaiMinhChung?.[val as ELoaiMinhChung],
		},
		{
			title: 'Đối tượng',
			dataIndex: 'doiTuongNhap',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EDoiTuongNhap)?.map((val) => ({
				value: val,
				label: MapEDoiTuongNhap?.[val as EDoiTuongNhap],
			})),
			onCell,
			width: 150,
			render: (val) => (
				<Space>
					{val?.map((item: any) => {
						return <Tag>{MapEDoiTuongNhap?.[item as EDoiTuongNhap]}</Tag>;
					})}
				</Space>
			),
		},
		{
			title: 'Dùng cho sự kiện',
			dataIndex: 'dungChoSuKien',
			align: 'center',
			filterType: 'select',
			filterData: [
				{
					value: true,
					label: 'Dùng cho sự kiện',
				},
				{
					value: false,
					label: 'Không dùng cho sự kiện',
				},
			],
			onCell,
			width: 120,
			render: (val) => <Checkbox checked={val} />,
		},
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
							setRecord(rec);
							setRecordLoaiHinh({ cauHinhLoaiHinh: rec?.danhSachCauHinhMinhChung ?? [] } as LoaiHinh.IRecord);
							setVisiblePreview(true);
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
		getAllModel();
	}, []);

	return (
		<>
			<TableBase
				Form={FormThemMoiBieuMau}
				title={'Cấu hình biểu mẫu minh chứng'}
				modelName={'diemrenluyen.minhchung.cauhinh'}
				columns={columns}
				widthDrawer={800}
				destroyModal
			/>

			<Modal
				zIndex={1000}
				bodyStyle={{ padding: 0 }}
				footer={
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={() => setVisiblePreview(false)}>Đóng</Button>
					</div>
				}
				width={900}
				visible={visiblePreview}
				onCancel={() => setVisiblePreview(false)}
			>
				<PreviewForm mode='quytrinh' isView getData={() => {}} />
			</Modal>
		</>
	);
};
export default CauHinh;
