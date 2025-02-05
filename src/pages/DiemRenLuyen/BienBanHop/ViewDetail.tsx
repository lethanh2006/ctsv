import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';

import {
	ETrangThaiDuyetBienBanHopDiemRenLuyen,
	MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen,
} from '@/services/DiemRenLuyen/BienBanHop/constant';
import rules from '@/utils/rules';
import { ArrowLeftOutlined, CheckOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import StepDotChamDiemRenLuyen from '../Dot/Step';
import FormYeuCauChinhSua from './FormYeuCauChinhSua';

const ViewDetailBienBanHopDrl = (props: { tenLop?: string; idLop?: string; getData?: any }) => {
	const {
		getAllModel,
		loading,
		record,
		putModel,
		exportBienBanHopModel,
		visibleFormYeuCauChinhSua,
		setVisibleFormYeuCauChinhSua,
	} = useModel('diemrenluyen.bienbanhop');
	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');
	const [form] = Form.useForm();
	const soVangMat = Form.useWatch('soVangMat', form);
	const getData = () => {
		if (props?.tenLop && recDot?._id)
			getAllModel(true, undefined, { tenLopHC: props?.tenLop, dotChamDiemId: recDot?._id });
	};

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
	}, [record?._id]);

	useEffect(() => {
		getData();
	}, [props?.tenLop, recDot?._id]);

	const handleGuiBienBanHop = async (trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen) => {
		const payload = {
			...record,
			trangThaiDuyet,
		};
		if (record?._id) {
			putModel(record._id, payload, props.getData);
		}
	};

	const disableForm = true;

	return (
		<>
			<StepDotChamDiemRenLuyen />
			<Form style={{ maxWidth: 1000, margin: '0 auto' }} form={form} labelCol={{ span: 24 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 12,
					}}
				>
					<div>
						{props.tenLop && (
							<SelectDotDiemRenLuyen
								style={{ width: 300 }}
								value={recDot?._id}
								onChange={(val, option) => {
									const rawData = option?.rawData;
									setRecDot(rawData);
								}}
								isSetRecord={true}
							/>
						)}
						{record?._id && (
							<Button
								style={{ marginLeft: 8 }}
								onClick={() => {
									exportBienBanHopModel(record?._id ?? '', props?.tenLop ?? '', recDot?.tenDot ?? '');
								}}
								loading={loading}
								icon={<DownloadOutlined />}
								type='primary'
							>
								Tải biên bản họp
							</Button>
						)}
					</div>
					<div style={{ fontSize: 16, fontWeight: 'bold' }}>
						Trạng thái biên bản họp:{' '}
						<Tag
							color={
								MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen[
									record?.trangThaiDuyet ?? ETrangThaiDuyetBienBanHopDiemRenLuyen.CHUA_GUI
								]
							}
						>
							{record?.trangThaiDuyet ?? ETrangThaiDuyetBienBanHopDiemRenLuyen.CHUA_GUI}
						</Tag>
					</div>
				</div>
				{record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA &&
					record?.noiDungYeuCauChinhSua && (
						<div>
							<b>Nội dung yêu cầu chỉnh sửa:</b> {record?.noiDungYeuCauChinhSua ?? ''}
						</div>
					)}
				<Row gutter={[16, 0]}>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name='thoiGian' label='Thời gian' rules={[...rules.required]}>
							<MyDatePicker
								disabled={disableForm}
								format={'HH:mm DD/MM/YYYY'}
								placeholder='Thời gian họp'
								showTime={{ showHour: true, showMinute: true }}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name='diaDiem' label='Địa điểm' rules={[...rules.required]}>
							<Input disabled={disableForm} placeholder='Nhập địa điểm họp' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name={['chuTri', 'ssoId']} label='Chủ trì' rules={[...rules.required]}>
							<SelectNhanSuDebounce disabled />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name={['thuKy', 'ten']} label='Thư ký' rules={[...rules.required]}>
							<Input disabled placeholder='Thư ký' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name='soCoMat' label='Có mặt' rules={[...rules.required]}>
							<InputNumber
								disabled={disableForm}
								style={{ width: '100%' }}
								min={0}
								max={1000}
								placeholder='Số lượng sinh viên có mặt'
								addonAfter='Sinh viên'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={8}>
						<Form.Item name='soVangMat' label='Vắng mặt' rules={[...rules.required]}>
							<InputNumber
								disabled={disableForm}
								style={{ width: '100%' }}
								placeholder='Số lượng sinh viên vắng mặt'
								min={0}
								max={1000}
								addonAfter='Sinh viên'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							tooltip={{
								title: 'Định dạng: "Họ và tên: ...... Lý do vắng mặt ........"',
								overlayStyle: { maxWidth: '340px' },
							}}
							name='sinhVienVang'
							label='Sinh viên vắng'
							rules={soVangMat && soVangMat > 0 ? [...rules.requiredHtml] : undefined}
						>
							<TinyEditor disabled={disableForm} height={600} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='yKien'
							label='Ý kiến của sinh viên hoặc tập thể lớp'
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea disabled={disableForm} placeholder='Ý kiến của sinh viên hoặc tập thể lớp' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='kienNghiDeXuat' label='Kiến nghị, đề xuất (nếu có)' rules={[...rules.text]}>
							<Input.TextArea disabled={disableForm} placeholder='Kiến nghị, đề xuất (nếu có)' />
						</Form.Item>
					</Col>
				</Row>

				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 8,
					}}
				>
					{record?._id &&
						[
							ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET,
							ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
						].includes(record.trangThaiDuyet) && (
							<Button
								icon={<ArrowLeftOutlined />}
								type='primary'
								onClick={() => handleGuiBienBanHop(ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET)}
								loading={loading}
							>
								Chuyển về chờ duyệt
							</Button>
						)}
					{record?._id &&
						[
							ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET,
							ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
						].includes(record.trangThaiDuyet) && (
							<>
								<Button
									icon={<CheckOutlined />}
									disabled={record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET}
									type='primary'
									onClick={() => handleGuiBienBanHop(ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET)}
									loading={loading}
								>
									Xác nhận
								</Button>
								<Button
									icon={<EditOutlined />}
									disabled={record?.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET}
									onClick={() => setVisibleFormYeuCauChinhSua(true)}
									loading={loading}
								>
									Yêu cầu chỉnh sửa
								</Button>
							</>
						)}
				</div>
			</Form>
			<Modal
				bodyStyle={{ padding: 0 }}
				visible={visibleFormYeuCauChinhSua}
				footer={false}
				onCancel={() => setVisibleFormYeuCauChinhSua(false)}
			>
				<FormYeuCauChinhSua
					getData={() => {
						getData();
						if (props.getData) getData();
					}}
				/>
			</Modal>
		</>
	);
};

export default ViewDetailBienBanHopDrl;
