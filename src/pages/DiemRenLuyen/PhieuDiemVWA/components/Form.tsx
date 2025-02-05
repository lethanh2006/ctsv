import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { ETrangThaiChamDiem, MapKeyNameTrangThaiChamDiem } from '@/services/DiemRenLuyen/constants';
import SelectDotDiemRenLuyen from '../../Dot/Select';

const FormPhieuDiem = (props: { ssoId?: string }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('diemrenluyen.phieudiem');
	const trangThai = Form.useWatch('trangThai', form);
	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (record?._id)
			form.setFieldsValue({
				...record,
				ssoId: record?.thongTinNguoiTao?.ssoId,
			});
		else form.resetFields();
		if (props.ssoId) {
			form.setFieldsValue({ ssoId: props?.ssoId });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.ssoId);
		const payload = {
			...record,
			...values,
			thongTinNguoiTao: {
				...(record?.thongTinNguoiTao ?? {}),
				...recSinhVien,
			},
		};

		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'kết quả rèn luyện'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col md={12}>
						<Form.Item name='dotDrlId' label='Học kỳ' rules={[...rules.required]}>
							<SelectDotDiemRenLuyen placeHolder='Học kỳ' />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item name='ssoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]}>
							<Select
								placeholder='Trạng thái'
								options={Object.values(ETrangThaiChamDiem).map((item) => ({
									value: item,
									label: MapKeyNameTrangThaiChamDiem[item],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name='diemSo'
							label='Điểm rèn luyện'
							rules={trangThai === ETrangThaiChamDiem.KHONG_THAM_GIA ? undefined : [...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập điểm' addonAfter='Điểm' min={0} max={100} />
						</Form.Item>
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

export default FormPhieuDiem;
