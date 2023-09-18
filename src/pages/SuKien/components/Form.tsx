import MyDatePicker from '@/components/MyDatePicker';
import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTao/LopHanhChinh/Select';
import SelectLopHocPhanDebounce from '@/pages/DaoTao/LopHocPhan/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import TableSelectNhanSu from '@/pages/ThongBao/components/TableSelectNhanSu';
import TableSelectSinhVien from '@/pages/ThongBao/components/TableSelectSinhVien';
import GroupTagVaiTro from '@/pages/TienIch/KhaoSat/DotKhaoSat/GroupTagVaiTro';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { ELoaiSuKienSinhVien, EReceiverType, ESuKienType, LoaiDoiTuongThamGia } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { resetFieldsForm, tienVietNam } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Select, Tabs } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { first } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface Props {
	hideCard?: boolean;
}

export type FormValues = SuKien.IRecord & {
	danhSachDoiTuong?: any;
	variantDanhSachThamGia?: 'Tất cả' | 'Cụ thể';
};

const FormSuKien = ({ hideCard }: Props) => {
	const {
		record,
		edit,
		isView,
		setVisibleForm,
		formSubmiting,
		visibleForm,
		getSuKienType,
		putModel,
		postModel,
		getModel,
	} = useModel('sukien');
	const [form] = Form.useForm<FormValues>();
	const thoiGianBatDau = useWatch(['thoiGianBatDau'], form);

	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKien.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKien.IUser[]>([]);
	const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) ?? EReceiverType.All;
	const variantDanhSachThamGia = Form.useWatch('variantDanhSachThamGia', form) ?? 'Tất cả';
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);

	useEffect(() => {
		setDanhSachNhanSu([]);
		setDanhSachSinhVien([]);
		resetFieldsForm(form, {
			...record,
			receiverType: record?.receiverType ?? EReceiverType.All,
			variantDanhSachThamGia: record?.roles?.length ? 'Cụ thể' : 'Tất cả',
			filter: {
				...record?.filter,
				roles: record?.filter?.roles?.length ? record?.filter?.roles : record?.roles,
			},
			danhSachDoiTuong: [
				...(record?.filter?.idKhoa ?? []),
				...(record?.filter?.idKhoaSinhVien ?? []),
				...(record?.filter?.idLopHanhChinh ?? []),
				...(record?.filter?.idLopHocPhan ?? []),
				...(record?.filter?.idNganh ?? []),
			],
		} as FormValues);
		setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
		setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
		setActiveKey(first(record?.roles ?? []));
	}, [record?._id, visibleForm]);

	const onFinish = async (values: FormValues) => {
		const key_ = `id${receiverType}` as keyof Required<SuKien.IRecord>['filter'];
		if (values?.filter) {
			values.filter[key_] = values.danhSachDoiTuong;
		}
		if (receiverType === EReceiverType.All) {
			values.users = [];
		}
		delete values.danhSachDoiTuong;

		if (variantDanhSachThamGia === 'Cụ thể') {
			values.users = [
				...danhSachNhanSu.map((item) => ({
					...item,
					vaiTro: EVaiTroBieuMau.NHAN_VIEN,
				})),
				...danhSachSinhVien.map((item) => ({
					...item,
					vaiTro: EVaiTroBieuMau.SINH_VIEN,
				})),
			];
			delete values.filter?.roles;
		}
		delete values.variantDanhSachThamGia;

		if (edit) {
			putModel(record?._id ?? '', values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel({ ...values, loaiSuKien: getSuKienType() }, getModel)
				.then()
				.catch((er) => console.log(er));
		}
	};

	const renderContent = () => {
		return (
			<>
				<Form
					id='FormSuKien'
					form={form}
					layout='vertical'
					onFinish={onFinish}
					onFieldsChange={() => console.log(form.getFieldsValue())}
					disabled={isView}
				>
					<Row gutter={[12, 0]}>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='tenSuKien'
								label='Tên sự kiện'
							>
								<Input placeholder='Tên sự kiện' />
							</Form.Item>
						</Col>
						{getSuKienType() === ESuKienType.CAC_HOAT_DONG && (
							<Col xs={24}>
								<Form.Item rules={[...rules.required]} name='loaiSuKienSinhVien' label='Loại'>
									<Select
										options={Object.values(ELoaiSuKienSinhVien).map((item) => ({ label: item, value: item }))}
										placeholder='Loại'
									/>
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

						<Col xs={24} md={12}>
							<Form.Item rules={[...rules.text, ...rules.length(250)]} name='diaDiem' label='Địa điểm'>
								<Input placeholder='Địa điểm' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item rules={[...rules.number(Number.MAX_SAFE_INTEGER, 0)]} name='kinhPhi' label='Kinh phí'>
								<InputNumber
									style={{ width: '100%' }}
									placeholder='Kinh phí'
									formatter={(value) => {
										const value_ = Number(value);
										return isNaN(value_) ? (value as any) : tienVietNam(value_);
									}}
									parser={(value) => (value ? Number(value?.replace(/[^0-9]/g, '')) : '')}
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='receiverType' label='Đối tượng tham gia' rules={[...rules.required]}>
								<Select
									options={Object.entries(LoaiDoiTuongThamGia).map(([value, label]) => ({
										key: value,
										value,
										label,
										disabled: value === EReceiverType.User,
									}))}
									placeholder='Đối tượng tham gia'
									onChange={() => {
										form.setFieldsValue({
											filter: { roles: [] } as any,
											danhSachDoiTuong: [],
										});
										setDanhSachNhanSu([]);
										setDanhSachSinhVien([]);
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name={['filter', 'roles']} label='Thành phần' rules={[...rules.required]}>
								<GroupTagVaiTro
									onChange={(arr) => {
										setActiveKey(arr?.[0]);
										if (!arr.includes(EVaiTroBieuMau.SINH_VIEN)) setDanhSachSinhVien([]);
										if (!arr.includes(EVaiTroBieuMau.NHAN_VIEN)) setDanhSachNhanSu([]);
									}}
									listVaiTro={
										[EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
											? [EVaiTroBieuMau.SINH_VIEN]
											: receiverType === EReceiverType.Khoa
											? [EVaiTroBieuMau.NHAN_VIEN]
											: undefined
									}
								/>
							</Form.Item>
						</Col>
						{roles?.length ? (
							<Col span={24} md={8}>
								<Form.Item name='variantDanhSachThamGia' label='Danh sách người tham gia'>
									<Radio.Group
										buttonStyle='solid'
										optionType='button'
										onChange={() => {
											setActiveKey(first(roles));
										}}
									>
										<Radio value={'Tất cả'}>Tất cả</Radio>
										<Radio value={'Cụ thể'}>Cụ thể</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
						) : null}

						{receiverType !== EReceiverType.All ? (
							<Col span={24}>
								<Form.Item name='danhSachDoiTuong' requiredMark>
									{receiverType === EReceiverType.Khoa ? (
										<SelectDonVi multiple selectMa />
									) : receiverType === EReceiverType.KhoaSinhVien ? (
										<SelectKhoaSinhVien multiple />
									) : receiverType === EReceiverType.LopHanhChinh ? (
										<SelectLopHanhChinhDebounce multiple selectTen />
									) : receiverType === EReceiverType.LopHocPhan ? (
										<SelectLopHocPhanDebounce multiple selectTen />
									) : receiverType === EReceiverType.Nganh ? (
										<SelectNganhCoSo multiple />
									) : null}
								</Form.Item>
							</Col>
						) : null}

						{roles?.length && variantDanhSachThamGia === 'Cụ thể' ? (
							<Col span={24} style={{ marginBottom: 12 }}>
								<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
									{Object.values(EVaiTroBieuMau).map((item) =>
										roles.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} /> : null,
									)}
								</Tabs>

								{activeKey === EVaiTroBieuMau.SINH_VIEN ? (
									<TableSelectSinhVien
										selectedUsers={danhSachSinhVien}
										setSelectedUsers={setDanhSachSinhVien}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
									<TableSelectNhanSu
										selectedUsers={danhSachNhanSu}
										setSelectedUsers={setDanhSachNhanSu}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : null}
							</Col>
						) : null}

						<Col xs={24}>
							<Form.Item rules={[...rules.text, ...rules.length(1000)]} name='ghiChu' label='Ghi chú'>
								<Input.TextArea placeholder='Ghi chú' rows={3} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className='form-footer'>
					{!isView && (
						<Button form='FormSuKien' loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</>
		);
	};

	if (hideCard) {
		return <div>{renderContent()}</div>;
	}

	return <Card title={`${isView ? 'Chi tiết' : edit ? 'Chỉnh sửa' : 'Thêm mới'} sự kiện`}>{renderContent()}</Card>;
};

export default FormSuKien;
