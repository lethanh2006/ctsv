import MyDatePicker from '@/components/MyDatePicker';
import FormItemKhoaNganh from '@/pages/DaoTaoV2/KhoaNganhDotDangKy/FormItemKhoaNganh';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import KhoaToaConfigTable from '@/pages/KyTucXa/DotDangKy/components/KhoaToaConfigTable';
import RoomTable from '@/pages/KyTucXa/DotDangKy/components/RoomTable';
import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import SinhVienDangKySection from '@/pages/KyTucXa/DotDangKy/components/SinhVienDangKySection';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDotDangKyKTX = () => {
	const [form] = Form.useForm();
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('kytucxa.dotdangky');
	const loaiDot = Form.useWatch('loaiDot', form) ?? 'Theo khoa';
	const [selectedToaNhaIds, setSelectedToaNhaIds] = useState<string[]>([]);
	const [selectedPhongIds, setSelectedPhongIds] = useState<string[]>([]);
	const [selectedKhoaNganh, setSelectedKhoaNganh] = useState<string[]>([]);
	const [selectedKhoaRows, setSelectedKhoaRows] = useState<KhoaNganh.IRecord[]>([] as KhoaNganh.IRecord[]);
	const [khoaToaConfig, setKhoaToaConfig] = useState<Record<string, string[]>>({});

	const { danhSach: allPhong, getAllModel: getAllPhong } = useModel('theodoitaisanvattu.phong');

	const { getAllModel: getAllToaNha } = useModel('theodoitaisanvattu.toanha');

	const selectedPhongRowKeys = allPhong
		.filter((phong: any) => selectedPhongIds.includes(phong.ma))
		.map((phong: any) => phong._id);

	useEffect(() => {
		if (visibleForm) {
			getAllPhong();
			getAllToaNha();
		}
	}, [visibleForm]);

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

	const onFinish = async (values: KyTucXa.IDotDangKyKTX) => {
		if (dayjs(values.thoiGianKetThuc).isBefore(dayjs(values.thoiGianBatDau))) {
			message.error('Thời gian kết thúc phải sau thời gian bắt đầu');
			return;
		}

		if (values.hanDuyetMien && dayjs(values.hanDuyetMien).isAfter(dayjs(values.thoiGianKetThuc))) {
			message.error('Hạn duyệt miễn phải trước thời gian kết thúc');
			return;
		}

		if (loaiDot === 'Theo khoa') {
			if (!selectedKhoaNganh.length) {
				message.error('Vui lòng chọn ít nhất 1 khóa ngành');
				return;
			}
			if (selectedKhoaRows.some((row) => !(khoaToaConfig[row.maKhoaSinhVien ?? row.ma]?.length ?? 0))) {
				message.error('Mỗi khóa ngành phải có ít nhất 1 tòa nhà');
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

		const { danhSachToaNha, ...restValues } = values as KyTucXa.IDotDangKyKTX;
		const payload: Partial<KyTucXa.IDotDangKyKTX> = {
			...restValues,
			loaiDot,
			maKhoaNganh: values?.maKhoaNganh ?? [],
			cauHinhKhoaToa:
				loaiDot === 'Theo khoa'
					? selectedKhoaRows.map((row) => ({
							maKhoaSinhVien: row.maKhoaSinhVien ?? row.ma,
							danhSachToaNha: khoaToaConfig[row.maKhoaSinhVien ?? row.ma] ?? [],
						}))
					: [],
			hanDuyetMien: values?.hanDuyetMien ?? null,
			danhSachToaNha: selectedToaNhaIds,
			danhSachPhong: selectedPhongIds,
		};

		if (edit) {
			await putModel(record?._id ?? '', payload).catch((er) => console.log(er));
		} else {
			await postModel(payload).catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt đăng ký ký túc xá`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
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
						<Form.Item name='loaiDot' label='Loại đợt' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ label: 'Theo khoa', value: 'Theo khoa' },
									{ label: 'Theo danh sách', value: 'Theo danh sách' },
								]}
							/>
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
						<Form.Item name='hanDuyetMien' label='Hạn duyệt miễn'>
							<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' allowClear />
						</Form.Item>
					</Col>
					{loaiDot === 'Theo khoa' ? (
						<Col xs={24}>
							<Form.Item name='maKhoaNganh' label='Khóa ngành áp dụng' rules={[...rules.required]}>
								<FormItemKhoaNganh
									showTrinhDo={false}
									showHinhThuc={false}
									onChange={(value) => {
										const nextValue = Array.isArray(value) ? value : [];
										setSelectedKhoaNganh(nextValue);
										form.setFieldValue('maKhoaNganh', nextValue);
									}}
									onChangeRows={(rows) => setSelectedKhoaRows(rows)}
								/>
							</Form.Item>
							<KhoaToaConfigTable
								selectedKhoaNganh={selectedKhoaRows}
								value={khoaToaConfig}
								onChange={(nextValue) => setKhoaToaConfig(nextValue)}
							/>
						</Col>
					) : null}
					<Col xs={24} md={12}>
						<Form.Item
							name='danhSachToaNha'
							label='Tòa nhà'
							rules={loaiDot === 'Theo danh sách' ? [...rules.required] : []}
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
				{loaiDot === 'Theo danh sách' ? <SinhVienDangKySection dotId={record?._id} visible={visibleForm} /> : null}
				<Col xs={24}>
					<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(2000)]}>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Col>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDotDangKyKTX;
