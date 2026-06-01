import type { KyTucXa } from '@/services/KyTucXa/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import UploadFile from '@/pages/KyTucXa/Phong/components/UploadFile';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import SelectKhoanThu from './SelectKhoanThu';
import { EGioiTinh, ELoaiSinhVienKTX } from '@/services/KyTucXa/constant';
import SelectTienIch from './SelectTienIch';
import SelectRoomType from './SelectRoomType';

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
				quocTichPhong: record.quocTichPhong ? [record.quocTichPhong] : [],
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
			const { dangKyKyTucXaRule, danhSachTienIch, quocTichPhong: nationalityArray, ...restValues } = values as any;
			
			const maDanhMucList = danhSachTienIch?.maDanhMucTienIch || [];
			const formattedTienIch = Array.isArray(maDanhMucList)
				? maDanhMucList.map((id: string) => ({
					maDanhMucTienIch: id,
				}))
				: [];

			const finalValues = { 
				...restValues, 
				quocTichPhong: (nationalityArray && nationalityArray.length > 0) ? nationalityArray[0] : null,
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
		<Card title={`${edit ? intl.formatMessage({ id: 'kytucxa.phong.chinhSua' }) : intl.formatMessage({ id: 'kytucxa.phong.themMoi' })} ${intl.formatMessage({ id: 'kytucxa.phong.cauHinhPhongText' })}`} className='form-card'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{edit && (
						<Col xs={24}>
							<div style={{ marginBottom: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
								<span style={{ fontWeight: 500 }}>{intl.formatMessage({ id: 'kytucxa.phong.tenPhong' })}: </span>{record?.ten}
								{record?.maToaNha && <span style={{ marginLeft: 16 }}><span style={{ fontWeight: 500 }}>{intl.formatMessage({ id: 'kytucxa.phong.toaNha' })}: </span>{danhSachToaNha?.find((item: KyTucXa.IToaKTX) => item?.ma === record?.maToaNha)?.ten || '-'}</span>}
							</div>
						</Col>
					)}
					<Col xs={24}>
						<Form.Item 
							name='danhSachAnh' 
							label={intl.formatMessage({ id: 'kytucxa.phong.anhPhong' })}
							extra={
								<div style={{ marginTop: 8, color: '#fa8c16', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
									<InfoCircleOutlined style={{ fontSize: '14px', color: '#fa8c16' }} />
									<span>{intl.formatMessage({ id: 'kytucxa.phong.anhDauTienThongBao' })} <b>{intl.formatMessage({ id: 'kytucxa.phong.anhDaiDien' })}</b> {intl.formatMessage({ id: 'kytucxa.phong.hienThiTongQuan' })}</span>
								</div>
							}
						>
							<UploadFile maxCount={5} accept='image/*' disabled={isView} otherProps={{ listType: 'picture-card' }} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<div className='fw500' style={{ marginBottom: 8, marginTop: 12 }}>
							{intl.formatMessage({ id: 'kytucxa.phong.quyDinhDangKy' })}
						</div>
					</Col>
					<Col xs={24}>
						<Form.Item name='quocTichPhong'>
							<Checkbox.Group 
								disabled={isView}
								onChange={(checkedValues) => {
									console.log(checkedValues.length)
									if (checkedValues.length >= 1) {
										form.setFieldValue('quocTichPhong', [checkedValues[checkedValues.length - 1]]);
									}
								}}
								style={{ width: '100%' }}
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} md={12}>
										<Checkbox value={ELoaiSinhVienKTX.QUOC_TE}>
											{intl.formatMessage({ id: 'kytucxa.phong.international' })}
										</Checkbox>
									</Col>
									<Col xs={24} md={12}>
										<Checkbox value={ELoaiSinhVienKTX.VIET_NAM}>
											{intl.formatMessage({ id: 'kytucxa.phong.vietnamese' })}
										</Checkbox>
									</Col>
								</Row>
							</Checkbox.Group>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='loaiPhongKtx' label={intl.formatMessage({ id: 'kytucxa.phong.loaiPhong' })}>
							<SelectRoomType />
						</Form.Item>
					</Col>
					{/* <Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'maxPerKhoa']} label={intl.formatMessage({ id: 'kytucxa.phong.soSvToiDaMoiKhoa' })}>
							<InputNumber disabled={isView} min={0} style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'kytucxa.phong.viDu2' })} />
						</Form.Item>
					</Col> */}
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'gioiTinh']} label={intl.formatMessage({ id: 'kytucxa.phong.gioiTinhChoPhep' })} rules={[...rules.required]}>
							<Select
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'kytucxa.phong.chonGioiTinh' })}
								options={[
									{ value: EGioiTinh.NAM, label: intl.formatMessage({ id: 'kytucxa.phong.nam' }) },
									{ value: EGioiTinh.NU, label: intl.formatMessage({ id: 'kytucxa.phong.nu' }) },
								]}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soLuongToiDa' label={intl.formatMessage({ id: 'kytucxa.phong.soLuongToiDa' })} rules={[...rules.required]}>
							<InputNumber disabled={isView} min={1} style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'kytucxa.phong.nhapSoLuongToiDa' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name={['danhSachTienIch', 'maDanhMucTienIch']} label={intl.formatMessage({ id: 'kytucxa.phong.danhSachTienIch' })}>
							<SelectTienIch multiple={true} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='cachBoTri' label={intl.formatMessage({ id: 'kytucxa.phong.cachBoTriPhong' })}>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'kytucxa.phong.nhapCachBoTri' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuPhong' label={intl.formatMessage({ id: 'kytucxa.phong.bangGiaPhiPhong' })}>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuCoc' label={intl.formatMessage({ id: 'kytucxa.phong.bangGiaPhiCoc' })}>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='moTa' label={intl.formatMessage({ id: 'kytucxa.phong.moTaPhong' })}>
							<Input.TextArea rows={3} disabled={isView} placeholder={intl.formatMessage({ id: 'kytucxa.phong.nhapMoTaPhong' })} />
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
