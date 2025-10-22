import { ETrangThaiDienRaMappingToTagColor, ETrangThaiDienRaMappingToTagLabel } from '@/services/SuKien/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { Descriptions, Divider, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'umi';
import { useModel } from 'umi';
import ViewKhaoSat from '@/pages/SuKienV2/components/ViewKhaoSat/View';
import { useState } from 'react';

interface IProps {
	data: SuKienV2.IRecord;
}
const ThongTinChung = (props: IProps) => {
	const { data } = props;
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const [visibleKhaoSat, setVisibleKhaoSat] = useState<boolean>(false);

	const handleViewBieuMau = async (idBieuMau: string) => {
		try {
			getBieuMau(idBieuMau).then(() => {
				setVisibleKhaoSat(true);
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label='Tên sự kiện'>{data?.tenSuKien}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					{data?.trangThai ? (
						<Tag color={ETrangThaiDienRaMappingToTagColor[data.trangThai]}>
							{ETrangThaiDienRaMappingToTagLabel[data.trangThai]}
						</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				{data?.thoiGianBatDauDangKy && (
					<Descriptions.Item label='Thời gian bắt đầu đăng ký'>
						{data?.thoiGianBatDauDangKy ? dayjs(data?.thoiGianBatDauDangKy).format('HH:mm DD/MM/YYYY') : '--'}
					</Descriptions.Item>
				)}
				{data?.thoiGianKetThucDangKy && (
					<Descriptions.Item label='Thời gian kết thúc đăng ký'>
						{data?.thoiGianKetThucDangKy ? dayjs(data?.thoiGianKetThucDangKy).format('HH:mm DD/MM/YYYY') : '--'}
					</Descriptions.Item>
				)}
				<Descriptions.Item label='Thời gian bắt đầu'>
					{data?.thoiGianBatDau ? dayjs(data?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian kết thúc'>
					{data?.thoiGianKetThuc ? dayjs(data?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Địa điểm'>
					{data?.diaDiem ?? '--'}
				</Descriptions.Item>
				{/*<Descriptions.Item label='Kinh phí'>{data?.kinhPhi ? tienVietNam(data?.kinhPhi) : '--'}</Descriptions.Item>*/}
				{/*<Descriptions.Item label='Số lượng'>{data?.soLuong ?? data?.users?.length ?? '--'}</Descriptions.Item>*/}
				<Descriptions.Item span={6} label='Ghi chú'>
					{data?.ghiChu ?? '--'}
				</Descriptions.Item>
				{/*<Descriptions.Item label='Mã hoạt động'>*/}
				{/*	<Link target='_blank' to={`/qr-su-kien/${data?._id}`}>*/}
				{/*		{data?.maSuKien}*/}
				{/*	</Link>*/}
				{/*</Descriptions.Item>*/}
				{data?.idKhaoSatDangKy && (
					<Descriptions.Item label='Biểu mẫu khảo sát đăng ký'>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => {
								handleViewBieuMau(data?.idKhaoSatDangKy ?? '');
							}}
						>
							Biểu mẫu
						</div>
					</Descriptions.Item>
				)}
				{data?.idKhaoSatCheckIn && (
					<Descriptions.Item label='Biểu mẫu khảo sát checkin'>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => {
								handleViewBieuMau(data?.idKhaoSatCheckIn ?? '');
							}}
						>
							Biểu mẫu
						</div>
					</Descriptions.Item>
				)}
				{data?.idKhaoSatCheckOut && (
					<Descriptions.Item label='Biểu mẫu khảo sát checkout'>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => {
								handleViewBieuMau(data?.idKhaoSatCheckOut ?? '');
							}}
						>
							Biểu mẫu
						</div>
					</Descriptions.Item>
				)}

				{/*{data?.receiverType && (*/}
				{/*	<Descriptions.Item label='Đối tượng tham gia'>*/}
				{/*		<Space style={{ width: '100%' }} direction='vertical'>*/}
				{/*			<div>{LoaiDoiTuongThamGia[data?.receiverType]}</div>*/}
				{/*			{data?.receiverType === EReceiverType.Khoa ? (*/}
				{/*				<SelectDonVi readOnly value={data.filter?.idKhoa} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.KhoaSinhVien ? (*/}
				{/*				<SelectKhoaSinhVien disabled value={data.filter?.idKhoaSinhVien} multiple />*/}
				{/*			) : data?.receiverType === EReceiverType.LopHanhChinh ? (*/}
				{/*				<SelectLopHanhChinhDebounce disabled value={data.filter?.idLopHanhChinh} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.LopHocPhan ? (*/}
				{/*				<SelectLopHocPhanDebounce disabled value={data.filter?.idLopHocPhan} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.Nganh ? (*/}
				{/*				<SelectNganhCoSo disabled value={data.filter?.idNganh} multiple />*/}
				{/*			) : null}*/}
				{/*		</Space>*/}
				{/*	</Descriptions.Item>*/}
				{/*)}*/}
				{/*{roles?.length && (*/}
				{/*	<Descriptions.Item label='Thành phần'>*/}
				{/*		{roles.map((role) => TenVaiTroBieuMau[role]).join('; ')}*/}
				{/*	</Descriptions.Item>*/}
				{/*)}*/}
				{/*{!data?.users?.length && <Descriptions.Item label='Danh sách người tham gia'>Tất cả</Descriptions.Item>}*/}
			</Descriptions>
			<Divider />
			<Descriptions column={2}>
				{data?.isQRDangKy && (
					<Descriptions.Item label='Đường dẫn đăng ký sự kiện'>
						{dayjs(data?.thoiGianBatDauDangKy).isAfter(dayjs()) ? (
							<Tag color={'orange'}>Chưa đến thời gian đăng ký</Tag>
						) : (
							<>
								{dayjs(data?.thoiGianKetThucDangKy).isBefore(dayjs()) ? (
									<Tag color={'red'}>Đã hết thời gian đăng ký</Tag>
								) : (
									<>
										<Link target='_blank' to={`/qr-tham-gia/${data?._id}?type=Đăng ký`}>
											Mã QR
										</Link>
									</>
								)}
							</>
						)}
					</Descriptions.Item>
				)}
				{data?.isQRThamGia && (
					<Descriptions.Item label='Đường dẫn điểm danh sự kiện'>
						{/* {dayjs(data?.thoiGianBatDau).isAfter(dayjs()) ? (
							<Tag color={'orange'}>Chưa đến thời gian điểm danh</Tag>
						) : (
							<>
								{dayjs(data?.thoiGianKetThuc).isBefore(dayjs()) ? (
									<Tag color={'red'}>Đã hết thời gian điểm danh</Tag>
								) : ( */}
						<>
							<Link target='_blank' to={`/qr-su-kien-v2/${data?._id}?type=Điểm danh`}>
								Mã QR
							</Link>
						</>
						{/* )}
							</>
						)} */}
					</Descriptions.Item>
				)}
			</Descriptions>
			<Modal
				title={'Khảo sát'}
				open={visibleKhaoSat}
				onCancel={() => {
					setVisibleKhaoSat(false);
				}}
				width={800}
				footer={null}
			>
				<ViewKhaoSat
					hideCard
					onCancel={() => {
						setVisibleKhaoSat(false);
					}}
				/>
			</Modal>
		</>
	);
};
export default ThongTinChung;
