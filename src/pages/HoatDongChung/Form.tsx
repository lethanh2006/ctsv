import MyDatePicker from '@/components/MyDatePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import {
	ECapHoatDongHuyDongGiaoDucTuTuongChinhTri,
	EHoatDongChungType1,
	ELoaiDonViPhoiHop,
} from '@/services/HoatDongChung/constants';
import {
	EHoatDongChungType2,
	ELoaiDoiTuong,
	ELoaiSuKienSinhVien,
	MapKeyLabelLoaiDoiTuong,
} from '@/services/HoatDongChung/constants';
import {
	EDoiTuongPhamViQuyTrinh,
	EVaiTroPhamViQuyTrinh,
	MapKeyVaiTroPhamViQuyTrinh,
} from '@/services/QuyTrinhDong/constant';
import { ETuanLeCongDan } from '@/services/SuKien/constant';
import rules from '@/utils/rules';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, message } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectCLB from '../CauLacBo/components/SelectCLB';
import SelectNguonKinhPhi from '../DanhMuc/NguonKinhPhi/Select';
import SelectNganhCoSo from '../DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectLopHocPhanDebounce from '../DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '../DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhDebounce from '../DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectDonVi from '../ToChucNhanSu/DonVi/Select';
import TableDuToanKinhPhi from './DuToanKinhPhi/TableDuToanKinhPhi';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';

