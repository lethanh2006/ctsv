import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETinhTrangSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSinhVienDotKham = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'hosotheodoisuckhoe.suckhoesinhvien',
	);
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { title } = props;

	const getData = () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotKhamSucKhoe.ISucKhoeSinhVien) => {
		const data = {
			...values,
			dotKhamSucKhoeId: recDotKhaiBao?._id ?? '',
		};
		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Đợt khám sức khỏe'>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='maSinhVien' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce keyValue='ma' disabled={edit} />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='tinhTrangSucKhoe' label='Tình trạng' rules={[...rules.required]}>
							<Select
								placeholder='Chọn tình trạng sức khỏe'
								options={Object.values(ETinhTrangSucKhoe).map((item) => ({
									key: item,
									label: item,
									value: item,
								}))}
							/>
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
		</Card>
	);
};

export default FormSinhVienDotKham;
