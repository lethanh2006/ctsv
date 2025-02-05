import { ETrangThaiDuyetBienBanHopDiemRenLuyen } from '@/services/DiemRenLuyen/BienBanHop/constant';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormYeuCauChinhSua = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { record, setVisibleFormYeuCauChinhSua, putModel, loading } = useModel('diemrenluyen.bienbanhop');

	const onFinish = async (values: any) => {
		await putModel(
			record?._id ?? '',
			{
				...record,
				...values,
				trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
			},
			props.getData,
		);
		setVisibleFormYeuCauChinhSua(false);
	};

	return (
		<Card title={`Yêu cầu chỉnh sửa biên bản họp lớp ${record?.tenLopHC}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					initialValue={record?.noiDungYeuCauChinhSua}
					name='noiDungYeuCauChinhSua'
					label='Nội dung yêu cầu chỉnh sửa'
					rules={[...rules.required, ...rules.text]}
				>
					<Input.TextArea autoFocus placeholder='Nhập nội dung' />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{'Gửi'}
					</Button>
					<Button onClick={() => setVisibleFormYeuCauChinhSua(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormYeuCauChinhSua;
