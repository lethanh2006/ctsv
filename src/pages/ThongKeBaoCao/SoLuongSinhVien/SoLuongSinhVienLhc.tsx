import FormWaiting from '@/components/Loading/FormWaiting';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import rules from '@/utils/rules';
import { Button, Col, Divider, Form, Modal, Row } from 'antd';
import {  useModel } from 'umi';

const SoLuongSinhVienLhc = () => {
	const { record: recTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const { record: recHinhThuc } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const { loading, reportSoLuongSinhVienLhcModel } = useModel('daotaov2.sinhvien.baocao');
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		if (values.maHocKy) {
			FormWaiting('Đang tính toán dữ liệu');
			reportSoLuongSinhVienLhcModel({ ...values, maTrinhDo: recTrinhDo?.ma, maHinhThuc: recHinhThuc?.ma })
				.then()
				.catch((er: any) => console.log(er))
				.finally(() => Modal.destroyAll());
		}
	};

	return (
		<>
			<Divider>Theo lớp hành chính</Divider>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6} xxl={4}>
						<Form.Item name='maHocKy' label='Kỳ học cần thống kê' rules={[...rules.required]}>
							<SelectHocKy style={{width:400}} selectMa />
						</Form.Item>
					</Col>
				</Row>

				<Button loading={loading} htmlType='submit' type='primary'>
					Xác nhận
				</Button>
			</Form>
		</>
	);
};

export default SoLuongSinhVienLhc;
