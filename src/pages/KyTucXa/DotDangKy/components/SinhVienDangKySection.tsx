import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { resetFieldsForm } from '@/utils/utils';
import { ImportOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, message, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SinhVienDangKySection = (props: { dotId?: string; visible?: boolean }) => {
	const { dotId, visible } = props;
	const [form] = Form.useForm();
	const { postSinhVienDangKy, getByIdModel, formSubmiting, setFormSubmiting } = useModel('kytucxa.dotdangkyktx');

	useEffect(() => {
		if (visible) {
			resetFieldsForm(form);
			setSelectedUsers([]);
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		setFormSubmiting?.(true);
		try {
			if (!dotId) {
				message.error('Thiếu id đợt đăng ký');
				return;
			}

			if (!postSinhVienDangKy) {
				message.error('Chưa có service postSinhVienDangKy');
				return;
			}

			const list = Array.isArray(values.danhSach) ? values.danhSach : [];

			if (!list.length) {
				message.error('Vui lòng chọn ít nhất 1 sinh viên');
				return;
			}

			await postSinhVienDangKy(dotId, list);
			message.success('Thêm sinh viên đăng ký thành công');

			// refresh parent record if possible
			if (getByIdModel) {
				try {
					await getByIdModel(dotId, true);
				} catch (er) {
					// ignore
				}
			}

			form.resetFields();
			setSelectedUsers([]);
		} catch (er) {
			console.error(er);
			message.error('Lỗi khi thêm sinh viên đăng ký');
		} finally {
			setFormSubmiting?.(false);
		}
	};

	const [visibleSelect, setVisibleSelect] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

	return (
		<Card title={'Danh sách sinh viên đăng ký KTX'} className='form-card' style={{ marginTop: 12 }}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='danhSach' hidden>
					<div />
				</Form.Item>
				<Row gutter={16} align='middle' style={{ marginBottom: 16 }}>
					<Col span={24}>
						<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
							<Button type='primary' icon={<ImportOutlined />} onClick={() => setVisibleSelect(true)}>
								Nhập danh sách sinh viên
							</Button>
							{selectedUsers.length > 0 && (
								<span style={{ color: '#52c41a', fontWeight: 'bold' }}>
									Đã chọn {selectedUsers.length} sinh viên
								</span>
							)}
						</div>
					</Col>
				</Row>

				<Modal
					open={visibleSelect}
					onCancel={() => setVisibleSelect(false)}
					title={'Chọn/nhập danh sách sinh viên'}
					width={900}
					footer={null}
					destroyOnClose
				>
					<TableSelectUser
						type={EVaiTroKhaoSat.SINH_VIEN}
						selectedUsers={selectedUsers}
						setSelectedUsers={(val: any) => setSelectedUsers(val)}
					/>
					<div style={{ textAlign: 'right', marginTop: 12 }}>
						<Button
							onClick={() => {
								const codes = (selectedUsers ?? []).map((u: any) => u.code).filter(Boolean);
								form.setFieldsValue({ danhSach: codes });
								setVisibleSelect(false);
							}}
							type='primary'
						>
							Chọn xong
						</Button>
					</div>
				</Modal>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Thêm
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default SinhVienDangKySection;
