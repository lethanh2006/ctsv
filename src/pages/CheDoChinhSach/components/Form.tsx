import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { SelectHocKy } from '@/pages/DaoTao/HocKy/SelectHocKy';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ELoaiThoiGianMienGiam } from '@/services/CheDoChinhSach/constant';
import type { CheDoChinhSach } from '@/services/CheDoChinhSach/typings';
import rules from '@/utils/rules';
import { resetFieldsForm, toISOString } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormCheDoChinhSach = () => {
	const [form] = Form.useForm();

	const loaiCheDoChinhSach = Form.useWatch('loaiCheDoChinhSach', form);
	const loaiThoiGianMienGiam = Form.useWatch('loaiThoiGianMienGiam', form);
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		visibleForm,
		danhMucLoaiCheDoChinhSach,
		danhMucDoiTuongMienGiam,
		danhMucMucMienGiam,
		getDanhMucDoiTuongMienGiamModel,
		getDanhMucMucMienGiamModel,
		setDanhMucDoiTuongMienGiam,
	} = useModel('chedochinhsach.chedochinhsach');

	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachHocKy } = useModel('daotao.hocky');

	const [sinhVien, setSinhVien] = useState<{
		hoTen: string;
		maDinhDanh: string;
		lop: string;
		ngaySinh: string;
		danToc: string;
		hoKhauThuongTru: string;
	}>();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				thoiGian: [moment(record?.thoiGianMienGiamBatDau), moment(record?.thoiGianMienGiamKetThuc)],
			});
			setSinhVien(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: CheDoChinhSach.IRecord & { thoiGian: string[] }) => {
		const payload = {
			...record,
			...sinhVien,
			...values,
			tenHocKyMienGiam: danhSachHocKy?.find((item) => item.ma === values?.maHocKyMienGiam)?.ten,
			thoiGian: undefined,
			thoiGianMienGiamBatDau: values?.thoiGian ? toISOString(values?.thoiGian?.[0]) : undefined,
			thoiGianMienGiamKetThuc: values?.thoiGian ? toISOString(values?.thoiGian?.[1]) : undefined,
		};

		debugger;

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item name='ssoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce
								onChange={(val) => {
									const sinhVienTemp = danhSachSinhVien.find((item) => item.ssoId === val);
									setSinhVien({
										hoTen: sinhVienTemp?.ten ?? '',
										maDinhDanh: sinhVienTemp?.ma ?? 'Không có dữ liệu',
										lop: sinhVienTemp?.lopHanhChinhList?.[0]?.ten ?? 'Không có dữ liệu',
										ngaySinh: sinhVienTemp?.ngaySinh ?? 'Không có dữ liệu',
										danToc: sinhVienTemp?.danToc ?? 'Không có dữ liệu',
										hoKhauThuongTru:
											[
												sinhVienTemp?.tinhTpThuongTru,
												sinhVienTemp?.quanHuyenThuongTru,
												sinhVienTemp?.xaPhuongThuongTru,
												sinhVienTemp?.soNhaTenDuongThuongTru,
											]
												.filter((item) => item)
												.join(', ') || 'Không có dữ liệu',
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='loaiCheDoChinhSach' label='Chế độ, chính sách' rules={[...rules.required]}>
							<Select
								placeholder='Chế độ, chính sách'
								onChange={(val) => {
									if (val) {
										getDanhMucMucMienGiamModel(val);
										setDanhMucDoiTuongMienGiam([]);
									}
									form.setFieldsValue({
										doiTuongMienGiam: undefined,
										mucMienGiam: undefined,
									});
								}}
								options={danhMucLoaiCheDoChinhSach.map((item) => ({ value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='mucMienGiam' label='Mức miễn giảm' rules={[...rules.required]}>
							<Select
								onChange={(val) => {
									if (val)
										getDanhMucDoiTuongMienGiamModel(loaiCheDoChinhSach?.replace('%', '%25'), val?.replace('%', '%25'));
									form.setFieldsValue({
										doiTuongMienGiam: undefined,
									});
								}}
								placeholder='Mức miễn giảm'
								options={danhMucMucMienGiam.map((item) => ({ value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='doiTuongMienGiam' label='Đối tượng miễn giảm' rules={[...rules.required]}>
							<Select
								placeholder='Đối tượng miễn giảm'
								options={danhMucDoiTuongMienGiam.map((item) => ({ value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='loaiThoiGianMienGiam' label='Thời gian miễn giảm' rules={[...rules.required]}>
							<Select
								placeholder='Thời gian miễn giảm'
								options={Object.values(ELoaiThoiGianMienGiam).map((item) => ({ value: item, label: item }))}
							/>
						</Form.Item>
					</Col>

					{loaiThoiGianMienGiam === ELoaiThoiGianMienGiam.HOC_KY && (
						<Col xs={24} md={24}>
							<Form.Item name='maHocKyMienGiam' label='Học kỳ áp dụng' rules={[...rules.required]}>
								<SelectHocKy selectMa style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
					)}
					{loaiThoiGianMienGiam === ELoaiThoiGianMienGiam.THOI_GIAN && (
						<Col xs={24} md={24}>
							<Form.Item name='thoiGian' label='Thời gian áp dụng' rules={[...rules.required]}>
								<MyDateRangePicker />
							</Form.Item>
						</Col>
					)}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCheDoChinhSach;
