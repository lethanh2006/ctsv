import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Row, message } from 'antd';
import { useEffect } from 'react';

const FormMienKTX = (props: { dotId?: string }) => {
	const { dotId } = props;
	const [form] = Form.useForm();
	const {
		// record,
		setVisibleForm,
		// edit,
		// putModel,
		visibleForm,
		postMienDangKy,
		getMienDangKy,
		setDanhSach,
		formSubmiting,
		setFormSubmiting,
	} = useModel('kytucxa.dotmiendangkyktx');

	useEffect(() => {
		if (visibleForm) {
			resetFieldsForm(form);
		}
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		setFormSubmiting?.(true);
		try {
			if (!dotId) {
				message.error('Thiếu id đợt đăng ký');
				return;
			}

			if (!postMienDangKy) {
				message.error('Chưa có service postMienDangKy');
				return;
			}

			const list = Array.isArray(values.danhSach) ? values.danhSach : [];

			if (!list.length) {
				message.error('Vui lòng chọn ít nhất 1 sinh viên');
				return;
			}

			// gửi mảng mã sinh viên (ma)
			await postMienDangKy(dotId, list);
			message.success('Thêm miễn đăng ký thành công');

			if (getMienDangKy && setDanhSach) {
				const res = await getMienDangKy(dotId);
				const root = res?.data ?? res;
				const body = root?.data ?? root;
				const arr = Array.isArray(body) ? body : Array.isArray(body?.result) ? body.result : [];
				setDanhSach(arr);
			}

			setVisibleForm(false);
		} catch (er) {
			console.error(er);
			message.error('Lỗi khi thêm miễn đăng ký');
		} finally {
			setFormSubmiting?.(false);
		}
	};

	return (
		<Card title={'Thêm danh sách mã sinh viên miễn đăng ký KTX'} className='form-card'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item name='danhSach' label='Chọn sinh viên' help='Chọn nhiều sinh viên (tìm theo họ tên hoặc mã)'>
							<SelectSinhVienDebounce multiple selectMa />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Thêm
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormMienKTX;
