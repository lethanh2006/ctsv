import UploadFile from '@/components/Upload/UploadFile';
import { EDonViTinh, mapDonViTinh } from '@/services/HoatDongChung/constants';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDuToanKinhPhi = (props: { onCancel: any; record?: HoatDongChung.IDuToanKinhPhi; edit: boolean }) => {
	const [form] = Form.useForm();

	const { setRecord, record } = useModel('hoatdongchung');

	const soLuong: number = useWatch('soLuong', form);
	const dinhMuc: number = useWatch('dinhMuc', form);
	const donViTinh: EDonViTinh = useWatch('donViTinh', form);

	useEffect(() => {
		form.setFieldsValue(props.edit ? props.record : form);
	}, [props.record, props.edit]);

	const onFinish = async (values: any) => {
		const tepDinhKem = await buildUpLoadMultiFile(values, 'tepDinhKem');
		const payload = {
			...values,
			tepDinhKem,
		};
		const danhSachDuToanKinhPhi = [...(record?.danhSachDuToanKinhPhi ?? [])];
		if (props.edit) danhSachDuToanKinhPhi.splice(props?.record?.index ? props.record.index - 1 : 0, 1, payload);
		else danhSachDuToanKinhPhi.push(payload);
		setRecord({
			...record,
			danhSachDuToanKinhPhi,
		} as any);
		props.onCancel();
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<>
					<Col xs={24}>
						<Form.Item name='hoatDong' label='Hoạt động' rules={[...rules.required]}>
							<Input placeholder='Nhập hoạt động' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='donViTinh' label='Đơn vị tính' rules={[...rules.required]}>
							<Select
								placeholder='Chọn đơn vị tính'
								options={Object.values(EDonViTinh).map((item) => ({
									key: item,
									value: item,
									label: mapDonViTinh[item],
								}))}
							/>
						</Form.Item>
					</Col>
					{donViTinh === EDonViTinh.KHAC ? (
						<Col xs={24}>
							<Form.Item name='donViTinhKhac' label='Đơn vị tính khác' rules={[...rules.required]}>
								<Input placeholder='Nhập đơn vị tính khác' />
							</Form.Item>
						</Col>
					) : null}
					<Col xs={24} md={12}>
						<Form.Item name='soLuong' label='Số lượng' rules={[...rules.required]}>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder='Nhập số lượng'
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='dinhMuc' label='Định mức (VNĐ)' rules={[...rules.required]}>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder='Nhập định mức'
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item label='Thành tiền (VNĐ)'>
							<Input value={soLuong && dinhMuc ? inputFormat(soLuong * dinhMuc) : 0} disabled />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item label='Tiến độ hoàn thành' name='tienDoHoanThanh'>
							<Input placeholder='Nhập tiến độ hoàn thành' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label='Chứng từ yêu cầu' name='chungTuYeuCau'>
							<Input.TextArea placeholder='Nhập chứng từ yêu cầu' rows={3} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label='Tệp đính kèm' name='tepDinhKem'>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú'>
							<Input.TextArea placeholder='Nhập ghi chú' rows={3} />
						</Form.Item>
					</Col>
				</>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{!props.edit ? 'Thêm mới ' : 'Lưu lại'}
				</Button>

				<Button onClick={() => props.onCancel()}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormDuToanKinhPhi;
