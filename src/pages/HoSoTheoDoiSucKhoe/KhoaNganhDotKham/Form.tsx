import SelectKhoaNganh from '@/pages/DaoTao/KhoaNganh/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhoaNganhDotKham = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, getModel, formSubmiting, postManyKhoaNganhModel, visibleForm } = useModel(
		'khaibaosuckhoe.suckhoekhoanganh',
	);
	const { record: recDotKhaiBao } = useModel('khaibaosuckhoe.dotkhaibaosuckhoe');
	const { danhSach: danhSachKhaoNganh } = useModel('daotao.khoanganh');
	const { title } = props;

	const getData = () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const danhSachKhoaNganh = values.maKhoaNganh?.map((item: any) => ({
			maKhoaNganh: item,
			dotKhamSucKhoeId: '',
			tenKhoaNganh: danhSachKhaoNganh.find((items) => items?.ma === item)?.ten,
			maKhoaSinhVien: danhSachKhaoNganh.find((items) => items?.ma === item)?.maKhoaSinhVien,
			maNganh: danhSachKhaoNganh.find((items) => items?.ma === item)?.maNganh,
		}));
		postManyKhoaNganhModel(recDotKhaiBao?._id ?? '', { danhSachKhoaNganh: danhSachKhoaNganh })
			.then(() => getData())
			.catch((err) => console.log(err));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Đợt đăng ký học phần'>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maKhoaNganh' label='Khóa ngành' rules={[...rules.required]}>
							<SelectKhoaNganh multiple selectMa />
						</Form.Item>
					</Col>
				</Row>

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

export default FormKhoaNganhDotKham;
