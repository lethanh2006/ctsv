import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import {
	EChucVuThanhVienCauLacBo,
	EVaiTroThanhVienPhongBan,
	MapKeyChucVuThanhVienCLB,
	MapKeyVaiTroThanhVienPhongBanCLB,
} from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThanhVienCLB = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('caulacbo.thanhvien');
	const { record: recordCLB } = useModel('caulacbo.caulacbo');
	const { danhSach: danhSachPhongBan } = useModel('caulacbo.phongban');

	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');

	const [sinhVien, setSinhVien] = useState<{ hoTen: string; maSinhVien: string }>();

	const banBoPhanId = Form.useWatch('banBoPhanId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
			});
			setSinhVien({ hoTen: record.hoTen, maSinhVien: record.maSinhVien });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (
		values: CauLacBo.ThanhVien & { banBoPhanId: string[]; vaiTroThanhVienBanBoPhan: EVaiTroThanhVienPhongBan[] },
	) => {
		if (!recordCLB?._id) return;

		const payload: any = {
			...record,
			...values,
			cauLacBoId: recordCLB._id,
			...sinhVien,
			namHoc: new Date().getFullYear().toString(),
			chucVuThanhVienCauLacBo: values?.chucVuThanhVienCauLacBo ?? null,
			danhSachBanBoPhan:
				values?.banBoPhanId?.map((item, index) => ({
					vaiTroThanhVienBanBoPhan: values?.vaiTroThanhVienBanBoPhan?.[index] ?? null,
					banBoPhanId: item,
				})) ?? [],
			vaiTroThanhVienBanBoPhan: undefined,
			banBoPhanId: undefined,
		};

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
						<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required, ...rules.text]}>
							<SelectSinhVienDebounce
								onChange={(val) => {
									const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === val);
									setSinhVien({ hoTen: recSinhVien?.ten ?? '', maSinhVien: recSinhVien?.ma ?? '' });
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='chucVuThanhVienCauLacBo' label='Vai trò trong ban chủ nhiệm câu lạc bộ'>
							<Select
								allowClear
								placeholder='Chọn vai trò'
								options={Object.values(EChucVuThanhVienCauLacBo).map((item) => ({
									value: item,
									label: MapKeyChucVuThanhVienCLB[item],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='banBoPhanId' label='Thuộc ban/bộ phận khác?'>
							<Select
								mode='multiple'
								allowClear
								placeholder='Chọn ban/bộ phận'
								options={danhSachPhongBan.map((item) => ({
									value: item._id,
									label: item.ten,
								}))}
							/>
						</Form.Item>
					</Col>
					{banBoPhanId?.map((item: string, index: number) => (
						<Col key={item} xs={24} md={24}>
							<Form.Item
								name={['vaiTroThanhVienBanBoPhan', index]}
								label={`Vai trò trong ${danhSachPhongBan.find((ele) => ele._id === item)?.ten}`}
							>
								<Select
									allowClear
									placeholder='Chọn vai trò'
									options={Object.values(EVaiTroThanhVienPhongBan).map((ele) => ({
										value: ele,
										label: MapKeyVaiTroThanhVienPhongBanCLB[ele],
									}))}
								/>
							</Form.Item>
						</Col>
					))}
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

export default FormThanhVienCLB;
