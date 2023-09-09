import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import SelectKhoaNganh from '@/pages/DaoTao/KhoaNganh/Select';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EGioiTinh, ELoaiNoiSinh, TenLoaiNoiSinh } from '@/services/SinhVien/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import FormSucKhoe from '../HoSo/FormSucKhoe';
import FormThongTinChaMe from '../HoSo/FormThongTinChaMe';
import FormThongTinVoChong from '../HoSo/FormThongTinVoChong';
import FormTuyenSinh from '../HoSo/FormTuyenSinh';

const FormSinhVien = (props: { afterAddNew: (rec: SinhVien.IRecord) => void; disabledForm?: boolean }) => {
	const { record, edit, postModel, putModel, formSubmiting, setRecord, setEdit, setFormSubmiting, visibleForm } =
		useModel('sinhvien.sinhvien');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const { afterAddNew, disabledForm } = props;
	const [form] = Form.useForm();
	const loaiNoiSinh = Form.useWatch('loaiNoiSinh', form) ?? ELoaiNoiSinh.TRONG_NUOC;

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SinhVien.IRecord) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'anhDaiDienUrl');
		values.anhDaiDienUrl = url;
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={disabledForm}>
			{!disabledForm ? (
				<div className='button-section'>
					<Button
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						icon={edit ? <SaveOutlined /> : <PlusOutlined />}
					>
						{!edit ? <>Thêm mới và Tiếp tục</> : <>Lưu lại</>}
					</Button>
				</div>
			) : null}

			<Divider orientation='center'>Thông tin chung</Divider>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Form.Item name='anhDaiDienUrl' label=' '>
						<UploadFile isAvatar />
					</Form.Item>
				</Col>

				<Col span={24} md={18}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='ma' label='Mã sinh viên' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
								<Input placeholder='Mã sinh viên' disabled={edit} />
							</Form.Item>
						</Col>
						<Col span={24} md={16}>
							<Form.Item name='khoaNganhId' label='Khóa ngành' rules={[...rules.required]}>
								<SelectKhoaNganh disabled={edit} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='ten' label='Họ và tên' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên sinh viên' />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngaySinh' label='Ngày sinh' rules={[...rules.required, ...rules.ngaySinh]}>
								<MyDatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='gioiTinh' label='Giới tính' rules={[...rules.required, ...rules.text]}>
								<Select
									placeholder='Chọn giới tính'
									options={Object.values(EGioiTinh).map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='cccd' label='Số CMND/CCCD' rules={[...rules.required, ...rules.CMND]}>
								<Input placeholder='Nhập số CMND/CCCD' />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngayCapCccd' label='Ngày cấp' rules={[...rules.truocHomNay]}>
								<MyDatePicker placeholder='Chọn ngày cấp' allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='noiCapCccd' label='Nơi cấp' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập nơi cấp' />
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='quocTich' label='Quốc tịch'>
								<SelectQuocTich allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='danToc' label='Dân tộc'>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='tonGiao' label='Tôn giáo'>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>

			<Collapse>
				<Collapse.Panel forceRender header='Thông tin cá nhân chi tiết' key={'1'}>
					<Divider orientation='center' style={{ marginTop: 0 }}>
						Nơi sinh
					</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12} md={12}>
							<Form.Item name='loaiNoiSinh' label='Loại nơi sinh'>
								<Select
									placeholder='Chọn loại nơi sinh'
									allowClear
									options={Object.values(ELoaiNoiSinh).map((item) => ({
										key: item,
										value: item,
										label: TenLoaiNoiSinh[item],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={12}>
							{loaiNoiSinh === ELoaiNoiSinh.TRONG_NUOC ? (
								<Form.Item name='tinhTpNoiSinh' label='Tỉnh/Thành phố'>
									<Select
										placeholder='Chọn tỉnh/thành phố'
										options={listTinh?.map((item) => ({
											key: item.ma,
											value: item.tenDonVi,
											label: item.tenDonVi,
										}))}
										allowClear
										showSearch
										optionFilterProp='label'
									/>
								</Form.Item>
							) : (
								<Form.Item name='quocGiaNoiSinh' label='Quốc gia'>
									<Input placeholder='Nhập quốc gia nơi sinh' />
								</Form.Item>
							)}
						</Col>
					</Row>
					{/* <Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='NoiSinh' />
					</Row> */}

					<Divider orientation='center'>Quê quán</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='QueQuan' />
					</Row>

					<Divider orientation='center'>Hộ khẩu thường trú</Divider>
					<Row gutter={[12, 0]}>
						<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='ThuongTru' hasSoNha />
					</Row>

					<Divider orientation='center'>Thông tin liên lạc</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required, ...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='email' label='Email' rules={[...rules.required, ...rules.email]}>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
						{/* <Col span={24} md={6}>
							<Form.Item name='soDienThoai2' label='Số điện thoại 2' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='email2' label='Email 2' rules={[...rules.email]}>
								<Input placeholder='Nhập email 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='nguoiLienLac' label='Người liên lạc' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên người liên lạc' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='soDienThoaiNguoiLienLac' label='SĐT' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại người liên lạc' />
							</Form.Item>
						</Col> */}
					</Row>

					<Divider orientation='center'>Thông tin tài khoản ngân hàng</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='soTaiKhoanNganHang' label='Số tài khoản ngân hàng' rules={[...rules.sotaikhoan]}>
								<Input placeholder='Nhập số tài khoản' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='tenNganHang' label='Tên ngân hàng' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập tên ngân hàng' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='chiNhanhNganHang'
								label='Chi nhánh ngân hàng'
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập chi nhánh' />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header='Thông tin gia đình' key={'4'}>
					<Divider orientation='center'>Thông tin của cha</Divider>
					<FormThongTinChaMe suffix='Cha' form={form} />

					<Divider orientation='center'>Thông tin của mẹ</Divider>
					<FormThongTinChaMe suffix='Me' form={form} />

					{/* <Divider orientation='center'>Thông tin người giám hộ</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={6}>
							<Form.Item name='tenGiamHo' label='Họ tên' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên người giám hộ' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='ngaySinhGiamHo' label='Ngày sinh'>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='soDienThoaiGiamHo' label='SĐT' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='emailGiamHo' label='Email' rules={[...rules.email]}>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='ngheNghiepGiamHo' label='Nghề nghiệp' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập nghề nghiệp' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='noiCongTacGiamHo' label='Nơi công tác' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập nơi công tác' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='nguyenQuanGiamHo' label='Nguyên quán' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập nguyên quán' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='diaChiGiamHo' label='Địa chỉ' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập địa chỉ' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='tenChuHo' label='Tên chủ hộ' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập tên chủ hộ' />
							</Form.Item>
						</Col>
					</Row> */}

					<Divider orientation='center'>Thông tin vợ/chồng</Divider>
					<FormThongTinVoChong />

					<Divider orientation='center'>Thông tin anh/chị/em</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='thongTinAnhChiEm' label='' rules={[...rules.text, ...rules.length(2000)]}>
								<Input.TextArea placeholder='Nhập thông tin anh/chị/em' rows={3} />
							</Form.Item>
						</Col>
					</Row>

					{/* <Divider orientation='center'>Thông tin các con</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='thongTinCacCon' label='' rules={[...rules.text, ...rules.length(200)]}>
								<Input.TextArea placeholder='Nhập thông tin các con' rows={3} />
							</Form.Item>
						</Col>
					</Row> */}
				</Collapse.Panel>

				<Collapse.Panel forceRender header='Thông tin Đoàn / Đảng' key={'2'}>
					{/* <Divider orientation='center'>Thông tin Đoàn</Divider> */}
					<Row gutter={[12, 0]}>
						{/* <Col span={24} md={12}>
							<Form.Item name='laDoanVien' label=' ' valuePropName='checked'>
								<Checkbox>Là đoàn viên</Checkbox>
							</Form.Item>
						</Col> */}
						<Col span={12} md={8}>
							<Form.Item name='ngayVaoDoan' label='Ngày vào đoàn' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngayVaoDang' label='Ngày vào đảng' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='ngayVaoDangChinhThuc' label='Ngày vào đảng chính thức' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>

					{/* <Divider orientation='center'>Thông tin Đảng</Divider> */}
					{/* <Row gutter={[12, 0]}> */}
					{/* <Col span={24} md={12}>
							<Form.Item name='daHocLopCamTinhDang' label='' valuePropName='checked'>
								<Checkbox>Đã học lớp cảm tình Đảng</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='laDangVien' label='' valuePropName='checked'>
								<Checkbox>Là Đảng viên</Checkbox>
							</Form.Item>
						</Col> */}

					{/* </Row> */}
				</Collapse.Panel>

				<Collapse.Panel forceRender header='Thông tin sức khoẻ và bảo hiểm' key={'3'}>
					<FormSucKhoe />
				</Collapse.Panel>

				<Collapse.Panel header='Thông tin tuyển sinh đầu vào' key={'ts'}>
					<FormTuyenSinh />
				</Collapse.Panel>
			</Collapse>
		</Form>
	);
};

export default FormSinhVien;
