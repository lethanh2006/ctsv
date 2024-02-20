import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useModel } from 'umi';

const FormImport = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { record, importCheDoSinhVienModel, setVisibleImport, loading, formSubmiting } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	return (
		<Form
			scrollToFirstError
			form={form}
			onFinish={async (values) => {
				if (record?._id) importCheDoSinhVienModel(record?._id, values, props.getData);
				return;
			}}
		>
			<Form.Item rules={[...rules.required]} name='file' label='File dữ liệu'>
				<UploadFile maxCount={1} accept='.xlsx' />
			</Form.Item>

			<div className='form-footer'>
				<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
					{'Lưu lại'}
				</Button>
				<Button icon={<CloseOutlined />} onClick={() => setVisibleImport(false)}>
					Hủy
				</Button>
			</div>
		</Form>
	);
};

export default FormImport;
