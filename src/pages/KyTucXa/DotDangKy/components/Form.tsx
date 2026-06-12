import MyDatePicker from '@/components/MyDatePicker';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import KhoaToaConfigTable from '@/pages/KyTucXa/DotDangKy/components/KhoaToaConfigTable';
import RoomTable from '@/pages/KyTucXa/DotDangKy/components/RoomTable';
import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import SinhVienDangKySection from '@/pages/KyTucXa/DotDangKy/components/SinhVienDangKySection';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select, Steps, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDotDangKyKTX = () => {
	const [form] = Form.useForm();
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.dotdangky');
	const { postSinhVienDangKy } = useModel('kytucxa.dotdangkyktx');
	const loaiDot = Form.useWatch('loaiDot', form) ?? 'Theo khoa';
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedToaNhaIds, setSelectedToaNhaIds] = useState<string[]>([]);
	const [selectedPhongIds, setSelectedPhongIds] = useState<string[]>([]);
	const [selectedKhoaNganh, setSelectedKhoaNganh] = useState<string[]>([]);
	const [selectedKhoaRows, setSelectedKhoaRows] = useState<
		Array<{
			ma: string;
			maKhoaSinhVien?: string;
			khoaSinhVien?: {
				ten?: string;
			};
		}>
	>([]);
	const [khoaToaConfig, setKhoaToaConfig] = useState<Record<string, string[]>>({});

	const { danhSach: allPhong, getAllModel: getAllPhong } = useModel('theodoitaisanvattu.phong');

	const { getAllModel: getAllToaNha } = useModel('theodoitaisanvattu.toanha');
	const { danhSach: allKhoaSinhVien, getAllModel: getAllKhoaSinhVien } = useModel('daotaov2.namhoc.khoasinhvien');

	const selectedPhongRowKeys = allPhong
		.filter((phong: any) => selectedPhongIds.includes(phong.ma))
		.map((phong: any) => phong._id);

	useEffect(() => {
		if (visibleForm) {
			getAllPhong();
			getAllToaNha();
			getAllKhoaSinhVien(undefined, { namHocBatDau: -1 });
			setCurrentStep(0);
		}
	}, [visibleForm]);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	useEffect(() => {
		const nextRows = selectedKhoaNganh.map((ma) => {
			const khoaSv = allKhoaSinhVien.find((item) => item.ma === ma);
			return {
				ma,
				maKhoaSinhVien: ma,
				khoaSinhVien: khoaSv,
			};
		});
		setSelectedKhoaRows(nextRows);
	}, [selectedKhoaNganh, allKhoaSinhVien]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedToaNhaIds([]);
			setSelectedPhongIds([]);
			setSelectedKhoaNganh([]);
			setSelectedKhoaRows([]);
			setKhoaToaConfig({});
			return;
		}

		if (record?._id) {
			const initialLoaiDot = record?.loaiDot ?? (record?.cauHinhKhoaToa?.length ? 'Theo khoa' : 'Theo danh sách');
			const danhSachToaNha = record?.danhSachToaNha ?? [];
			const danhSachPhong = record?.danhSachPhong ?? [];
			const cauHinh = record?.cauHinhKhoaToa ?? [];
			const khoaNganh = cauHinh.length ? cauHinh.map((item) => item.maKhoaSinhVien) : (record?.maKhoaNganh ?? []);
			const nextKhoaToaConfig = cauHinh.reduce<Record<string, string[]>>((accumulator, item) => {
				accumulator[item.maKhoaSinhVien] = item.danhSachToaNha ?? [];
				return accumulator;
			}, {});

			form.setFieldsValue({
				...record,
				loaiDot: initialLoaiDot,
				maKhoaNganh: record?.maKhoaNganh ?? [],
				danhSachToaNha,
				hanDuyetMien: record?.hanDuyetMien ?? null,
			});
			setSelectedKhoaNganh(khoaNganh);
			setSelectedKhoaRows(cauHinh as any);
			setKhoaToaConfig(nextKhoaToaConfig);
			setSelectedToaNhaIds(danhSachToaNha);
			setSelectedPhongIds(danhSachPhong);
		} else {
			form.setFieldsValue({
				loaiDot: 'Theo khoa',
				maKhoaNganh: [],
				danhSachToaNha: [],
				hanDuyetMien: null,
			});
			setSelectedToaNhaIds([]);
			setSelectedPhongIds([]);
			setSelectedKhoaNganh([]);
			setSelectedKhoaRows([]);
			setKhoaToaConfig({});
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		setKhoaToaConfig((currentValue) => {
			const nextValue = selectedKhoaNganh.reduce<Record<string, string[]>>((accumulator, maKhoaSinhVien) => {
				accumulator[maKhoaSinhVien] = currentValue[maKhoaSinhVien] ?? [];
				return accumulator;
			}, {});
			return JSON.stringify(nextValue) === JSON.stringify(currentValue) ? currentValue : nextValue;
		});
	}, [selectedKhoaNganh]);

	useEffect(() => {
		if (!visibleForm) return;
		if (!allPhong || allPhong.length === 0) return;

		setSelectedPhongIds((prev) => {
			const filtered = prev.filter((phongMa) => {
				const phong = allPhong.find((p: any) => p.ma === phongMa);
				if (!phong) return true;
				const maToaNha = phong.maToaNha ?? phong.toaNha?.ma;
				return maToaNha && selectedToaNhaIds.includes(maToaNha);
			});
			if (JSON.stringify(filtered) === JSON.stringify(prev)) return prev;
			return filtered;
		});
	}, [selectedToaNhaIds, allPhong, visibleForm]);

	const handleNextStep = async () => {
		try {
			const fieldsToValidate = [
				'tenDot',
				'maHocKy',
				'ngayChuyenVao',
				'ngayChuyenRa',
				'thoiGianBatDau',
				'thoiGianKetThuc',
				'loaiDot',
				'hanDuyetMien',
				'ghiChu',
			];
			const values = await form.validateFields(fieldsToValidate);

			if (dayjs(values.ngayChuyenRa).isBefore(dayjs(values.ngayChuyenVao))) {
				message.error('Ngày chuyển ra phải sau ngày chuyển vào');
				return;
			}

			if (values.hanDuyetMien && dayjs(values.hanDuyetMien).isAfter(dayjs(values.ngayChuyenRa))) {
				message.error('Hạn duyệt miễn phải trước ngày chuyển ra');
				return;
			}

			setCurrentStep(1);
		} catch (error) {
			console.log('Validation failed:', error);
		}
	};

	const onFinish = async (values: KyTucXa.IDotDangKyKTX) => {
		if (dayjs(values.ngayChuyenRa).isBefore(dayjs(values.ngayChuyenVao))) {
			message.error('Ngày chuyển ra phải sau ngày chuyển vào');
			return;
		}

		if (values.hanDuyetMien && dayjs(values.hanDuyetMien).isAfter(dayjs(values.ngayChuyenRa))) {
			message.error('Hạn duyệt miễn phải trước ngày chuyển ra');
			return;
		}

		if (loaiDot === 'Theo khoa') {
			if (!selectedKhoaNganh.length) {
				message.error('Vui lòng chọn ít nhất 1 khóa sinh viên');
				return;
			}
			if (selectedKhoaRows.some((row) => !(khoaToaConfig[row.maKhoaSinhVien ?? row.ma]?.length ?? 0))) {
				message.error('Mỗi khóa sinh viên phải có ít nhất 1 tòa nhà');
				return;
			}
		}

		if (loaiDot === 'Theo danh sách') {
			if (!selectedToaNhaIds.length) {
				message.error('Vui lòng chọn ít nhất 1 tòa nhà');
				return;
			}
			if (!selectedPhongIds.length) {
				message.error('Vui lòng chọn ít nhất 1 phòng');
				return;
			}
		}

		const { danhSachToaNha, danhSach, ...restValues } = values as any;
		const payload: Partial<KyTucXa.IDotDangKyKTX> = {
			...restValues,
			loaiDot,
			ngayChuyenVao: values?.ngayChuyenVao ? dayjs(values.ngayChuyenVao).toISOString() : undefined,
			ngayChuyenRa: values?.ngayChuyenRa ? dayjs(values.ngayChuyenRa).toISOString() : undefined,
			maKhoaNganh: values?.maKhoaNganh ?? [],
			cauHinhKhoaToa:
				loaiDot === 'Theo khoa'
					? selectedKhoaRows.map((row) => ({
						maKhoaSinhVien: row.maKhoaSinhVien ?? row.ma,
						danhSachToaNha: khoaToaConfig[row.maKhoaSinhVien ?? row.ma] ?? [],
					}))
					: [],
			hanDuyetMien: values?.hanDuyetMien ? dayjs(values.hanDuyetMien).toISOString() : null,
			danhSachToaNha: selectedToaNhaIds,
			danhSachPhong: selectedPhongIds,
		};

		if (edit) {
			const dotId = record?._id ?? '';
			await putModel(dotId, payload).catch((er) => console.log(er));
			if (danhSach?.length) {
				await postSinhVienDangKy?.(dotId, danhSach).catch((er) => console.log(er));
			}
		} else {
			const res = await postModel(payload).catch((er) => console.log(er));
			const newDotId = res?._id;
			if (newDotId && danhSach?.length) {
				await postSinhVienDangKy?.(newDotId, danhSach).catch((er) => console.log(er));
			}
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt đăng ký ký túc xá`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Steps
					current={currentStep}
					style={{ marginBottom: 18, paddingTop: 0 }}
					onChange={record?._id ? (step) => setCurrentStep(step) : undefined}
					type='navigation'
				>
					<Steps.Step title="Thông tin đợt" />
					<Steps.Step title="Chọn đối tượng" disabled={!record?._id} />
				</Steps>

				<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item name='tenDot' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập tên đợt' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
								<SelectHocKy selectMa />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='ngayChuyenVao' label='Ngày chuyển vào' rules={[...rules.required]}>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='ngayChuyenRa' label='Ngày chuyển ra' rules={[...rules.required]}>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='thoiGianKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='loaiDot' label='Loại đợt' rules={[...rules.required]}>
								<Select
									options={[
										{ label: 'Theo khoa', value: 'Theo khoa' },
										{ label: 'Theo danh sách', value: 'Theo danh sách' },
									]}
									placeholder='Chọn loại đợt'
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='hanDuyetMien' label='Hạn duyệt miễn'>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' allowClear />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(2000)]}>
								<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
							</Form.Item>
						</Col>
					</Row>
				</div>

				<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
					<Row gutter={[12, 0]}>
						{loaiDot === 'Theo khoa' ? (
							<Col xs={24}>
								<Form.Item name='maKhoaNganh' label='Khóa sinh viên áp dụng' rules={[...rules.required]}>
									<SelectKhoaSinhVien
										multiple
										selectMa
										allowClear
										placeholder='Chọn khóa sinh viên'
										onChange={(value) => {
											const nextValue = Array.isArray(value) ? (value as string[]) : [];
											setSelectedKhoaNganh(nextValue);
											form.setFieldValue('maKhoaNganh', nextValue);
										}}
									/>
								</Form.Item>
								{selectedKhoaRows.length > 0 && (
									<KhoaToaConfigTable
										selectedKhoaNganh={selectedKhoaRows}
										value={khoaToaConfig}
										onChange={(nextValue) => setKhoaToaConfig(nextValue)}
									/>
								)}
							</Col>
						) : null}
						{loaiDot === 'Theo danh sách' ? (
							<Col xs={24} md={12}>
								<Form.Item
									name='danhSachToaNha'
									label='Tòa nhà'
									rules={[...rules.required]}
								>
									<SelectToaNha
										multiple
										selectMa
										allowClear
										onChange={(ids) => {
											const nextValue = Array.isArray(ids) ? ids : ids ? [ids] : [];
											setSelectedToaNhaIds(nextValue);
											form.setFieldValue('danhSachToaNha', nextValue);
										}}
									/>
								</Form.Item>
							</Col>
						) : null}
					</Row>

					{selectedToaNhaIds.length ? (
						<div style={{ marginTop: 12 }}>
							<RoomTable
								toaNhaIds={selectedToaNhaIds}
								selectedRowKeys={selectedPhongRowKeys}
								onChangeSelectedKeys={(keys) => {
									setSelectedPhongIds(
										keys
											.map((key) => allPhong.find((phong: any) => phong._id === key)?.ma)
											.filter((ma): ma is string => !!ma),
									);
								}}
							/>
						</div>
					) : null}
					{loaiDot === 'Theo danh sách' ? <SinhVienDangKySection form={form} dotId={record?._id} visible={visibleForm} /> : null}
				</div>

				<div className='form-footer'>
					{currentStep === 0 ? (
						<>
							<Button onClick={handleNextStep} type='primary'>
								Tiếp theo
							</Button>
							<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
						</>
					) : (
						<>
							<Button onClick={() => setCurrentStep(0)} style={{ marginRight: 8 }}>
								Quay lại
							</Button>
							<Button loading={formSubmiting} htmlType='submit' type='primary'>
								{!edit ? 'Thêm mới' : 'Lưu lại'}
							</Button>
						</>
					)}
				</div>
			</Form>
		</Card>
	);
};

export default FormDotDangKyKTX;
