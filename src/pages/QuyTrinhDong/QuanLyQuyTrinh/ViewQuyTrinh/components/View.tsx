import rules from '@/utils/rules';
import { CheckOutlined, CloseOutlined, LeftOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Select, Spin, Steps, Tag, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ViewDot from '../../components/DotQuyTrinh/ViewDot';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import SelectVanBan from '@/pages/QuyTrinhDong/QuanLyVanBan/Select';
import {
	TrangThaiTiepNhanDon,
	MapColorTrangThaiTiepNhanDon,
	ETienDoQuyTrinh,
	MapColorTienDoQuyTrinh,
} from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import { chuyenVienDieuPhoiDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { chuyenVienTiepNhanDuyet } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/donquytrinh';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import FormRender from '../../components/MauDon/FormRender';
import ViewRender from '../../components/MauDon/ViewRender';
import ThongTinTiepNhan from './thongTinTiepNhan';

const { TextArea } = Input;
const { Step } = Steps;
interface Iprops {
	dataQuyTrinh: KhaiBaoQuyTrinh.IRecord;
	current: KhaiBaoQuyTrinh.IBuocXuLy;
	initStep?: number;
	handleClickHoanThien?: () => void;
	loadingForm?: boolean;
	modalName?: any;
	FormModal?: React.FC;
	formProps?: any;
	type?: 'dieu_phoi' | 'tiep_nhan';
	getData?: () => void;
}
const View = (props: Iprops) => {
	const { dataQuyTrinh, current, loadingForm, modalName, FormModal, formProps, type, getData } = props;
	const model = useModel(modalName);
	// const { record: recordQuyTrinh } = useModel('quanlykhoahoc.quytrinh.quytrinh');
	const {
		setCurrent,
		visibleFormKhaiBaoQuyTrinh,
		setVisibleFormKhaiBaoQuyTrinh,
		setCurrentFormKhaiBao,
		setVisibleForm,
		setEditFormKhaiBao,
		setRecordFormKhaiBao,
		currentFormKhaiBao,
	} = model;
	const [form] = Form.useForm();
	const { danhSach: danhSachDotQuyTrinh } = useModel('quytrinh.dotquytrinh');
	const { setRecordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const [visibleViewDetailDot, setVisibleViewDetailDot] = useState<boolean>(false);

	// const { setRecord: setRecordSanPham } = useModel('quanlykhoahoc.sanphamnckh');
	const [danhSachDonViXuLy, setDanhSachDonViXuLy] = useState<KhaiBaoQuyTrinh.IDonViXuLy[]>([]);
	const [currentTypeDuyet, setCurrentTypeDuyet] = useState<TrangThaiTiepNhanDon>(TrangThaiTiepNhanDon.DUYET);
	const [visibleDuyet, setVisibleDuyet] = useState<boolean>(false);
	const [loadngDuyet, setLoadingDuyet] = useState<boolean>(false);
	const [loadingDieuPhoi, setLoadingDieuPhoi] = useState<boolean>(false);
	const [visibleDieuPhoi, setVisibleDieuPhoi] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [formValues, setFormValues] = useState<any>({});

	const dotCurrent = danhSachDotQuyTrinh?.find((item) => item._id === dataQuyTrinh?.dotQuyTrinhId);

	const maFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
		(item) => item?.ma === current?.ma,
	)?.maFormTiepNhan;
	const dataFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item) => item?.ma === maFormTiepNhan,
	)?.cauHinhLoaiHinh;
	const onChange = (val: number) => {
		setCurrentStep(val);
	};
	const handleSubmitDieuPhoi = async (values: any) => {
		try {
			setLoadingDieuPhoi(true);
			const payload = {
				maBuoc: current?.ma,
				maBoPhanXuLy: values?.maBoPhanXuLy,
			};
			const res = await chuyenVienDieuPhoiDon(dataQuyTrinh?._id, payload);
			if (res) {
				message.success('Điều phối thành công');
				setVisibleDieuPhoi(false);
				setVisibleForm(false);
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getData && getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDieuPhoi(false);
		}
	};
	const handleSubmitDon = async (values: any) => {
		try {
			setLoadingDuyet(true);
			const val = { ...values };
			delete val.ghiChu;
			delete val.maVanBan;
			const valuesFinal: any = {};
			const valuesForm = { ...val };
			Object.keys(valuesForm).map((item) => {
				valuesFinal[item] = {
					value: valuesForm[item],
				};
			});
			const payload = {
				maBuoc: current?.ma,
				trangThaiTiepNhan: currentTypeDuyet,
				ghiChu: values?.ghiChu ?? '',
				maVanBan: values?.maVanBan ?? '',
				thongTinTiepNhan: { ...valuesFinal },
				// maBoPhanXuLyBuocSau: 'string',
			};
			const res = await chuyenVienTiepNhanDuyet(dataQuyTrinh?._id, payload);
			if (res) {
				message.success('Xử lý thành công');
				setVisibleDuyet(false);
				setVisibleForm(false);
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getData && getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDuyet(false);
		}
	};
	const renderDescription = (value: any, tienDo?: ETienDoQuyTrinh) => {
		// if (current) {
		if (value) {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={MapColorTrangThaiTiepNhanDon?.[value?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}>
							{value?.trangThaiTiepNhan}
						</Tag>
					</div>
					<div style={{ marginBottom: 8 }}>
						<Tag color={value?.coKhaiBao ? '#1fba36' : '#ffca2c'}>
							{value?.coKhaiBao ? 'Đã thực hiện' : 'Chưa thực hiện'}
						</Tag>
					</div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		} else {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={'blue'}>Chưa đến bước xử lý</Tag>
					</div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		}

		// }
	};
	useEffect(() => {
		if (dataQuyTrinh && type === 'dieu_phoi') {
			const currentBuocXuLy = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
				(item: { ma: any }) => item?.ma === current?.ma,
			);
			if (currentBuocXuLy) {
				const arr: KhaiBaoQuyTrinh.IDonViXuLy[] = [];
				dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.map((val: KhaiBaoQuyTrinh.IDonViXuLy) => {
					if (currentBuocXuLy?.danhSachMaBoPhanXuLy?.includes(val?.ma)) {
						arr.push(val);
					}
				});
				setDanhSachDonViXuLy(arr);
			}
		}
		setCurrentStep(dataQuyTrinh?.danhSachBuocXuLy?.length - 1);
	}, [dataQuyTrinh]);
	useEffect(() => {
		if (current) {
			const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;
			const obj = arr?.find((item: { ma: any }) => item?.ma === current?.maFormKhaiBao);
			setCurrentFormKhaiBao(obj);
			if (current?.trangThaiTiepNhan === TrangThaiTiepNhanDon.CHINH_SUA_LAI) {
				const dataFormKhaiBao = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);
				const valuesFormKhaiBao: any = {};
				Object.keys(dataFormKhaiBao?.thongTinKhaiBao).map((key) => {
					valuesFormKhaiBao[key] = dataFormKhaiBao?.thongTinKhaiBao[key]?.value;
				});
				setRecordQuyTrinhForm({ ...dataFormKhaiBao, thongTinKhaiBao: valuesFormKhaiBao });
				setRecordFormKhaiBao(valuesFormKhaiBao);
				setEditFormKhaiBao(true);
			}
		}
	}, [current]);

	const cauHinhForm: QuyTrinh.IMauDon = currentFormKhaiBao;
	const dataForm = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);

	return (
		<>
			<Card
				title={
					<div>
						{dataQuyTrinh?.quyTrinh?.ten} (<a onClick={() => setVisibleViewDetailDot(true)}>{dotCurrent?.ten}</a>)
					</div>
				}
				bordered={false}
			>
				<Spin spinning={type ? false : loadingForm}>
					{!type && (
						<Button
							style={{ marginBottom: 16 }}
							icon={<LeftOutlined />}
							type={'link'}
							onClick={() => {
								history.push('/quan-ly-khoa-hoc/khai-bao-quy-trinh');
							}}
						>
							Quay lại
						</Button>
					)}

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={6} lg={6} xl={6}>
							<Steps size='small' direction={'vertical'} current={currentStep} onChange={onChange}>
								{dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.map((value) => {
									const cauHinhThoiGianDot = dotCurrent?.danhSachCauHinhThoiGianDot?.find(
										(item: { maBuoc: string }) => item.maBuoc === value.ma,
									);

									let tienDo;
									const coKhaiBao = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma)?.coKhaiBao;

									if (
										cauHinhThoiGianDot &&
										moment().isAfter(moment(cauHinhThoiGianDot.thoiGianKetThuc)) &&
										!coKhaiBao
									) {
										tienDo = ETienDoQuyTrinh.QUA_HAN;
									} else if (
										cauHinhThoiGianDot &&
										moment(cauHinhThoiGianDot.thoiGianBatDau).isBefore(moment()) &&
										moment().isBefore(cauHinhThoiGianDot.thoiGianKetThuc)
									) {
										tienDo = ETienDoQuyTrinh.DANG_DIEN_RA;
									} else if (
										cauHinhThoiGianDot &&
										moment().isBefore(moment(cauHinhThoiGianDot.thoiGianBatDau)) &&
										moment(cauHinhThoiGianDot.thoiGianBatDau).diff(moment(), 'days') === 7
									) {
										tienDo = ETienDoQuyTrinh.SAP_TOI;
									} else if (cauHinhThoiGianDot && moment().isAfter(moment(cauHinhThoiGianDot.thoiGianKetThuc))) {
										tienDo = ETienDoQuyTrinh.DA_DIEN_RA;
									}

									return (
										<Step
											key={value.ten}
											description={renderDescription(
												dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma),
												tienDo,
											)}
											disabled={dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma) === undefined}
											title={
												<div>
													{value.ten}{' '}
													{cauHinhThoiGianDot && (
														<b>
															({moment(cauHinhThoiGianDot?.thoiGianBatDau).format('DD/MM/YYYY')} -{' '}
															{moment(cauHinhThoiGianDot?.thoiGianKetThuc).format('DD/MM/YYYY')})
														</b>
													)}
												</div>
											}
											onClick={() => {
												const obj = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma);
												if (obj) {
													setCurrent(obj);
												}
												// setCurrent(value);
											}}
										/>
									);
								})}
							</Steps>
						</Col>

						<Col xs={24} sm={24} md={18} lg={18} xl={18}>
							<div style={{ marginBottom: 16 }}>
								<ThongTinTiepNhan data={current as KhaiBaoQuyTrinh.IBuocXuLy} modelName={modalName} />
							</div>
							<div>
								<Descriptions labelStyle={{ maxWidth: 300 }} column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
									{cauHinhForm?.cauHinhLoaiHinh
										?.filter((item) => item.kieuDuLieu !== EKieuDuLieu.TABLE)
										.map((item) =>
											!item?.truongThongTinLienQuan ||
											(item?.truongThongTinLienQuan &&
												(dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan] === item?.giaTriLienQuan ||
													(item.giaTriLienQuan.includes &&
														item?.giaTriLienQuan?.includes(
															dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan],
														)))) ? (
												<Descriptions.Item key={item.ma} span={item?.colspan ? item.colspan / 4 : 6} label={item?.ten}>
													<ViewRender
														cauHinh={item}
														recordSanPham={
															{
																thongTinKhaiBao: dataForm?.thongTinKhaiBao,
															} as any
														}
													/>
												</Descriptions.Item>
											) : null,
										)}
								</Descriptions>
								{cauHinhForm?.cauHinhLoaiHinh
									.filter((item) => {
										return item.kieuDuLieu === EKieuDuLieu.TABLE;
									})
									.map((item) => (
										<>
											<Descriptions>
												<Descriptions.Item span={6} label={item.ten}>
													{' '}
												</Descriptions.Item>
											</Descriptions>
											<ViewRender
												cauHinh={item}
												recordSanPham={
													{
														thongTinKhaiBao: dataForm?.thongTinKhaiBao,
													} as any
												}
											/>
											<br />
										</>
									))}
							</div>
						</Col>
						{type === 'tiep_nhan' && (
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button
										disabled={
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
										}
										style={{ marginRight: 8 }}
										type={'primary'}
										icon={<CheckOutlined />}
										onClick={() => {
											setCurrentTypeDuyet(TrangThaiTiepNhanDon.DUYET);
											setVisibleDuyet(true);
										}}
									>
										Duyệt
									</Button>
									<Button
										disabled={
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
										}
										style={{ marginRight: 8 }}
										icon={<UndoOutlined />}
										onClick={() => {
											setCurrentTypeDuyet(TrangThaiTiepNhanDon.CHINH_SUA_LAI);
											setVisibleDuyet(true);
										}}
									>
										Yêu cầu chỉnh sửa
									</Button>
									<Button
										disabled={
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
											current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
										}
										style={{ marginRight: 8 }}
										danger
										type='primary'
										icon={<CloseOutlined />}
										onClick={() => {
											setCurrentTypeDuyet(TrangThaiTiepNhanDon.KHONG_DUYET);
											setVisibleDuyet(true);
										}}
									>
										Không duyệt
									</Button>

									<Button
										danger
										// type={'primary'}
										icon={<CloseOutlined />}
										onClick={() => {
											setVisibleForm(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Col>
						)}
						{type === 'dieu_phoi' && (
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button
										disabled={
											(current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
												current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI) ||
											current?.maBoPhanXuLy
												? true
												: false
										}
										style={{ marginRight: 8 }}
										type={'primary'}
										icon={<CheckOutlined />}
										onClick={() => {
											setVisibleDieuPhoi(true);
										}}
									>
										Điều phối
									</Button>
									<Button
										// danger
										// type={'primary'}
										onClick={() => {
											setVisibleForm(false);
										}}
										icon={<CloseOutlined />}
									>
										Đóng
									</Button>
								</div>
							</Col>
						)}
					</Row>
				</Spin>
				{FormModal && (
					<Modal
						title={'Khai báo'}
						visible={visibleFormKhaiBaoQuyTrinh}
						onCancel={() => setVisibleFormKhaiBaoQuyTrinh(false)}
						width={1200}
						footer={null}
						destroyOnClose
					>
						<FormModal {...formProps} />
					</Modal>
				)}
				<Modal
					width={700}
					title={'Xử lý đơn'}
					visible={visibleDuyet}
					onCancel={() => {
						setVisibleDuyet(false);
					}}
					destroyOnClose
					footer={null}
				>
					<Spin spinning={loadngDuyet}>
						<Form
							form={form}
							onFinish={handleSubmitDon}
							layout={'vertical'}
							onValuesChange={(changedValues, values) => {
								setFormValues(values);
							}}
						>
							{type === 'tiep_nhan' && currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
								<Row gutter={[12, 0]}>
									{dataFormTiepNhan?.map((item) => (
										<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
									))}
								</Row>
							)}

							<Form.Item
								label={'Ghi chú'}
								name={'ghiChu'}
								rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.required] : []}
							>
								<TextArea rows={4} placeholder='Nhập ghi chú' />
							</Form.Item>
							{currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
								<Form.Item
									label={'Văn bản đính kèm'}
									name={'maVanBan'}
									rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.required] : []}
								>
									<SelectVanBan dataState={'ma'} hasCreate />
								</Form.Item>
							)}
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										Xác nhận
									</Button>
									<Button
										onClick={() => {
											setVisibleDuyet(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					title={'Điều phối'}
					visible={visibleDieuPhoi}
					onCancel={() => {
						setVisibleDieuPhoi(false);
					}}
					destroyOnClose
					footer={null}
				>
					<Spin spinning={loadingDieuPhoi}>
						<Form onFinish={handleSubmitDieuPhoi} layout={'vertical'}>
							<Form.Item label={'Bộ phận xử lý'} name={'maBoPhanXuLy'} rules={[...rules.required]}>
								<Select
									style={{ width: '100%' }}
									placeholder={'Chọn bộ phận xử lý'}
									onChange={() => {}}
									options={danhSachDonViXuLy?.map((val) => {
										return {
											value: val?.ma,
											label: val?.ten,
										};
									})}
								/>
							</Form.Item>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										Xác nhận
									</Button>
									<Button
										onClick={() => {
											setVisibleDieuPhoi(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					footer={
						<Button
							type='primary'
							onClick={() => {
								setVisibleViewDetailDot(false);
							}}
						>
							OK
						</Button>
					}
					bodyStyle={{ padding: 0 }}
					visible={visibleViewDetailDot}
					onCancel={() => setVisibleViewDetailDot(false)}
				>
					{dotCurrent && dataQuyTrinh.quyTrinh && <ViewDot recDot={dotCurrent} recQuyTrinh={dataQuyTrinh.quyTrinh} />}
				</Modal>
			</Card>
		</>
	);
};
export default View;
