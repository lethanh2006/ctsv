import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Tabs } from 'antd';
import { useModel } from 'umi';

const FormImport = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { importMinhChungModel, setVisibleFormImport, loading, formSubmiting } = useModel(
		'diemrenluyen.minhchung.khaibao',
	);
	const { record: recordCauHinh } = useModel('diemrenluyen.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyen.dot');
	return (
		<Form
			scrollToFirstError
			form={form}
			onFinish={async (values) => {
				if (recordCauHinh?._id && recordDot?._id) {
					const res = await importMinhChungModel(
						recordDot?._id,
						recordCauHinh?._id,
						{
							file: values?.file?.fileList?.[0]?.originFileObj,
						},
						props.getData,
					);

					const dataResult = res?.data?.data ?? {};
					if (dataResult?.insertSuccess?.length || dataResult?.insertError?.length) {
						const columns: IColumn<any>[] = [];
						const objectResult = dataResult?.insertSuccess?.[0] || dataResult?.insertError?.[0] || {};
						Object.keys(objectResult).map((item) => {
							columns.push({
								title: item,
								dataIndex: item,
								width: 200,
								align: 'center',
							});
						});

						Modal.info({
							width: 1000,
							title: 'Kết quả import',
							content: (
								<div>
									<Tabs type='card'>
										<Tabs.TabPane
											tab={`${dataResult?.insertSuccess?.length ?? 0} thành công`}
											key={'success'}
											tabKey='success'
										>
											<TableStaticData columns={columns} data={dataResult?.insertSuccess ?? []} addStt />
										</Tabs.TabPane>
										<Tabs.TabPane tab={`${dataResult?.insertError?.length ?? 0} gặp lỗi`} key={'error'} tabKey='error'>
											<TableStaticData columns={columns} data={dataResult?.insertError ?? []} addStt />
										</Tabs.TabPane>
									</Tabs>
								</div>
							),
						});
					}
				}
			}}
		>
			<Form.Item rules={[...rules.required]} name='file' label='File dữ liệu'>
				<UploadFile maxCount={1} accept='.xlsx' />
			</Form.Item>

			<div className='form-footer'>
				<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
					{'Lưu lại'}
				</Button>
				<Button icon={<CloseOutlined />} onClick={() => setVisibleFormImport(false)}>
					Hủy
				</Button>
			</div>
		</Form>
	);
};

export default FormImport;
