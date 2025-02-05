import { ELoaiSoLuong, ETrangThaiDienRa } from '@/services/SuKienV2/constant';
import { type SuKienV2 } from '@/services/SuKienV2/typings';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tabs, Tag } from 'antd';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { IColumn } from '@/components/Table/typing';
import ExpandText from '@/components/ExpandText';
import ThongTinChung from '@/pages/SuKienV2/components/ThongTinChung';
import DanhSachSinhVien from '@/pages/SuKienV2/components/DanhSachSinhVien';
import ThongKeKhaoSat from "@/pages/SuKienV2/components/ThongKeKhaoSat";

export const Detail = () => {
	const { deleteModel, handleEdit, setIsVisibleFormDetail, record, isVisibleFormDetail, getModel } =
		useModel('sukienv2');

	const [activeKey, setActiveKey] = useState<string | undefined>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKienV2.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKienV2.IUser[]>([]);

	const roles = record?.roles?.length ? record?.roles : record?.filter?.roles;
	const danhSachDoiTuong = [
		...(record?.filter?.idKhoa ?? []),
		...(record?.filter?.idKhoaSinhVien ?? []),
		...(record?.filter?.idLopHanhChinh ?? []),
		...(record?.filter?.idLopHocPhan ?? []),
		...(record?.filter?.idNganh ?? []),
	];
	const columns: IColumn<SuKienV2.IKinhPhiDuTru>[] = [
		{
			title: 'Nội dung',
			width: 200,
			dataIndex: 'noiDung',
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đơn vị tính',
			width: 90,
			dataIndex: 'dvTinh',
			align: 'center',
		},
		{
			title: 'Số lượng',
			// dataIndex: 'soLuong',
			width: 150,
			// align: 'center',
			children: [
				{
					title: 'Người',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGUOI && inputFormat(val)}</>;
					},
				},
				{
					title: 'Ngày',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGAY && inputFormat(val)}</>;
					},
				},
				{
					title: 'Khác',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.KHAC && inputFormat(val)}</>;
					},
				},
			],
		},
		{
			title: 'Lượt',
			dataIndex: 'luot',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phòng',
			dataIndex: 'phong',
			width: 120,
			align: 'center',
		},
		{
			title: 'Định mức',
			dataIndex: 'dinhMuc',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Dự toán',
			dataIndex: 'duToan',
			width: 120,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phân bổ nguồn',
			// dataIndex: 'phanBoNguon',
			width: 300,
			align: 'center',
			children: [
				{
					title: 'NSNN',
					dataIndex: 'nguonNSNN',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Tự chủ',
					dataIndex: 'nguonTuChu',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Vận động tài trợ',
					dataIndex: 'nguonTaiTro',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
			],
		},
		{
			title: 'Tiến độ hoàn thành',
			dataIndex: 'hoanThanh',
			width: 120,
			align: 'center',
			render: (val) => (val ? <Tag color={'green'}>Hoàn thành</Tag> : <Tag color={'red'}>Chưa hoàn thành</Tag>),
		},
		{
			title: 'Chứng từ yêu cầu',
			dataIndex: 'chungTuYeuCau',
			width: 150,
			align: 'center',
		},
		{
			title: 'Ý kiến TCKT',
			dataIndex: 'yKienTCKT',
			width: 200,
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
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
			bodyStyle={{ paddingTop: 4 }}
			width={1000}
			visible={isVisibleFormDetail}
			title='Chi tiết sự kiện'
			destroyOnClose
			onCancel={() => setIsVisibleFormDetail(false)}
			footer={null}
		>
			<Tabs destroyInactiveTabPane>
				<Tabs.TabPane tab='Thông tin chung' key='item-1'>
					<ThongTinChung data={record as SuKienV2.IRecord} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Danh sách người đăng ký' key='item-2'>
					<DanhSachSinhVien
						type={'Đăng ký'}
						// disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						// 	record?.trangThai as ETrangThaiDienRa,
						// )}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Danh sách người tham gia' key='item-3'>
					<DanhSachSinhVien
						type={'Tham gia'}
						// disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						// 	record?.trangThai as ETrangThaiDienRa,
						// )}
					/>
				</Tabs.TabPane>
				{(record?.idKhaoSatCheckOut || record?.idKhaoSatDangKy || record?.idKhaoSatCheckIn) && (
					<Tabs.TabPane tab='Thống kê khảo sát' key='item-4'>
						<ThongKeKhaoSat />
					</Tabs.TabPane>
				)}
			</Tabs>
			<div className='form-footer'>
				<Button
					disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						record?.trangThai as ETrangThaiDienRa,
					)}
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
					disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						record?.trangThai as ETrangThaiDienRa,
					)}
				>
					<Button
						disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
							record?.trangThai as ETrangThaiDienRa,
						)}
						danger
						icon={<DeleteOutlined />}
					>
						Xóa
					</Button>
				</Popconfirm>

				<Button onClick={() => setIsVisibleFormDetail(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};
