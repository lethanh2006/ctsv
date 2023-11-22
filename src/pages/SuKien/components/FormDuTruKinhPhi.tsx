import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';

interface Props {
	hideCard?: boolean;
	setData: any;
	setVisibleForm: any;
}

const FormDuTruKinhPhi = ({ hideCard, setData, setVisibleForm }: Props) => {
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		setData([{ ...values, duToan: values.soLuong * values.luot * values.dinhMuc }]);
		setVisibleForm(false);
	};

	const renderContent = () => {
		return (
			<>
				<Form id='FormDuTruKinhPhi' form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='noiDung'
								label='Nội dung'
							>
								<Input.TextArea placeholder='Nội dung' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='donViTinh'
								label='Đơn vị tính'
							>
								<Input placeholder='Đơn vị tính' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='soLuong' label='Số lượng'>
								<InputNumber style={{ width: '100%' }} min={1} placeholder='Số lượng' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='luot' label='Lượt'>
								<InputNumber style={{ width: '100%' }} min={1} placeholder='Lượt' />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item rules={[...rules.required]} name='dinhMuc' label='Định mức'>
								<InputNumber style={{ width: '100%' }} min={1} placeholder='Định mức' />
							</Form.Item>
						</Col>

						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='phanBoNguon' label='Phân bổ nguồn'>
								<Select
									placeholder='Phân bổ nguồn'
									options={[
										{ value: 'NSNN', label: 'Ngân sách nhà nước' },
										{ value: 'Tự chủ', label: 'Tự chủ' },
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='tienDoHoanThanh'
								label='Tiến độ hoàn thành'
							>
								<Input.TextArea placeholder='Tiến độ hoàn thành' />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='chungTuYeuCau'
								label='Chứng từ yêu cầu'
							>
								<Input.TextArea placeholder='Chứng từ yêu cầu' />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className='form-footer'>
					<Button form='FormDuTruKinhPhi' loading={false} htmlType='submit' type='primary'>
						{'Lưu lại'}
					</Button>

					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</>
		);
	};

	if (hideCard) {
		return <div>{renderContent()}</div>;
	}

	return <Card title={'Thêm mới'}>{renderContent()}</Card>;
};

export default FormDuTruKinhPhi;
