import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTao/LopHanhChinh/Select';
import SelectLopHocPhanDebounce from '@/pages/DaoTao/LopHocPhan/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import TableSelectNhanSu from '@/pages/ThongBao/components/TableSelectNhanSu';
import TableSelectSinhVien from '@/pages/ThongBao/components/TableSelectSinhVien';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { EHeDaoTaoRenLuyen, EReceiverType } from '@/services/DiemRenLuyen/DotChamDiem/constants';
import { type DotChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/typing';
import { LoaiDoiTuongThamGia } from '@/services/SuKien/constant';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select, Tabs } from 'antd';
import { first } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

export type FormValues = DotChamDiem.IRecord & {
	danhSachDoiTuong?: any;
	variantDanhSachThamGia?: 'Tất cả' | 'Cụ thể';
};

export const FormDotChamDiem = () => {
	const [form] = Form.useForm<FormValues>();
	const { isView, record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('diemrenluyen.dotchamdiem');

	const disabledForm = isView;

	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<DotChamDiem.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<DotChamDiem.IUser[]>([]);
	const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) ?? EReceiverType.All;
	const variantDanhSachThamGia = Form.useWatch('variantDanhSachThamGia', form) ?? 'Tất cả';
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);

	useEffect(() => {
		setDanhSachNhanSu([]);
		setDanhSachSinhVien([]);
		resetFieldsForm(form, {
			...record,
			// Đối tượng tham gia
			receiverType: record?.receiverType ?? EReceiverType.All,
			variantDanhSachThamGia: record?.roles?.length ? 'Cụ thể' : 'Tất cả',
			filter: {
				...record?.filter,
				roles: [EVaiTroBieuMau.SINH_VIEN],
			},
			danhSachDoiTuong: [
				...(record?.filter?.idKhoa ?? []),
				...(record?.filter?.idKhoaSinhVien ?? []),
				...(record?.filter?.idLopHanhChinh ?? []),
				...(record?.filter?.idLopHocPhan ?? []),
				...(record?.filter?.idNganh ?? []),
			],

			// Date picker
			heDaoTao: EHeDaoTaoRenLuyen.CHINH_QUY,
			thoiGianTiepNhanMinhChung: [
				record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau
					? moment(record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau)
					: undefined,
				record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc
					? moment(record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc)
					: undefined,
			],
			thoiGianSVChamDiem: [
				record?.thoiGianSVChamDiem?.thoiGianBatDau ? moment(record?.thoiGianSVChamDiem?.thoiGianBatDau) : undefined,
				record?.thoiGianSVChamDiem?.thoiGianKetThuc ? moment(record?.thoiGianSVChamDiem?.thoiGianKetThuc) : undefined,
			],
			thoiGianCanSuLopChamDiem: [
				record?.thoiGianCanSuLopChamDiem?.thoiGianBatDau
					? moment(record?.thoiGianCanSuLopChamDiem?.thoiGianBatDau)
					: undefined,
				record?.thoiGianCanSuLopChamDiem?.thoiGianKetThuc
					? moment(record?.thoiGianCanSuLopChamDiem?.thoiGianKetThuc)
					: undefined,
			],
			thoiGianCVHTChamDiem: [
				record?.thoiGianCVHTChamDiem?.thoiGianBatDau ? moment(record?.thoiGianCVHTChamDiem?.thoiGianBatDau) : undefined,
				record?.thoiGianCVHTChamDiem?.thoiGianKetThuc
					? moment(record?.thoiGianCVHTChamDiem?.thoiGianKetThuc)
					: undefined,
			],
		} as FormValues);
		setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
		setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
		setActiveKey(first(record?.roles ?? []));
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		// Xử lý form đối tượng tham gia
		const key_ = `id${receiverType}` as keyof Required<DotChamDiem.IRecord>['filter'];
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

		// Xử lý ant date picker
		if (values.thoiGianTiepNhanMinhChung)
			values.thoiGianTiepNhanMinhChung = {
				thoiGianBatDau: values.thoiGianTiepNhanMinhChung?.[0],
				thoiGianKetThuc: values.thoiGianTiepNhanMinhChung?.[1],
			};

		if (values.thoiGianSVChamDiem)
			values.thoiGianSVChamDiem = {
				thoiGianBatDau: values.thoiGianSVChamDiem?.[0],
				thoiGianKetThuc: values.thoiGianSVChamDiem?.[1],
			};

		if (values.thoiGianCanSuLopChamDiem)
			values.thoiGianCanSuLopChamDiem = {
				thoiGianBatDau: values.thoiGianCanSuLopChamDiem?.[0],
				thoiGianKetThuc: values.thoiGianCanSuLopChamDiem?.[1],
			};

		if (values.thoiGianCVHTChamDiem)
			values.thoiGianCVHTChamDiem = {
				thoiGianBatDau: values.thoiGianCVHTChamDiem?.[0],
				thoiGianKetThuc: values.thoiGianCVHTChamDiem?.[1],
			};

		if (edit) putModel(record?._id ?? '', values, getModel).catch((er) => console.log(er));
		else postModel(values, getModel).catch((er) => console.log(er));
	};

	return (
		<Card title={(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'đợt chấm điểm'}>
			<Form id='FormDanhMuc' onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name={['filter', 'roles']} label='Thành phần' rules={[...rules.required]} hidden />
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item label='Tên đợt' name='tenDot' rules={[...rules.required]}>
							<Input placeholder='Tên đợt' disabled={disabledForm} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Kỳ học' name='kyHoc' rules={[...rules.required]}>
							<SelectHocKy disabled={disabledForm} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='thoiGianTiepNhanMinhChung'
							label='Thời gian tiếp nhận minh chứng'
							rules={[...rules.required]}
						>
							<MyDateRangePicker
								disabled={disabledForm}
								style={{ width: '100%' }}
								format={'HH:mm DD/MM/YYYY'}
								showTime
								placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='thoiGianSVChamDiem' label='Thời gian SV tự chấm điểm' rules={[...rules.required]}>
							<MyDateRangePicker
								disabled={disabledForm}
								style={{ width: '100%' }}
								format={'HH:mm DD/MM/YYYY'}
								showTime
								placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='thoiGianCVHTChamDiem' label='Thời gian CVHT chấm điểm' rules={[...rules.required]}>
							<MyDateRangePicker
								disabled={disabledForm}
								style={{ width: '100%' }}
								format={'HH:mm DD/MM/YYYY'}
								showTime
								placeholder={['Chọn thời gian bắt đầu', 'Chọn thời gian kết thúc']}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={8}>
						<Form.Item name='receiverType' label='Đối tượng tham gia' rules={[...rules.required]}>
							<Select
								open={false}
								style={{ pointerEvents: disabledForm ? 'none' : undefined }}
								options={Object.entries(LoaiDoiTuongThamGia).map(([value, label]) => ({
									key: value,
									value,
									label,
									disabled: value === EReceiverType.User,
									hidden: value === EReceiverType.Khoa,
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
					{roles?.length ? (
						<Col span={24} md={8}>
							<Form.Item name='variantDanhSachThamGia' label='Danh sách người tham gia'>
								<Radio.Group
									style={{ pointerEvents: disabledForm ? 'none' : undefined }}
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
									<SelectDonVi readOnly={disabledForm} multiple selectMa />
								) : receiverType === EReceiverType.KhoaSinhVien ? (
									<SelectKhoaSinhVien readOnly={disabledForm} multiple />
								) : receiverType === EReceiverType.LopHanhChinh ? (
									<SelectLopHanhChinhDebounce readOnly={disabledForm} multiple selectTen />
								) : receiverType === EReceiverType.LopHocPhan ? (
									<SelectLopHocPhanDebounce readOnly={disabledForm} multiple selectTen />
								) : receiverType === EReceiverType.Nganh ? (
									<SelectNganhCoSo readOnly={disabledForm} multiple />
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
									readOnly={disabledForm}
									selectedUsers={danhSachSinhVien}
									setSelectedUsers={setDanhSachSinhVien}
									danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
								/>
							) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
								<TableSelectNhanSu
									readOnly={disabledForm}
									selectedUsers={danhSachNhanSu}
									setSelectedUsers={setDanhSachNhanSu}
									danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
								/>
							) : null}
						</Col>
					) : null}
					<Col span={24}>
						<Form.Item label='Ghi chú' name='ghiChu'>
							<Input.TextArea disabled={disabledForm} placeholder='Ghi chú' />
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
				{!isView && (
					<Button
						form='FormDanhMuc'
						loading={formSubmiting}
						style={{ marginRight: 8 }}
						htmlType='submit'
						type='primary'
					>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
					}}
				>
					Đóng
				</Button>
			</Form.Item>
		</Card>
	);
};
