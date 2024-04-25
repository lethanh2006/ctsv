import FormWaiting from '@/components/Loading/FormWaiting';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { EReceiverType, LoaiDoiTuongThongBao } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Modal, Row, Segmented, Select, Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableSelectUser from './TableSelect';
import { TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { EVaiTroBieuMau } from '@/utils/constants';
import GroupTagVaiTro from './GroupTagVaiTro';
import SelectKhoaSinhVien from './SelectKhoaSinhVien';
import SelectLopHanhChinhDebounce from './SelectLopHanhChinh';
import SelectLopHocPhanDebounce from './SelectLopHocPhan';
import SelectNganhCoSo from './SelectNganhCoSo';

const FormThongBao = (props: { title: string; getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setFormSubmiting,
		setVisibleForm,
		edit,
		postModel,
		formSubmiting,
		visibleForm,
		sortTime,
		getModel,
		putModel,
	} = useModel('thongbao.thongbao');
	const { title } = props;
	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<ThongBao.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<ThongBao.IUser[]>([]);
	const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) || EReceiverType.All;
	const loaiNguoiDung: EReceiverType = Form.useWatch('loaiNguoiDung', form);
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else {
			setActiveKey(roles?.[0]);
			form.setFieldsValue({
				receiverType: EReceiverType.All,
				loaiNguoiDung: EReceiverType.All,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (formSubmiting) return;
		setFormSubmiting(true);
		try {
			FormWaiting('Đang xử lý dữ liệu');
			const imageUrl = await buildUpLoadFile(values, 'imageUrl');
			values.imageUrl = imageUrl;
			setFormSubmiting(false);

			if (receiverType !== EReceiverType.All) values.filter[`id${receiverType}`] = values.danhSachDoiTuong;
			delete values.danhSachDoiTuong;
			if (loaiNguoiDung === EReceiverType.User) {
				// values.receiverType = loaiNguoiDung;
				values.userList = [...danhSachNhanSu, ...danhSachSinhVien].map((item) => ({
					ssoId: item.ssoId,
					username: item.code,
					fullname: item.fullname,
				}));
				if (!values.userList?.length) {
					message.warn('Vui lòng chọn người nhận');
					return;
				}
				// delete values.filter;
			}
			delete values.loaiNguoiDung;

			if (edit) {
				putModel(record?._id ?? '', values, props.getData)
					.then()
					.catch((er) => console.log(er));
			} else {
				await postModel(values, props.getData)
					.then(() => {
						setDanhSachNhanSu([]);
						setDanhSachSinhVien([]);
					})
					.catch((er) => console.log(er));
			}
		} catch (er) {
			console.log(er);
		} finally {
			setFormSubmiting(false);
			Modal.destroyAll();
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6}>
						<Form.Item name='imageUrl' label='Ảnh đại diện'>
							<UploadFile isAvatarSmall />
						</Form.Item>
					</Col>
					<Col span={24} md={18}>
						<Row>
							<Col span={24}>
								<Form.Item
									name='title'
									label='Tiêu đề'
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<Input placeholder='Nhập tiêu đề' />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='description' label='Mô tả' rules={[...rules.text, ...rules.length(500)]}>
									<Input.TextArea rows={3} placeholder='Mô tả' />
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={8}>
						<Form.Item name='receiverType' label='Đối tượng nhận thông báo' rules={[...rules.required]}>
							<Select
								options={Object.entries(LoaiDoiTuongThongBao)
									.filter(([value]) => value !== EReceiverType.User)
									.map(([value, label]) => ({
										key: value,
										value,
										label,
									}))}
								placeholder='Chọn nhóm người nhận'
								onChange={() => {
									form.setFieldsValue({
										filter: { roles: [] },
										danhSachDoiTuong: [],
									});
									setDanhSachNhanSu([]);
									setDanhSachSinhVien([]);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name={['filter', 'roles']} label='Vai trò' rules={[...rules.required]}>
							<GroupTagVaiTro
								onChange={(arr) => {
									setActiveKey(arr?.[0]);
									if (!arr.includes(EVaiTroBieuMau.SINH_VIEN)) setDanhSachSinhVien([]);
									if (!arr.includes(EVaiTroBieuMau.NHAN_VIEN)) setDanhSachNhanSu([]);
								}}
								listVaiTro={
									[EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
										? [EVaiTroBieuMau.SINH_VIEN]
										: receiverType === EReceiverType.Khoa
										? [EVaiTroBieuMau.NHAN_VIEN]
										: undefined
								}
							/>
						</Form.Item>
					</Col>
					{roles?.length ? (
						<Col span={24} md={8}>
							<Form.Item name='loaiNguoiDung' label='Danh sách người dùng'>
								<Segmented
									options={[
										{ value: EReceiverType.All, label: 'Tất cả' },
										{ value: EReceiverType.User, label: 'Người dùng cụ thể' },
									]}
								/>
							</Form.Item>
						</Col>
					) : null}

					{receiverType !== EReceiverType.All ? (
						<Col span={24}>
							<Form.Item name='danhSachDoiTuong' label={LoaiDoiTuongThongBao[receiverType]} rules={[...rules.required]}>
								{receiverType === EReceiverType.Khoa ? (
									<SelectDonVi multiple />
								) : receiverType === EReceiverType.KhoaSinhVien ? (
									<SelectKhoaSinhVien multiple />
								) : receiverType === EReceiverType.LopHanhChinh ? (
									<SelectLopHanhChinhDebounce multiple selectTen />
								) : receiverType === EReceiverType.LopHocPhan ? (
									<SelectLopHocPhanDebounce multiple selectTen />
								) : receiverType === EReceiverType.Nganh ? (
									<SelectNganhCoSo multiple />
								) : null}
							</Form.Item>
						</Col>
					) : null}

					{roles?.length ? (
						<>
							{loaiNguoiDung === EReceiverType.User ? (
								<Col span={24} style={{ marginBottom: 12 }}>
									<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
										{Object.values(EVaiTroBieuMau).map((item) =>
											roles.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} /> : null,
										)}
									</Tabs>

									{activeKey === EVaiTroBieuMau.SINH_VIEN ? (
										<TableSelectUser
											type={EVaiTroBieuMau.SINH_VIEN}
											selectedUsers={danhSachSinhVien}
											setSelectedUsers={setDanhSachSinhVien}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
										/>
									) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
										<TableSelectUser
											type={EVaiTroBieuMau.NHAN_VIEN}
											selectedUsers={danhSachNhanSu}
											setSelectedUsers={setDanhSachNhanSu}
											danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
										/>
									) : null}
								</Col>
							) : null}
						</>
					) : null}
				</Row>

				<Form.Item name='content' label='Nội dung chi tiết thông báo' rules={[...rules.requiredHtml]}>
					<TinyEditor height={300} hideMenubar />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongBao;
