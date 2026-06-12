import MyDatePicker from '@/components/MyDatePicker';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHocKy = () => {
	const [form] = Form.useForm();
	const { record, visibleForm, edit, setVisibleForm, putModel, postModel, formSubmiting, setFormSubmiting } =
		useModel('kytucxa.danhsachmienkytucxa');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				hanhNopMinhChung: record?.hanhNopMinhChung ? dayjs(record.hanhNopMinhChung) : undefined,
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			setFormSubmiting?.(true);
			const payload = { ...values };
			if (values.hanhNopMinhChung) payload.hanhNopMinhChung = (values.hanhNopMinhChung as dayjs.Dayjs).toISOString();

			if (edit) {
				await putModel(record?._id ?? '', payload);
				message.success('Cập nhật thành công');
			} else {
				await postModel(payload);
				message.success('Tạo mới thành công');
				form.resetFields();
			}
			setVisibleForm(false);
		} catch (er) {
			console.log(er);
		} finally {
			setFormSubmiting?.(false);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt đăng ký ký túc xá`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='hanhNopMinhChung' label='Hạn nộp minh chứng' rules={[...rules.required]}>
							<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' allowClear />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(2000)]}>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary' style={{ marginRight: 8 }}>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormHocKy;
