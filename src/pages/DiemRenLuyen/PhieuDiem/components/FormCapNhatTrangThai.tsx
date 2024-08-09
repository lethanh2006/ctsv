import { ETrangThaiChamDiem, MapKeyNameTrangThaiChamDiem } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormCapNhatTrangThai = (props: { onCancel: any; getData: any }) => {
	const [form] = Form.useForm();
	const { loading, doiTrangThaiPhieuDiemModel, condition } = useModel('diemrenluyen.phieudiem');
	const onFinish = async (values: any) => {
		if (!condition?.dotDrlId) return;
		await doiTrangThaiPhieuDiemModel(condition.dotDrlId, values?.trangThaiCu, values?.trangThaiMoi, props.getData);
		props.onCancel();
	};

	return (
		<Card title={'Cập nhật trạng thái kết quả rèn luyện'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col md={12}>
						<Form.Item name='trangThaiCu' label='Trạng thái cũ' rules={[...rules.required]}>
							<Select
								placeholder='Trạng thái cũ'
								options={Object.values(ETrangThaiChamDiem).map((item) => ({
									value: item,
									label: MapKeyNameTrangThaiChamDiem[item],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item name='trangThaiMoi' label='Trạng thái mới' rules={[...rules.required]}>
							<Select
								placeholder='Trạng thái mới'
								options={Object.values(ETrangThaiChamDiem).map((item) => ({
									value: item,
									label: MapKeyNameTrangThaiChamDiem[item],
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={loading} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{'Lưu lại'}
					</Button>
					<Button
						onClick={() => {
							props.onCancel();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormCapNhatTrangThai;
