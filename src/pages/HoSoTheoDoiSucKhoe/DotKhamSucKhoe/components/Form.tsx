import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDotKhamSucKhoe = (props: { afterAddNew?: (rec: any) => void }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
	} = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { record: recHocKy } = useModel('hocky.hocky');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const { afterAddNew } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const resetFields = () => {
		resetFieldsForm(form);
	};

	useEffect(() => {
		if (!visibleForm) resetFields();
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = { ...values, maHocKy: recHocKy?.ma, tenHocKy: recHocKy?.ten };
		if (edit) {
			putModel(record?._id ?? '', data, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item label='Kỳ học'>
						<Input disabled value={recHocKy?.ten} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên đợt đăng ký'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên đợt đăng ký' />
					</Form.Item>
				</Col>

				<Col xs={24} md={12}>
					<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<MyDatePicker
							onChange={(val) => {
								form.validateFields(['thoiGianKetThuc']);
							}}
							format='DD/MM/YYYY'
							showTime
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianKetThuc'
						label='Thời gian kết thúc'
						rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
					>
						<MyDatePicker format='DD/MM/YYYY' showTime disabledDate={(cur) => moment(cur).isBefore(thoiGianBatDau)} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới' : 'Chỉnh sửa'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormDotKhamSucKhoe;
