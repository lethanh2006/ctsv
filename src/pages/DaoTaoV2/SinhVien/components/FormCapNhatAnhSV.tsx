import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row } from 'antd';
import { useModel } from 'umi';

const FormCapNhatAnhSV = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { setvisibleFormCapNhatAnh, loading, uploadAnhTheSinhVienModel } = useModel('daotaov2.sinhvien.sinhvien');
	const onFinish = async (values: any) => {
		uploadAnhTheSinhVienModel(
			{
				file: values?.file?.fileList?.[0]?.originFileObj,
			},
			props.getData,
		);
	};

	return (
		<Card title={'Cập nhật ảnh thẻ SV'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item
							extra={
								<div>
									<b>Lưu ý: </b>Tải lên file zip, mỗi file ảnh sinh viên có dạng: <i>mã sinh viên.jpg/jpeg/png</i>
								</div>
							}
							name='file'
							label='File ảnh sinh viên'
							rules={[...rules.fileRequired]}
						>
							<UploadFile maxSize={25} accept='.zip' maxCount={1} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{'Lưu'}
					</Button>
					<Button onClick={() => setvisibleFormCapNhatAnh(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCapNhatAnhSV;
