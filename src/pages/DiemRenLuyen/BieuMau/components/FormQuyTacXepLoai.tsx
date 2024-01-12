import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';
import { EXepLoai, MapKeyNameXepLoai } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormQuyTacXepLoai = (props: { onCancel: any; edit: boolean; setEdit: any }) => {
	const [form] = Form.useForm();
	const { record, setRecordQuyTacXepLoai, formSubmiting, setRecord, recordQuyTacXepLoai } =
		useModel('diemrenluyen.bieumau');
	const { edit } = props;
	useEffect(() => {
		form.setFieldsValue(recordQuyTacXepLoai?.xepLoai && props.edit ? recordQuyTacXepLoai : form);
	}, [recordQuyTacXepLoai?.xepLoai]);

	const onFinish = async (values: MauDiemRenLuyen.QuyTacXepLoai, isContinue: boolean) => {
		if (!record) return;
		await form.validateFields();
		const payload = {
			...recordQuyTacXepLoai,
			...values,
		};
		if (edit && recordQuyTacXepLoai) {
			const index = record.danhSachQuyTacXepLoai.map((item) => item.xepLoai).indexOf(recordQuyTacXepLoai.xepLoai);
			const danhSachQuyTacXepLoai = [...record.danhSachQuyTacXepLoai];
			danhSachQuyTacXepLoai.splice(index, 1, payload);
			setRecord({ ...record, danhSachQuyTacXepLoai });
		} else {
			setRecord({
				...record,
				danhSachQuyTacXepLoai: [...(record?.danhSachQuyTacXepLoai ?? []), payload],
			});
		}
		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		if (isContinue) {
			form.resetFields();
			form.setFieldsValue(form);
			setRecordQuyTacXepLoai(undefined);
			props.setEdit(false);
		} else props.onCancel();
	};

	const canDuoi = Form.useWatch('canDuoi', form) || 0;

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'quy tắc xếp loại'}>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='xepLoai' label='Xếp loại' rules={[...rules.required]}>
							<Select
								placeholder='Xếp loại'
								options={Object.values(EXepLoai).map((item) => ({ value: item, label: MapKeyNameXepLoai[item] }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='canDuoi' label='Thang điểm từ' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} min={0} max={1000} placeholder='Thang điểm từ' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='canTren' label='đến' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} min={canDuoi + 1} placeholder='đến' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					{!edit && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							Thêm mới và tiếp tục
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormQuyTacXepLoai;
