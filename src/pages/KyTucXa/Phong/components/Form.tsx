import type { KyTucXa } from '@/services/KyTucXa/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import UploadFile from '@/pages/KyTucXa/Phong/components/UploadFile';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import SelectKhoanThu from './SelectKhoanThu';
import { EGioiTinh } from '@/services/KyTucXa/constant';
import SelectTienIch from './SelectTienIch';

const FormPhongKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { danhSach: danhSachToaNha, getAllModel: getAllToaNha } = useModel('kytucxa.toa');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('kytucxa.phong');

	useEffect(() => {
		getAllToaNha();
		if (!visibleForm) return;
		if (record?._id) {
			const maDanhMucTienIch = record.danhSachTienIch?.map((item: any) => item.maDanhMucTienIch) || [];
			form.setFieldsValue({
				...record,
				danhSachTienIch: {
					maDanhMucTienIch,
				},
			});
		} else {
			resetFieldsForm(form);
		}
	}, [record?._id, visibleForm]);

	const isView = false;

	const onFinish = async (values: KyTucXa.IPhongKTX) => {
		try {
			const danhSachAnh = await buildUpLoadMultiFile(values, 'danhSachAnh');
			const { dangKyKyTucXaRule, danhSachTienIch, ...restValues } = values as any;
			
			const maDanhMucList = danhSachTienIch?.maDanhMucTienIch || [];
			const formattedTienIch = Array.isArray(maDanhMucList)
				? maDanhMucList.map((id: string) => ({
					maDanhMucTienIch: id,
				}))
				: [];

			const finalValues = { 
				...restValues, 
				...(dangKyKyTucXaRule || {}),
				danhSachTienIch: formattedTienIch,
				danhSachAnh: danhSachAnh ?? [] 
			};

			if (edit) {
				await putModel(record?.ma ?? record?._id ?? '', finalValues);
			} else {
				await postModel(finalValues);
			}
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} cấu hình phòng`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{edit && (
						<Col xs={24}>
							<div style={{ marginBottom: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
								<span style={{ fontWeight: 500 }}>Phòng: </span>{record?.ten}
								{record?.maToaNha && <span style={{ marginLeft: 16 }}><span style={{ fontWeight: 500 }}>Tòa: </span>{danhSachToaNha?.find((item: KyTucXa.IToaKTX) => item?.ma === record?.maToaNha)?.ten || '-'}</span>}
							</div>
						</Col>
					)}
					<Col xs={24}>
						<Form.Item 
							name='danhSachAnh' 
							label='Ảnh phòng'
							extra={
								<div style={{ marginTop: 8, color: '#fa8c16', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
									<InfoCircleOutlined style={{ fontSize: '14px', color: '#fa8c16' }} />
									<span>Ảnh đầu tiên tải lên sẽ là <b>Ảnh đại diện</b> hiển thị tổng quan phòng.</span>
								</div>
							}
						>
							<UploadFile maxCount={10} accept='image/*' disabled={isView} otherProps={{ listType: 'picture-card' }} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<div className='fw500' style={{ marginBottom: 8, marginTop: 12 }}>
							Quy định đăng ký
						</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'gioiTinh']} label='Giới tính cho phép'>
							<Select
								disabled={isView}
								placeholder='Chọn giới tính'
								options={[
									{ value: EGioiTinh.NAM, label: 'Nam' },
									{ value: EGioiTinh.NU, label: 'Nữ' },
								]}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'maxPerKhoa']} label='Số SV tối đa mỗi khoa'>
							<InputNumber disabled={isView} min={1} style={{ width: '100%' }} placeholder='Ví dụ: 2' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soLuongToiDa' label='Số lượng tối đa' rules={[...rules.required]}>
							<InputNumber disabled={isView} min={1} style={{ width: '100%' }} placeholder='Nhập số lượng tối đa' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='cachBoTri' label='Cách bố trí phòng'>
							<Input disabled={isView} placeholder='Nhập cách bố trí (ví dụ: 1 khách 1 bếp,...)' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuPhong' label='Bảng giá phí phòng'>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuCoc' label='Bảng giá phí cọc'>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name={['danhSachTienIch', 'maDanhMucTienIch']} label='Danh sách tiện ích'>
							<SelectTienIch multiple={true} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='moTa' label='Mô tả phòng'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Nhập mô tả phòng' />
						</Form.Item>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormPhongKTX;
