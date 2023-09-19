import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectKhoaSinhVien from '../KhoaSinhVien/Select';
import SelectNganhCoSo from '../Nganh/Select';

const FormLopHanhChinh = (props: { afterAddNew?: (rec: LopHanhChinh.IRecord) => void }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, setRecord, setEdit, visibleForm } =
		useModel('daotao.lophanhchinh');
	const maKhoaSinhVien = Form.useWatch('maKhoaSinhVien', form);
	const { afterAddNew } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: LopHanhChinh.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, false)
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
					<Form.Item name='maKhoaSinhVien' label='Khóa sinh viên' rules={[...rules.required]}>
						<SelectKhoaSinhVien selectMa />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='maNganh' label='Ngành đào tạo' rules={[...rules.required]}>
						<SelectNganhCoSo selectMa hasDefault={!edit} maKhoaSinhVien={maKhoaSinhVien} />
					</Form.Item>
				</Col>

				<Col xs={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên lớp hành chính'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên lớp hành chính' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='nhanSuSsoId' label='Cán bộ phụ trách' rules={[...rules.required]}>
						<SelectNhanSuDebounce />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới ' : 'Lưu lại'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormLopHanhChinh;
