import type { FormDanhGiaValues } from '@/models/diemrenluyen/bieumau';
import type { BieuMau } from '@/services/DiemRenLuyen/BieuMau/typing';
import {
	BCS_DANH_GIA_PREFIX,
	CTSV_DANH_GIA_PREFIX,
	CVHT_DANH_GIA_PREFIX,
	ENguoiTraLoiDrl,
	ETrangThaiKhieuNai,
	ETrangThaiPhieuDiemRL,
	MapKeyColorTrangThaiKhieuNai,
	TU_DANH_GIA_PREFIX,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { FieldsNhapDiem } from './FieldsNhapDiem';
import useCheckAccess from '@/hooks/useCheckAccess';

const FormNhapPhieuDiem = (props: { trangThai?: ETrangThaiKhieuNai; isSuaDiemKhieuNai?: boolean; getData?: any }) => {
	const [form] = Form.useForm();
	const {
		formValuesTuDanhGiaVaDonViDanhGia,
		isLoadingFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetDiemMinhChungDRL,
		dataDiemMinhChung,
	} = useModel('diemrenluyen.bieumau');

	const { record: recordDot, dataPhanQuyen, handleCheckPhanQuyen } = useModel('diemrenluyen.dot');
	
	const {
		record: recPhieuDiem,
		xuLyKhieuNaiModel,
		loading,
		setVisibleForm,
	} = useModel('diemrenluyen.phieudiemrenluyen');

	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	useEffect(() => {
		handleCheckPhanQuyen(idDuyet, isKhoa);
	}, []);

	const isCVHT = false;
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const isAdmin = currentUser?.preferred_username === 'admin';
	const nguoiTraLoi =
		isAdmin || dataPhanQuyen?.isPhongCTSV
			? ENguoiTraLoiDrl.CTSV
			: isCVHT
			? ENguoiTraLoiDrl.CO_VAN_HOC_TAP
			: ENguoiTraLoiDrl.KHOA;

	const [tongDiemTuDanhGia, setTongDiemTuDanhGia] = useState(0);
	const [tongDiemCVHTDanhGia, setTongDiemCVHTDanhGia] = useState(0);
	const [tongDiemCTSVDanhGia, setTongDiemCTSVDanhGia] = useState(0);
	const [tongDiemKhoaDanhGia, setTongDiemKhoaDanhGia] = useState(0);

	const handleTinhDiemVaPhanLoai = (formValues_?: Partial<any>) => {
		const formValues = formValues_ ?? form.getFieldsValue();
		let tongDiemTuDanhGia_ = 0;
		let tongDiemCVHTDanhGia_ = 0;
		let tongDiemCTSVDanhGia_ = 0;
		let tongDiemKhoaDanhGia_ = 0;
		Object.keys(formValues ?? {}).forEach((key) => {
			const key_ = key as keyof typeof formValues;
			const valueInNumber = Number(formValues[key_]);
			if (key.startsWith(TU_DANH_GIA_PREFIX)) {
				tongDiemTuDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(CVHT_DANH_GIA_PREFIX)) {
				tongDiemCVHTDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(CTSV_DANH_GIA_PREFIX)) {
				tongDiemCTSVDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(BCS_DANH_GIA_PREFIX)) {
				tongDiemKhoaDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			}
		});
		setTongDiemTuDanhGia(tongDiemTuDanhGia_);
		setTongDiemCVHTDanhGia(tongDiemCVHTDanhGia_);
		setTongDiemCTSVDanhGia(tongDiemCTSVDanhGia_);
		setTongDiemKhoaDanhGia(tongDiemKhoaDanhGia_);
	};

	const handleSave = async () => {
		try {
			await form.validateFields();
			if (form.getFieldsError().length) {
				const formValues = form.getFieldsValue();
				const diemChamSV: { idCauHoi: string; traLoiText: any }[] = [];
				const diemChamBCS: { idCauHoi: string; traLoiText: any }[] = [];
				const diemChamCVHT: { idCauHoi: string; traLoiText: any }[] = [];
				Object.keys(formValues).map((key) => {
					if (key.startsWith(TU_DANH_GIA_PREFIX)) {
						diemChamSV.push({
							idCauHoi: key.replace(TU_DANH_GIA_PREFIX, ''),
							traLoiText: formValues[key]?.toString(),
						});
					} else if (key.startsWith(CVHT_DANH_GIA_PREFIX)) {
						diemChamCVHT.push({
							idCauHoi: key.replace(CVHT_DANH_GIA_PREFIX, ''),
							traLoiText: formValues[key]?.toString(),
						});
					} else {
						diemChamBCS.push({
							idCauHoi: key.replace(BCS_DANH_GIA_PREFIX, ''),
							traLoiText: formValues[key]?.toString(),
						});
					}
				});

				const diemSV = recPhieuDiem?.diemCham?.find((item) => item?.vaiTro === ENguoiTraLoiDrl.SINH_VIEN);
				const diemBCS = recPhieuDiem?.diemCham?.find((item) => item?.vaiTro === ENguoiTraLoiDrl.BCS);
				const diemCVHT = recPhieuDiem?.diemCham?.find((item) => item?.vaiTro === ENguoiTraLoiDrl.CO_VAN_HOC_TAP);

				const thongTinDiemCham = {
					ssoId: recPhieuDiem?.ssoId,
					idDot: recordDot?._id ?? '',
					idKhaoSat: recordDot?.idBieuMau ?? '',
					idDotChamDiemRenLuyen: recordDot?._id ?? '',
					idPhieuDiem: recPhieuDiem?._id,
				};
				const payload = {
					diemChamSv: {
						...thongTinDiemCham,
						nguoiTraLoi: ENguoiTraLoiDrl.SINH_VIEN,
						trangThaiNopSV: ETrangThaiPhieuDiemRL.DA_GUI,
						...diemSV,
						danhSachTraLoi: diemChamSV,
						idKhaoSat: recordDot?.idBieuMau,
					},
					diemChamBCS: {
						...thongTinDiemCham,
						ssoIdSinhVien: recPhieuDiem?.ssoId,
						nguoiTraLoi: ENguoiTraLoiDrl.BCS,
						trangThaiNopBCS: ETrangThaiPhieuDiemRL.DA_GUI,
						...diemBCS,
						danhSachTraLoi: diemChamBCS,
					},
					diemChamCV: {
						...thongTinDiemCham,
						ssoIdSinhVien: recPhieuDiem?.ssoId,
						nguoiTraLoi: ENguoiTraLoiDrl.CO_VAN_HOC_TAP,
						trangThaiNopCoVan: ETrangThaiPhieuDiemRL.DA_GUI,
						...diemCVHT,
						danhSachTraLoi: diemChamCVHT,
					},

					trangThaiXuLyKhieuNai: props?.trangThai ?? ETrangThaiKhieuNai.DA_DUYET,
					traLoiNoiDungKhieuNai: formValues?.traLoiNoiDungKhieuNai,
				};
				await xuLyKhieuNaiModel(recPhieuDiem?._id ?? '', payload, props?.getData);
				setVisibleForm(false);
			} else {
				if (props.trangThai === ETrangThaiKhieuNai.DA_DUYET)
					message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
			}
		} catch (e) {
			console.log(e);
			if (props.trangThai === ETrangThaiKhieuNai.DA_DUYET)
				message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
		}
	};

	useEffect(() => {
		if (recordDot?._id) {
			handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id, nguoiTraLoi, recPhieuDiem?.ssoId);
			handleGetDiemMinhChungDRL(recordDot?._id, recPhieuDiem?.ssoId ?? '');
		}
	}, [recordDot]);

	const handleCheckUniq = (arrOrigin: BieuMau.TraLoiRecord[], arr: BieuMau.TraLoiRecord[]): BieuMau.TraLoiRecord[] => {
		// Tạo một bản đồ để lưu trữ các phần tử theo trường idCauHoi từ mảng arr1
		const map = new Map();
		arrOrigin.forEach((item) => map.set(item.idCauHoi, item));

		// Duyệt qua từng phần tử của mảng arr2
		arr.forEach((item) => {
			// Nếu idCauHoi không tồn tại trong bản đồ thì thêm vào
			if (!map.has(item.idCauHoi)) {
				map.set(item.idCauHoi, item);
			}
		});

		// Chuyển đổi bản đồ thành mảng kết quả
		return Array.from(map.values()) as BieuMau.TraLoiRecord[];
	};

	useEffect(() => {
		form.resetFields();

		const tuDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiTuDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${TU_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});
		const cvhtDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiCVHTDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${CVHT_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});
		const ctsvDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiCTSVDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${CTSV_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});
		const khoaDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiBCSDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${BCS_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});

		const formValues: Partial<DeepNullable<FormDanhGiaValues>> = {
			...tuDanhGiaFields,
			...cvhtDanhGiaFields,
			...ctsvDanhGiaFields,
			...khoaDanhGiaFields,
		};
		form.setFieldsValue(formValues as any);
		handleTinhDiemVaPhanLoai(formValues as any);
	}, [formValuesTuDanhGiaVaDonViDanhGia, dataDiemMinhChung]);

	return (
		<Card>
			<Spin spinning={isLoadingFormValuesTuDanhGiaVaDonViDanhGia}>
				<Form
					layout='vertical'
					form={form}
					onChange={() => handleTinhDiemVaPhanLoai()}
					scrollToFirstError={{
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					}}
					onFinishFailed={() => {
						message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
					}}
				>
					<FieldsNhapDiem
						tongDiemCTSVDanhGia={tongDiemCTSVDanhGia}
						tongDiemDonViDanhGia={tongDiemCVHTDanhGia}
						tongDiemTuDanhGia={tongDiemTuDanhGia}
						tongDiemKhoaDanhGia={tongDiemKhoaDanhGia}
						disabled={props.isSuaDiemKhieuNai && props?.trangThai === ETrangThaiKhieuNai.DA_DUYET ? false : true}
						nguoiTraLoi={nguoiTraLoi}
						title={
							<>
								<div>I.PHIẾU ĐIỂM RÈN LUYỆN</div>
								{props.isSuaDiemKhieuNai && (
									<div>
										Trạng thái khiếu nại:{' '}
										<Tag
											color={
												MapKeyColorTrangThaiKhieuNai[
													recPhieuDiem?.trangThaiXuLyKhieuNai ?? ETrangThaiKhieuNai.CHO_XU_LY
												]
											}
										>
											{recPhieuDiem?.trangThaiXuLyKhieuNai}
										</Tag>
										{recPhieuDiem?.traLoiNoiDungKhieuNai && (
											<span style={{ marginLeft: 10 }}>
												{recPhieuDiem.trangThaiXuLyKhieuNai === ETrangThaiKhieuNai.KHONG_DUYET ? 'Lý do' : 'Ghi chú'}:{' '}
												{recPhieuDiem.traLoiNoiDungKhieuNai}
											</span>
										)}
									</div>
								)}
							</>
						}
					/>
					{props.isSuaDiemKhieuNai && props?.trangThai && (
						<Form.Item
							rules={
								props?.trangThai === ETrangThaiKhieuNai.KHONG_DUYET
									? [...rules.text, ...rules.required]
									: [...rules.text]
							}
							initialValue={recPhieuDiem?.traLoiNoiDungKhieuNai}
							style={{ marginTop: 8 }}
							label={
								<b style={{ marginLeft: 4 }}>
									{props?.trangThai === ETrangThaiKhieuNai.DA_DUYET ? 'Ghi chú' : 'Lý do'}
								</b>
							}
							name={'traLoiNoiDungKhieuNai'}
						>
							<Input.TextArea placeholder='Nhập ghi chú' />
						</Form.Item>
					)}
				</Form>
				{props.isSuaDiemKhieuNai && props.trangThai && (
					<div className='form-footer'>
						<Button icon={<SaveOutlined />} type='primary' onClick={() => handleSave()} loading={loading}>
							Lưu
						</Button>

						<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)} loading={loading}>
							Đóng
						</Button>
					</div>
				)}
			</Spin>
		</Card>
	);
};
export default FormNhapPhieuDiem;
