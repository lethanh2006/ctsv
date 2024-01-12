import { Form, Row } from 'antd';
import { useState } from 'react';

import FormRender from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/FormRender';
import { useModel } from 'umi';

const FormGiaoNopMinhChung = (props: { isView?: boolean; getData: any; isOtherQLKH?: boolean }) => {
	const [form] = Form.useForm();

	const { recordTieuChi } = useModel('diemrenluyen.bieumau');

	const [formValues, setFormValues] = useState<any>({
		// ...recordSanPham,
		// ...recordSanPham?.thongTinKhaiBao,
	});

	return (
		<Form
			scrollToFirstError
			labelCol={{ span: 24 }}
			form={form}
			onValuesChange={(changedValues, values) => {
				setFormValues(values);
			}}
			onFinish={async (values) => {}}
		>
			<Row gutter={[12, 0]}>
				{recordTieuChi?.danhSachCauHinhMinhChung?.map((item) => (
					<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
				))}
			</Row>

			{/* {!props.isView && (
				<div className='form-footer'>
					<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
						Hủy
					</Button>
				</div>
			)} */}
		</Form>
		// </Card>
	);
};

export default FormGiaoNopMinhChung;
