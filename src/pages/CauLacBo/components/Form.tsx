import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauLacBo = () => {
	const [form] = Form.useForm();

	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('caulacbo.caulacbo');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: CauLacBo.IRecord) => {
		const noiQuyQuyChe = await buildUpLoadFile(values, 'noiQuyQuyChe');
		const logo = await buildUpLoadFile(values, 'logo');
		const quyetDinhThanhLap = await buildUpLoadFile(values, 'quyetDinhThanhLap');
		const payload = {
			...record,
			...values,
			noiQuyQuyChe,
			quyetDinhThanhLap,
			logo,
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
						<Form.Item name='ten' label='Tên câu lạc bộ' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên câu lạc bộ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='logo' label='Logo' rules={[...rules.fileRequired]}>
							<UploadFile accept='.png, .jpeg, .jpg' isAvatarSmall maxCount={1} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='slogan' label='Khẩu hiệu' rules={[...rules.text]}>
							<Input.TextArea placeholder='Khẩu hiệu' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='mucDich' label='Mục đích' rules={[...rules.required]}>
							<TinyEditor height={350} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='yNghia' label='Ý nghĩa' rules={[...rules.required]}>
							<TinyEditor height={350} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='donViQuanLy' label='Đơn vị quản lý' rules={[...rules.required]}>
							<SelectDonVi />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='noiQuyQuyChe' label='Nội quy, quy chế' rules={[...rules.fileRequired]}>
							<UploadFile accept='.pdf, .docx, .doc' maxCount={1} />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='quyetDinhThanhLap' label='Quyết định thành lập' rules={[...rules.fileRequired]}>
							<UploadFile accept='.pdf, .docx, .doc' maxCount={1} />
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
		</Card>
	);
};

export default FormCauLacBo;
