import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTao/LopHanhChinh/Select';
import SelectLopHocPhanDebounce from '@/pages/DaoTao/LopHocPhan/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import TableSelectNhanSu from '@/pages/ThongBao/components/TableSelectNhanSu';
import TableSelectSinhVien from '@/pages/ThongBao/components/TableSelectSinhVien';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import {
	EReceiverType,
	ETrangThaiDienRaMappingToTagColor,
	ETrangThaiDienRaMappingToTagLabel,
	LoaiDoiTuongThamGia,
} from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { tienVietNam } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tabs, Tag, Typography } from 'antd';
import { first } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

export const Detail = () => {
	const { deleteModel, handleEdit, setIsVisibleFormDetail, record, isVisibleFormDetail, getModel } = useModel('sukien');

	const [activeKey, setActiveKey] = useState<string | undefined>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKien.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKien.IUser[]>([]);

	const roles = record?.roles?.length ? record?.roles : record?.filter?.roles;
	const danhSachDoiTuong = [
		...(record?.filter?.idKhoa ?? []),
		...(record?.filter?.idKhoaSinhVien ?? []),
		...(record?.filter?.idLopHanhChinh ?? []),
		...(record?.filter?.idLopHocPhan ?? []),
		...(record?.filter?.idNganh ?? []),
	];

	useEffect(() => {
		if (isVisibleFormDetail) {
			setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
			setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
			setActiveKey(first(record?.roles ?? []));
		} else {
			setDanhSachNhanSu([]);
			setDanhSachSinhVien([]);
			setActiveKey(undefined);
		}
	}, [record?._id, isVisibleFormDetail]);

	return (
		<Modal
			width={900}
			visible={isVisibleFormDetail}
			title='Chi tiết hoạt động'
			destroyOnClose
			onCancel={() => setIsVisibleFormDetail(false)}
			footer={
				<Space wrap>
					<Button
						type='primary'
						onClick={() => {
							handleEdit(record);
							setIsVisibleFormDetail(false);
						}}
						icon={<EditOutlined />}
					>
						Chỉnh sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa hoạt động này không?'
						onConfirm={() => {
							deleteModel(record?._id ?? '', getModel);
							setIsVisibleFormDetail(false);
						}}
					>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>

					<Button onClick={() => setIsVisibleFormDetail(false)}>Đóng</Button>
				</Space>
			}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Trạng thái'>
					{record?.trangThai ? (
						<Tag color={ETrangThaiDienRaMappingToTagColor[record.trangThai]}>
							{ETrangThaiDienRaMappingToTagLabel[record.trangThai]}
						</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Tên hoạt động'>{record?.tenSuKien}</Descriptions.Item>
				<Descriptions.Item label='Địa điểm'>{record?.diaDiem ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Thời gian bắt đầu'>
					{record?.thoiGianBatDau ? moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian kết thúc'>
					{record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Kinh phí'>{record?.kinhPhi ? tienVietNam(record?.kinhPhi) : '--'}</Descriptions.Item>
				<Descriptions.Item label='Số lượng'>{record?.soLuong ?? record?.users?.length ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã hoạt động'>
					<Link target='_blank' to={`/qr-su-kien/${record?._id}`}>
						{record?.maSuKien}
					</Link>
				</Descriptions.Item>
				{record?.receiverType && (
					<Descriptions.Item label='Đối tượng tham gia'>
						<Space style={{ width: '100%' }} direction='vertical'>
							<div>{LoaiDoiTuongThamGia[record?.receiverType]}</div>
							{record?.receiverType === EReceiverType.Khoa ? (
								<SelectDonVi readOnly value={record.filter?.idKhoa} multiple selectMa />
							) : record?.receiverType === EReceiverType.KhoaSinhVien ? (
								<SelectKhoaSinhVien readOnly value={record.filter?.idKhoaSinhVien} multiple />
							) : record?.receiverType === EReceiverType.LopHanhChinh ? (
								<SelectLopHanhChinhDebounce readOnly value={record.filter?.idLopHanhChinh} multiple selectTen />
							) : record?.receiverType === EReceiverType.LopHocPhan ? (
								<SelectLopHocPhanDebounce readOnly value={record.filter?.idLopHocPhan} multiple selectTen />
							) : record?.receiverType === EReceiverType.Nganh ? (
								<SelectNganhCoSo readOnly value={record.filter?.idNganh} multiple />
							) : null}
						</Space>
					</Descriptions.Item>
				)}
				{roles?.length && (
					<Descriptions.Item label='Thành phần'>
						{roles.map((role) => TenVaiTroBieuMau[role]).join('; ')}
					</Descriptions.Item>
				)}
				{!record?.users?.length && <Descriptions.Item label='Danh sách người tham gia'>Tất cả</Descriptions.Item>}
			</Descriptions>
			{record?.users?.length ? (
				<div>
					<Typography.Text strong>Danh sách người tham gia :</Typography.Text>
					<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
						{Object.values(EVaiTroBieuMau).map((item) =>
							roles?.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} /> : null,
						)}
					</Tabs>

					{activeKey === EVaiTroBieuMau.SINH_VIEN ? (
						<TableSelectSinhVien
							readOnly
							selectedUsers={danhSachSinhVien}
							setSelectedUsers={setDanhSachSinhVien}
							danhSachDoiTuong={{ [`id${record?.receiverType}`]: danhSachDoiTuong }}
						/>
					) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
						<TableSelectNhanSu
							readOnly
							selectedUsers={danhSachNhanSu}
							setSelectedUsers={setDanhSachNhanSu}
							danhSachDoiTuong={{ [`id${record?.receiverType}`]: danhSachDoiTuong }}
						/>
					) : null}
				</div>
			) : null}
		</Modal>
	);
};
