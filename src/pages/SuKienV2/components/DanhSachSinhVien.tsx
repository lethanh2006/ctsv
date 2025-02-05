import formWaiting from '@/components/Loading/FormWaiting';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import FormThemMoiSinhVien from '@/pages/SuKienV2/components/FormThemMoiSinhVien';
import ViewKhaoSat from '@/pages/SuKienV2/components/ViewKhaoSat/View';
import { exportDanhSachSinhVien, getThongKeSinhVien, xemKhaoSat } from '@/services/SuKienV2';
import { ELoaiKhaoSatSuKien, ETrangThaiThamGia, MapColorETrangThaiThamGia } from '@/services/SuKienV2/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { getFilenameHeader } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	MenuOutlined,
	ProfileOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import {
	Badge,
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Modal,
	Popconfirm,
	Popover,
	Row,
	Tag,
	Tooltip,
	message,
} from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';

interface IProps {
	type: 'Đăng ký' | 'Tham gia';
	disabled?: boolean;
}
const color = ['blue', 'green', 'yellow', 'red', 'pink', 'orange'];
const DanhSachSinhVien = (props: IProps) => {
	const { type } = props;
	const {
		getModel,
		page,
		limit,
		condition,
		handleEdit,
		deleteModel,
		putModel,
		setDataTraLoiSinhVien,
		dataTraLoiSinhVien,
		setRecord,
		record,
	} = useModel('sinhviensukien');
	const { record: recSuKien } = useModel('sukienv2');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const [dataThongKe, setDataThongKe] = useState<SuKienV2.IDataThongKe>();
	const [visibleKhaoSat, setVisibleKhaoSat] = useState<boolean>(false);

	const handleGetDataThongKe = async () => {
		try {
			if (recSuKien?._id) {
				const res = await getThongKeSinhVien(recSuKien?._id);
				if (res) {
					setDataThongKe(res?.data?.data ?? ({} as SuKienV2.IDataThongKe));
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const getData = () => {
		getModel({ loaiQR: type, idSuKien: recSuKien?._id });
		handleGetDataThongKe();
	};

	const handleViewKhaoSat = async (ssoId: string, loai: ELoaiKhaoSatSuKien) => {
		try {
			if (recSuKien?._id) {
				const res = await xemKhaoSat(recSuKien?._id, loai, ssoId);
				if (res) {
					setDataTraLoiSinhVien(res?.data?.data);
					if (res?.data?.data?.idKhaoSat) {
						getBieuMau(res?.data?.data?.idKhaoSat).then(() => {
							setVisibleKhaoSat(true);
						});
					} else {
						message.info('Không có biểu mẫu vui lòng kiểm tra lại.');
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<SuKienV2.IRecordSinhVienSuKien>[] = [
		// {
		// 	title: 'Mã SV/CB',
		// 	width: 90,
		// 	dataIndex: 'maSv',
		// 	filterType: 'string',
		// 	align: 'center',
		// },
		{
			title: 'Họ tên',
			dataIndex: 'tenSv',
			width: 90,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGian',
			width: 120,
			hide: type !== 'Đăng ký',
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: 'Thời gian checkin',
			dataIndex: 'thoiGianCheckIn',
			width: 120,
			hide: type !== 'Tham gia',
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: 'Thời gian checkout',
			dataIndex: 'thoiGianCheckOut',
			width: 120,
			hide: type !== 'Tham gia',
			align: 'center',
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '--'),
		},
		{
			title: 'Làm khảo sát đăng ký',
			dataIndex: 'isLamKhaoSatDangKy',
			width: 120,
			hide: !(type === 'Đăng ký' && recSuKien?.idKhaoSatDangKy),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: 'Làm khảo sát checkin',
			dataIndex: 'isLamKhaoSatCheckIn',
			width: 120,
			hide: !(type === 'Tham gia' && recSuKien?.idKhaoSatCheckIn),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: 'Làm khảo sát checkout',
			dataIndex: 'isLamKhaoSatCheckOut',
			width: 120,
			hide: !(type === 'Tham gia' && recSuKien?.idKhaoSatCheckOut),
			align: 'center',
			render: (val) => <Checkbox checked={val ?? false} />,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiThamGia',
			width: 120,
			hide: type !== 'Đăng ký',
			align: 'center',
			render: (val) => (val ? <Tag color={MapColorETrangThaiThamGia?.[val as ETrangThaiThamGia]}>{val}</Tag> : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popover
						placement='left'
						content={
							<>
								{type === 'Đăng ký' && (
									<>
										<Popconfirm
											title={'Bạn có chắc chắn duyệt'}
											disabled={
												rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
												rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
											}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.XAC_NHAN }, getData);
											}}
										>
											<Tooltip title={'Duyệt'}>
												<Button
													disabled={
														rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
														rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
													}
													// onClick={() => {
													//   putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.XAC_NHAN }, getData);
													// }}
													type='link'
													icon={<CheckOutlined />}
												/>
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
										<Popconfirm
											title={'Bạn có chắc chắn không duyệt'}
											disabled={
												rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
												rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
											}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.TU_CHOI }, getData);
											}}
										>
											<Tooltip title={'Không duyệt'}>
												<Button
													disabled={
														rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
														rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
													}
													// onClick={() => {
													// 	putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.TU_CHOI }, getData);
													// }}
													danger
													type='link'
													icon={<CloseOutlined />}
												/>
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
										<Popconfirm
											title={'Bạn có chắc chắn đặt lại trạng thái'}
											disabled={rec?.trangThaiThamGia === ETrangThaiThamGia.CHUA_XAC_NHAN}
											onConfirm={() => {
												putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.CHUA_XAC_NHAN }, getData);
											}}
										>
											<Tooltip title={'Đặt lại trạng thái'}>
												<Button
													disabled={rec?.trangThaiThamGia === ETrangThaiThamGia.CHUA_XAC_NHAN}
													// onClick={() => {
													// 	putModel(rec?._id, { trangThaiThamGia: ETrangThaiThamGia.TU_CHOI }, getData);
													// }}
													danger
													type='link'
													icon={<UndoOutlined />}
												/>
											</Tooltip>
										</Popconfirm>
										<Divider type={'vertical'} />
									</>
								)}

								<>
									<Tooltip title={'Chỉnh sửa'}>
										<Button
											// disabled={
											// 	disabled ||
											// 	(type === 'Đăng ký'
											// 		? rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
											// 		  rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
											// 		: false)
											// }
											onClick={() => handleEdit(rec)}
											type='link'
											icon={<EditOutlined />}
										/>
									</Tooltip>
									<Divider type={'vertical'} />
									<Tooltip title={'Xoá'}>
										<Popconfirm
											// disabled={
											// 	disabled ||
											// 	(type === 'Đăng ký'
											// 		? rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
											// 		  rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
											// 		: false)
											// }
											title='Bạn có chắc chắn muốn xoá?'
											onConfirm={() => {
												deleteModel(rec?._id, getData);
											}}
										>
											<Button
												// disabled={
												// 	disabled ||
												// 	(type === 'Đăng ký'
												// 		? rec?.trangThaiThamGia === ETrangThaiThamGia.XAC_NHAN ||
												// 		  rec?.trangThaiThamGia === ETrangThaiThamGia.TU_CHOI
												// 		: false)
												// }
												danger
												type='link'
												icon={<DeleteOutlined />}
											/>
										</Popconfirm>
									</Tooltip>
								</>

								{rec?.isLamKhaoSatDangKy && type === 'Đăng ký' && (
									<>
										<Divider type={'vertical'} />
										<Tooltip title={'Khảo sát'}>
											<Button
												type={'link'}
												icon={<ProfileOutlined />}
												onClick={() => {
													setRecord(rec);
													handleViewKhaoSat(rec?.ssoId, ELoaiKhaoSatSuKien.DANG_KY);
												}}
											/>
										</Tooltip>
									</>
								)}
								{rec?.isLamKhaoSatCheckIn && type === 'Tham gia' && (
									<>
										<Divider type={'vertical'} />
										<Tooltip title={'Khảo sát checkin'}>
											<Button
												type={'link'}
												icon={<ProfileOutlined />}
												onClick={() => {
													setRecord(rec);
													handleViewKhaoSat(rec?.ssoId, ELoaiKhaoSatSuKien.CHECK_IN);
												}}
											/>
										</Tooltip>
									</>
								)}
								{rec?.isLamKhaoSatCheckOut && type === 'Tham gia' && (
									<>
										<Divider type={'vertical'} />
										<Tooltip title={'Khảo sát checkout'}>
											<Button
												type={'link'}
												icon={<ProfileOutlined />}
												onClick={() => {
													setRecord(rec);
													handleViewKhaoSat(rec?.ssoId, ELoaiKhaoSatSuKien.CHECK_OUT);
												}}
											/>
										</Tooltip>
									</>
								)}
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	const handleExportDanhSach = async () => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await exportDanhSachSinhVien({ idSuKien: recSuKien?._id });
			if (res) {
				fileDownload(res?.data, getFilenameHeader(res));
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	return (
		<>
			<div style={{ marginBottom: 8 }}>
				<Row gutter={[12, 12]}>
					{type === 'Đăng ký' && (
						<>
							<Col span={24}>
								<Card style={{ borderRadius: 5 }} hoverable>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[0]} />
											<span>
												Chưa xác nhận tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaXacNhanThamGia ?? 0}</b>
											</span>
										</div>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[1]} />
											<span>
												Xác nhận tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongXacNhanThamGia ?? 0}</b>
											</span>
										</div>
										<div>
											<Badge style={{ marginRight: 4 }} color={color?.[2]} />
											<span>
												Từ chối tham gia:
												<b style={{ marginLeft: 4 }}>{dataThongKe?.tongTuChoiThamGia ?? 0}</b>
											</span>
										</div>
									</div>
								</Card>
							</Col>
							{recSuKien?.idKhaoSatDangKy && (
								<Col span={24}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div>
												<Badge style={{ marginRight: 4 }} color={color?.[0]} />
												<span>
													Làm khảo sát đăng ký:
													<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatDangKy ?? 0}</b>
												</span>
											</div>
											<div>
												<Badge style={{ marginRight: 4 }} color={color?.[1]} />
												<span>
													Chưa làm khảo sát đăng ký:
													<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoSatDangKy ?? 0}</b>
												</span>
											</div>
										</div>
									</Card>
								</Col>
							)}
						</>
					)}

					{type === 'Tham gia' && (
						<>
							<Col
								span={
									recSuKien?.idKhaoSatCheckIn && recSuKien?.idKhaoSatCheckOut
										? 8
										: recSuKien?.idKhaoSatCheckIn || recSuKien?.idKhaoSatCheckOut
										? 12
										: 24
								}
							>
								<Card style={{ borderRadius: 5 }} hoverable>
									<Badge style={{ marginRight: 4 }} color={color?.[0]} />
									<span>
										Check in:
										<b style={{ marginLeft: 4 }}>{dataThongKe?.tongCheckin ?? 0}</b>
									</span>
									<br />
									<Badge style={{ marginRight: 4 }} color={color?.[1]} />
									<span>
										Check out:
										<b style={{ marginLeft: 4 }}>{dataThongKe?.tongCheckOut ?? 0}</b>
									</span>
									<br />
								</Card>
							</Col>
							{recSuKien?.idKhaoSatCheckIn && (
								<Col span={recSuKien?.idKhaoSatCheckOut ? 8 : 12}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<Badge style={{ marginRight: 4 }} color={color?.[0]} />
										<span>
											Làm khảo sát check in:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatCheckIn ?? 0}</b>
										</span>
										<br />
										<Badge style={{ marginRight: 4 }} color={color?.[1]} />
										<span>
											Chưa làm khảo sát check in:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoCheckIn ?? 0}</b>
										</span>
										<br />
									</Card>
								</Col>
							)}
							{recSuKien?.idKhaoSatCheckOut && (
								<Col span={recSuKien?.idKhaoSatCheckIn ? 8 : 12}>
									<Card style={{ borderRadius: 5 }} hoverable>
										<Badge style={{ marginRight: 4 }} color={color?.[0]} />
										<span>
											Làm khảo sát checkout:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongLamKhaoSatCheckOut ?? 0}</b>
										</span>
										<br />
										<Badge style={{ marginRight: 4 }} color={color?.[1]} />
										<span>
											Chưa làm khảo sát checkout:
											<b style={{ marginLeft: 4 }}>{dataThongKe?.tongChuaLamKhaoCheckOut ?? 0}</b>
										</span>
										<br />
									</Card>
								</Col>
							)}
						</>
					)}
				</Row>
			</div>

			<TableBase
				otherProps={{ size: 'small' }}
				hideCard
				buttons={{ create: true, import: false, export: false }}
				dependencies={[page, limit, type, condition]}
				getData={getData}
				modelName={'sinhviensukien'}
				columns={columns}
				Form={FormThemMoiSinhVien as any}
				formProps={{
					getData: getData,
					type: type,
				}}
				params={{ idSuKien: recSuKien?._id }}
				otherButtons={[
					<>
						<Button
							icon={<ExportOutlined />}
							size={'small'}
							onClick={() => {
								handleExportDanhSach();
							}}
						>
							Xuất dữ liệu
						</Button>
					</>,
				]}
			/>

			<Modal
				destroyOnClose
				title={`Khảo sát ${record?._id ? `sinh viên ${record?.tenSv} (${record?.maSv})` : ''}`}
				visible={visibleKhaoSat}
				onCancel={() => {
					setVisibleKhaoSat(false);
				}}
				width={800}
				footer={null}
			>
				<ViewKhaoSat
					hideCard
					disabled
					onCancel={() => {
						setVisibleKhaoSat(false);
					}}
					cauTraLoi={dataTraLoiSinhVien?.danhSachTraLoi}
				/>
			</Modal>
		</>
	);
};
export default DanhSachSinhVien;