const FormHoatDongChung = (props: {
	phanLoaiCap1: EHoatDongChungType1;
	phanLoaiCap2: EHoatDongChungType2;
	getData: any;
}) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('hoatdongchung');
	const { danhSach: danhSachNguonKinhPhi } = useModel('danhmuc.nguonkinhphi');
	const title = props?.phanLoaiCap2 ?? '';

	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>([]);
	const loaidonViChuTri = Form.useWatch('loaidonViChuTri', form);
	const loaiDonViPhoiHop = Form.useWatch('loaiDonViPhoiHop', form);
	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);
	const thoiGianBatDau = Form.useWatch(['thoiGianBatDau'], form);
	const danhSachPhamVi = Form.useWatch(['danhSachPhamVi'], form);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	useEffect(() => {
		if (props.phanLoaiCap1 === EHoatDongChungType1.PHUC_VU_CONG_DONG && listTinh?.length === 0)
			getTinhThanhPho().then((data) => {
				setListTinh(data.data.data);
			});
	}, [props.phanLoaiCap1]);

	const onChangNguonKinhPhi = (ma: string, index: number) => {
		const ns = danhSachNguonKinhPhi.find((item) => item?.ma === ma);
		form.setFieldsValue({
			['thongTinPhanBoNguonKinhPhi']: form
				.getFieldValue('thongTinPhanBoNguonKinhPhi')
				.map((item: any, i: number) => (i === index ? { ...item, tenNguonKinhPhi: ns?.ten } : item)),
		});
	};

	const onFinish = async (values: any) => {
		const payload = {
			...record,
			...values,
			phanLoaiCap1: props.phanLoaiCap1,
			phanLoaiCap2: props.phanLoaiCap2,
			info: values?.info
				? {
						...values?.info,
						type: 'CAU_LAC_BO',
				  }
				: undefined,
		};

		//Check phân bổ dự toán kinh phí
		const tongTienDuToan = _.sumBy(
			payload?.danhSachDuToanKinhPhi,
			(item: any) => (item?.soLuongNguoi ?? 1) * (item?.soLuongNgay ?? 1) * (item?.soLuongKhac ?? 1) * item?.dinhMuc,
		);
		const tongTienPhanBo = _.sumBy(payload?.thongTinPhanBoNguonKinhPhi, (item: any) => item?.kinhPhiPhanBo);
		if (tongTienDuToan !== tongTienPhanBo) {
			return message.error('Thông tin phân bổ kinh phí không khớp với tổng tiền dự toán kinh phí');
		}

		if (edit) {
			putModel(record?._id ?? '', payload, props.getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload, props.getData)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='ten' label='Tên hoạt động' rules={[...rules.required]}>
							<Input.TextArea placeholder='Tên hoạt động' />
						</Form.Item>
					</Col>

					{props.phanLoaiCap2 === EHoatDongChungType2.TUAN_LE_CONG_DAN && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required, ...rules.text, ...rules.length(250)]} name='loai' label='Loại'>
								<Select
									placeholder='Loại'
									options={Object.values(ETuanLeCongDan).map((item) => ({
										value: item,
										label: item,
									}))}
								/>
							</Form.Item>
						</Col>
					)}
					<Col xs={12}>
						<Form.Item rules={[...rules.required, ...rules.text, ...rules.length(250)]} name='maHocKy' label='Học kỳ'>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
					<Col xs={12}>
						<Form.Item
							rules={[...rules.required]}
							name='soLuongThamGia'
							label={
								props.phanLoaiCap1 === EHoatDongChungType1.PHUC_VU_CONG_DONG
									? 'Số sinh viên tham gia'
									: 'Số lượng tham gia'
							}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={
									props.phanLoaiCap1 === EHoatDongChungType1.PHUC_VU_CONG_DONG
										? 'Số sinh viên tham gia'
										: 'Số lượng tham gia'
								}
								addonAfter='Người'
							/>
						</Form.Item>
					</Col>

					{props.phanLoaiCap1 === EHoatDongChungType1.PHUC_VU_CONG_DONG && (
						<>
							<Col xs={12}>
								<Form.Item rules={[...rules.required]} name='soLuongThamGiaGv' label='Số CB, GV tham gia'>
									<InputNumber style={{ width: '100%' }} placeholder='Số CB, GV tham gia' addonAfter='Người' />
								</Form.Item>
							</Col>
							<Col xs={12}>
								<Form.Item rules={[...rules.required]} name='soLuongTiepCan' label='Số lượng tiếp cận'>
									<InputNumber style={{ width: '100%' }} placeholder='Số lượng tiếp cận' addonAfter='Người' />
								</Form.Item>
							</Col>
						</>
					)}
					{props.phanLoaiCap2 === EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='loai' label='Loại'>
								<Select
									options={Object.values(ELoaiSuKienSinhVien).map((item) => ({ label: item, value: item }))}
									placeholder='Loại'
								/>
							</Form.Item>
						</Col>
					)}
					{props.phanLoaiCap2 === EHoatDongChungType2.HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='cap' label='Cấp'>
								<Select
									options={Object.values(ECapHoatDongHuyDongGiaoDucTuTuongChinhTri).map((item) => ({
										label: item,
										value: item,
									}))}
									placeholder='Cấp'
								/>
							</Form.Item>
						</Col>
					)}
					{props.phanLoaiCap2 === EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name={['info', 'refId']} label='Câu lạc bộ'>
								<SelectCLB placeHolder='Câu lạc bộ' />
							</Form.Item>
						</Col>
					)}

					<Col xs={24} md={12}>
						<Form.Item rules={[...rules.required]} name='thoiGianBatDau' label='Thời gian bắt đầu'>
							<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'thời gian bắt đầu')]}
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabledDate={thoiGianBatDau ? (cur) => dayjs(cur).isBefore(thoiGianBatDau) : undefined}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item rules={[...rules.text]} name='diaDiem' label='Địa điểm'>
							<Input.TextArea placeholder='Địa điểm' />
						</Form.Item>
					</Col>
					{props.phanLoaiCap1 === EHoatDongChungType1.PHUC_VU_CONG_DONG && (
						<>
							<Col xs={24}>
								<Form.Item rules={[...rules.text, ...rules.required]} name='tinh' label='Tỉnh/Thành phố'>
									<Select
										placeholder='Tỉnh/thành phố'
										options={listTinh?.map((item) => ({
											key: item.ma,
											value: item.tenDonVi,
											label: item.tenDonVi,
										}))}
									/>
								</Form.Item>
							</Col>
						</>
					)}
					<Col span={24}>
						<div>Đơn vị chủ trì</div>
						<Row gutter={[12, 0]}>
							<Col span={8}>
								<Form.Item name='loaidonViChuTri'>
									<Select
										allowClear
										placeholder='Loại đơn vị chủ trì'
										options={Object.values(ELoaiDonViPhoiHop)?.map((item) => ({
											key: item,
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span={16}>
								<Form.Item rules={loaidonViChuTri ? [...rules.required] : undefined} name='donViChuTri'>
									{loaidonViChuTri === ELoaiDonViPhoiHop.HOC_VIEN ? (
										<SelectDonVi />
									) : (
										<Input placeholder='Đơn vị chủ trì' />
									)}
								</Form.Item>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<div>Đơn vị phối hợp</div>
						<Row gutter={[12, 0]}>
							<Col span={8}>
								<Form.Item name='loaiDonViPhoiHop'>
									<Select
										allowClear
										placeholder='Loại đơn vị phối hợp'
										options={Object.values(ELoaiDonViPhoiHop)?.map((item) => ({
											key: item,
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span={16}>
								<Form.Item rules={loaiDonViPhoiHop ? [...rules.required] : undefined} name='donViPhoiHop'>
									{loaiDonViPhoiHop === ELoaiDonViPhoiHop.HOC_VIEN ? (
										<SelectDonVi />
									) : (
										<Input placeholder='Đơn vị phối hợp' />
									)}
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<>
							<div style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
								<div>Thành phần tham gia</div>
							</div>
							<Form.List name='danhSachPhamVi'>
								{(fields, { add, remove, move }, { errors }) => {
									return (
										<>
											{fields.map((field, index) => {
												const doiTuong = danhSachPhamVi[index]?.loaiDoiTuong;
												return (
													<div key={field.key}>
														<Row gutter={[8, 8]} key={field.key}>
															<Col span={doiTuong === ELoaiDoiTuong.NGOAI_HE_THONG ? 24 : 12}>
																<Form.Item
																	{...field}
																	name={[index, 'loaiDoiTuong']}
																	validateTrigger={['onChange', 'onBlur']}
																	rules={[...rules.required]}
																	label='Loại'
																>
																	<Select
																		style={{ width: '100%' }}
																		options={Object.values(ELoaiDoiTuong).map((item) => ({
																			value: item,
																			label: MapKeyLabelLoaiDoiTuong[item],
																		}))}
																		placeholder='Loại'
																	/>
																</Form.Item>
															</Col>
															{danhSachPhamVi[index]?.loaiDoiTuong !== ELoaiDoiTuong.NGOAI_HE_THONG && (
																<Col span={12}>
																	<Form.Item
																		{...field}
																		name={[index, 'danhSachLoaiVaiTro']}
																		validateTrigger={['onChange', 'onBlur']}
																		rules={[...rules.required]}
																		label='Vai trò'
																	>
																		<Select
																			mode='multiple'
																			style={{ width: '100%' }}
																			options={Object.values(EVaiTroPhamViQuyTrinh).map((item) => ({
																				value: item,
																				label: MapKeyVaiTroPhamViQuyTrinh[item],
																			}))}
																			placeholder='Vai trò'
																		/>
																	</Form.Item>
																</Col>
															)}
															{doiTuong &&
																![ELoaiDoiTuong.NGOAI_HE_THONG, ELoaiDoiTuong.TAT_CA].includes(
																	danhSachPhamVi[index]?.loaiDoiTuong,
																) && (
																	<Col xs={24}>
																		<Form.Item
																			{...field}
																			rules={[...rules.required]}
																			name={[index, 'danhSachMaThamChieu']}
																			validateTrigger={['onChange', 'onBlur']}
																			noStyle
																		>
																			{doiTuong === EDoiTuongPhamViQuyTrinh.DON_VI ? (
																				<SelectDonVi style={{ width: '100%' }} multiple />
																			) : doiTuong === EDoiTuongPhamViQuyTrinh.KHOA_SV ? (
																				<SelectKhoaSinhVien style={{ width: '100%' }} multiple />
																			) : doiTuong === EDoiTuongPhamViQuyTrinh.LOP_HANH_CHINH ? (
																				<SelectLopHanhChinhDebounce style={{ width: '100%' }} multiple />
																			) : doiTuong === EDoiTuongPhamViQuyTrinh.LOP_HOC_PHAN ? (
																				<SelectLopHocPhanDebounce style={{ width: '100%' }} multiple />
																			) : doiTuong === EDoiTuongPhamViQuyTrinh.NGANH ? (
																				<SelectNganhCoSo style={{ width: '100%' }} multiple />
																			) : null}
																		</Form.Item>
																	</Col>
																)}
															<Col span={24}>
																<Form.Item
																	{...field}
																	name={[index, 'ghiChu']}
																	validateTrigger={['onChange', 'onBlur']}
																	rules={[...rules.text]}
																	noStyle
																>
																	<Input.TextArea placeholder='Ghi chú' />
																</Form.Item>
															</Col>
															<div style={{ margin: '0 auto' }}>
																<Button
																	icon={<CloseOutlined />}
																	type='link'
																	danger
																	onClick={() => remove(field.name)}
																/>

																<Button
																	disabled={index === 0}
																	icon={<ArrowUpOutlined />}
																	type='link'
																	onClick={() => move(index, index - 1)}
																/>

																<Button
																	disabled={index === fields.length - 1}
																	icon={<ArrowDownOutlined />}
																	type='link'
																	onClick={() => move(index, index + 1)}
																/>
															</div>
														</Row>
													</div>
												);
											})}
											<Form.Item>
												<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
													Thêm giá trị
												</Button>

												<Form.ErrorList errors={errors} />
											</Form.Item>
										</>
									);
								}}
							</Form.List>
						</>
					</Col>
					<Col span={24}>
						<div style={{ marginBottom: 8 }}>Dự toán kinh phí</div>
						<TableDuToanKinhPhi />
					</Col>
					<Col span={24}>
						<div style={{ marginBottom: 8, marginTop: 4 }}>Phân bổ nguồn kinh phí</div>
						<Form.List name='thongTinPhanBoNguonKinhPhi'>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 0]} key={field.key}>
											<Col span={11}>
												<Form.Item label='Nguồn kinh phí' name={[index, 'maNguonKinhPhi']} rules={[...rules.required]}>
													<SelectNguonKinhPhi selectMa onChange={(val) => onChangNguonKinhPhi(val, index)} />
												</Form.Item>
												<Form.Item name={[index, 'tenNguonKinhPhi']} hidden />
											</Col>
											<Col span={10}>
												<Form.Item label='Kinh phí phân bổ' name={[index, 'kinhPhiPhanBo']} rules={[...rules.required]}>
													<InputNumber
														formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
														min={1}
														style={{ width: '100%' }}
														placeholder='Nhập kinh phí'
														addonAfter='VNĐ'
													/>
												</Form.Item>
											</Col>

											<Col span={3}>
												<Button
													danger
													type='link'
													title='Xóa thông tin'
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
													style={{ marginTop: 30 }}
												/>
											</Col>
											<Form.ErrorList errors={errors} />
										</Row>
									))}
									<Form.ErrorList errors={errors} />
									<Button
										onClick={() => add()}
										icon={<PlusOutlined />}
										size='small'
										type='default'
										style={{ marginBottom: 8 }}
									>
										Phân bổ nguồn kinh phí
									</Button>
								</>
							)}
						</Form.List>
					</Col>
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormHoatDongChung;
