import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { useEffect } from 'react';

const FormMienKTX = (props: { dotId?: string }) => {
	const { dotId } = props;
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		putModel,
		visibleForm,
		postMienDangKy,
		getMienDangKy,
		setDanhSach,
		formSubmiting,
		setFormSubmiting,
	} = useModel('kytucxa.dotmiendangkyktx');

	useEffect(() => {
		if (visibleForm) {
			if (record?._id) form.setFieldsValue(record);
			else {
				resetFieldsForm(form);
			}
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		setFormSubmiting?.(true);
		try {
			if (edit) {
				await putModel(record?._id ?? '', values);
			} else {
				if (!dotId) {
					message.error('Thiếu id đợt đăng ký');
					return;
				}

				if (!postMienDangKy) {
					message.error('Chưa có service postMienDangKy');
					return;
				}

				await postMienDangKy(dotId, [values.maSinhVien]);
				message.success('Thêm miễn đăng ký thành công');

				if (getMienDangKy && setDanhSach) {
					const res = await getMienDangKy(dotId);
					const root = res?.data ?? res;
					const body = root?.data ?? root;
					const list = Array.isArray(body) ? body : Array.isArray(body?.result) ? body.result : [];
					setDanhSach(list);
				}

				setVisibleForm(false);
			}
		} catch (er) {
			console.error(er);
			message.error('Lỗi khi thêm miễn đăng ký');
		} finally {
			setFormSubmiting?.(false);
		}
	};

	return (
		<Card title={`${edit ? 'chỉnh sửa ' : 'thêm mới'} đợt miễn đăng ký KTX`} className='form-card'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='maSinhVien' label='Mã sinh viên'>
							<Input placeholder='Nhập mã sinh viên' />
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

export default FormMienKTX;
