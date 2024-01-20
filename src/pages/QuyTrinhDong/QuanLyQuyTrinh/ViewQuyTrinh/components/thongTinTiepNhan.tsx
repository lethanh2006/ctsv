import { Button, Collapse, Descriptions, Modal, Tag } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import type { TrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import { MapColorTrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { useState } from 'react';
import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';

const ThongTinTiepNhan = (props: { data: KhaiBaoQuyTrinh.IBuocXuLy; modelName: any; isBuocNgoaiHeThong?: boolean }) => {
	const { data, modelName } = props;
	const model = useModel(modelName);
	const { dataQuyTrinh } = model;
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { record, getByIdModel } = useModel('taichinh.hoadon');
	const buocHienTai = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find((item: { ma: string }) => item?.ma === data?.ma);
	return (
		<>
			<Collapse defaultActiveKey={['thongtinchung']} ghost>
				<Collapse.Panel style={{ padding: 0 }} key={'thongtinchung'} header={<b>Thông tin chung</b>}>
					<Descriptions column={2} bordered>
						{buocHienTai?.moTa || buocHienTai?.danhSachVanBanLuuTru?.length ? (
							<Descriptions.Item span={24} label='Diễn giải chi tiết'>
								<div
									dangerouslySetInnerHTML={{
										__html: buocHienTai?.moTa ?? '',
									}}
								/>
								{buocHienTai?.danhSachVanBanLuuTru?.length ? (
									<div>
										Biểu mẫu kèm theo:
										{buocHienTai.danhSachVanBanLuuTru.map((item: { url: string; tenFile: string }, index: number) => (
											<div key={item.url}>
												<a href={item.url} target='_blank' rel='noreferrer'>
													{index + 1}. {item.tenFile}
												</a>
											</div>
										))}
									</div>
								) : null}
							</Descriptions.Item>
						) : null}
						{!props.isBuocNgoaiHeThong && data?.coKhaiBao && (
							<>
								<Descriptions.Item label='Trạng thái xử lý'>
									<Tag
										color={MapColorTrangThaiTiepNhanDon?.[data?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}
									>
										{data?.trangThaiTiepNhan}
									</Tag>
								</Descriptions.Item>
								<Descriptions.Item label='Bộ phận xử lý'>
									{
										dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
											(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
										)?.ten
									}
								</Descriptions.Item>
								{dataQuyTrinh?.idHoaDon && (
									<Descriptions.Item label='Trạng thái thanh toán'>
										<Tag color={EMauTrangThaiThanhToanTable?.[dataQuyTrinh?.trangThaiThanhToan ?? ''] ?? 'gray'}>
											{dataQuyTrinh?.trangThaiThanhToan
												? ETrangThaiThanhToan[dataQuyTrinh.trangThaiThanhToan]
												: 'Dịch vụ không tính phí'}
										</Tag>{' '}
										{dataQuyTrinh?.idHoaDon ? (
											<Button
												onClick={() => {
													getByIdModel(dataQuyTrinh.idHoaDon);
													setVisibleModal(true);
												}}
												type='link'
												size='small'
											>
												(Xem chi tiết)
											</Button>
										) : (
											''
										)}
									</Descriptions.Item>
								)}
								{data?.ghiChu && (
									<Descriptions.Item span={24} label='Ghi chú của bộ phận xử lý'>
										{data?.ghiChu}
									</Descriptions.Item>
								)}
								{data?.vanBan?.url && (
									<Descriptions.Item span={24} label='Văn bản kèm theo của bộ phận xử lý'>
										<a href={data?.vanBan?.url} target='_blank' rel='noreferrer'>
											{data?.vanBan?.ten}
										</a>
									</Descriptions.Item>
								)}
							</>
						)}
					</Descriptions>
				</Collapse.Panel>
			</Collapse>
			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
		</>
	);
};
export default ThongTinTiepNhan;
