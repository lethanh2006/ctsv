import MyDatePicker from '@/components/MyDatePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import type { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
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
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectLopHocPhanDebounce from '../DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '../DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhDebounce from '../DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectDonVi from '../ToChucNhanSu/DonVi/Select';
import TableDuToanKinhPhi from './DuToanKinhPhi/TableDuToanKinhPhi';
import SelectCLB from '../CauLacBo/components/SelectCLB';

const FormHoatDongChung = (props: {
	phanLoaiCap1: EHoatDongChungType1;
	phanLoaiCap2: EHoatDongChungType2;
	getData: any;
}) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('hoatdongchung');
	const title = props?.phanLoaiCap2 ?? '';

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);
	const thoiGianBatDau = Form.useWatch(['thoiGianBatDau'], form);
	const danhSachPhamVi = Form.useWatch(['danhSachPhamVi'], form);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

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
					<Col xs={24}>
						<Form.Item rules={[...rules.required, ...rules.text, ...rules.length(250)]} name='maHocKy' label='Học kỳ'>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
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
					{props.phanLoaiCap2 === EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name={['info', 'refId']} label='Câu lạc bộ'>
								<SelectCLB placeHolder='Câu lạc bộ' />
							</Form.Item>
						</Col>
					)}

					<Col xs={24} md={12}>
						<Form.Item
							rules={[...rules.required, ...(edit ? [] : rules.sauHomNay)]}
							name='thoiGianBatDau'
							label='Thời gian bắt đầu'
						>
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
								disabledDate={thoiGianBatDau ? (cur) => moment(cur).isBefore(thoiGianBatDau) : undefined}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item rules={[...rules.text]} name='diaDiem' label='Địa điểm'>
							<Input.TextArea placeholder='Địa điểm' />
						</Form.Item>
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
																	noStyle
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
																		noStyle
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
						<div>Dự toán kinh phí</div>
						<TableDuToanKinhPhi />
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
