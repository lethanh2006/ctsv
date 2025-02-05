import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Tooltip } from 'antd';
import BlockQuestion from './BlockQuestion';
import { useModel } from 'umi';
import { ELoaiBieuMau, ELoaiCauHoi } from '@/services/KhaoSat/constant';
import { type FormInstance } from 'antd/es/form/Form';
import { useState } from 'react';

const Block = (props: {
	form: FormInstance<any>;
	field: { name: number; key: number; isListField?: boolean };
	index?: number;
}) => {
	const { record } = useModel('khaosat.bieumau');
	const [isTieuDeDanhMuc, setIsTieuDeDanhMuc] = useState<boolean>(
		record?.danhSachKhoi?.[props?.field?.name]?.isTieuDeDanhMuc ?? false,
	);
	return (
		<>
			<Form.Item style={{ marginBottom: 12 }} name={[props.field.name, 'tieuDe']} label='Tiêu đề'>
				<Input placeholder='Tiêu đề' />
			</Form.Item>
			<Form.Item name={[props.field.name, 'isTieuDeDanhMuc']} valuePropName='checked'>
				<Checkbox
					onChange={(e) => {
						setIsTieuDeDanhMuc(e?.target?.checked);
						if (e?.target?.checked === true) {
							const dsKhoi = props?.form?.getFieldValue('danhSachKhoi') ?? [];
							dsKhoi?.forEach((item: any, index: number) => {
								if (index === props?.index) {
									item.danhSachCauHoi = [];
								}
							});
							props?.form?.setFieldsValue({
								danhSachKhoi: dsKhoi,
							});
						}
					}}
				>
					Là tiêu đề danh mục
				</Checkbox>
			</Form.Item>
			<Form.Item name={[props.field.name, 'moTa']} label='Mô tả'>
				<Input.TextArea rows={2} placeholder='Mô tả' />
			</Form.Item>
			{!isTieuDeDanhMuc && (
				<Form.List
					name={[props.field.name, 'danhSachCauHoi']}
					rules={[
						{
							validator: async (_, names) => {
								if (!isTieuDeDanhMuc) {
									if (!names || names.length < 1) {
										return Promise.reject(new Error('Ít nhất 1 câu hỏi'));
									}
								}

								return '';
							},
						},
					]}
				>
					{(fields, { add, remove, move }, { errors }) => {
						return (
							<>
								{fields.map((field, index) => (
									<div key={field.key}>
										<Card
											size='small'
											headStyle={{ padding: '0px 12px' }}
											bodyStyle={{ padding: '8px 12px' }}
											key={field.key}
											title={
												<>
													<div style={{ float: 'left' }}>Câu hỏi {index + 1}</div>
													<Tooltip title='Xóa'>
														<CloseOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => remove(field.name)}
														/>
													</Tooltip>
													<Tooltip title='Di chuyển lên'>
														<ArrowUpOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => move(field.name, field.name - 1)}
														/>
													</Tooltip>
													<Tooltip title='Di chuyển xuống'>
														<ArrowDownOutlined
															style={{ float: 'right', marginTop: 4 }}
															onClick={() => move(field.name, field.name + 1)}
														/>
													</Tooltip>
												</>
											}
										>
											<BlockQuestion key={index} form={props.form} index={index} block={props.field.name} />
										</Card>
										<br />
									</div>
								))}

								<Form.Item>
									<Button
										type='dashed'
										onClick={() =>
											add(
												record?.loai === ELoaiBieuMau.DANH_GIA_CAN_BO
													? { loai: ELoaiCauHoi.NumberInputRating }
													: undefined,
											)
										}
										style={{ width: '100%' }}
										icon={<PlusOutlined />}
										size='small'
									>
										Thêm câu hỏi
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						);
					}}
				</Form.List>
			)}
		</>
	);
};

export default Block;
