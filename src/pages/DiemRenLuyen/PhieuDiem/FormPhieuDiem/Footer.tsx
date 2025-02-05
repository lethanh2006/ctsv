import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ENguoiTraLoiDrl, ETrangThaiDanhGia } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { ENguoiTraLoi } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';

interface Props {
	onLuuVaGuiSau?: () => void;
	onGuiNgay?: () => void;
	onKetThuc?: () => void;
	formSubmiting?: boolean;
	nguoiTraLoi?: ENguoiTraLoiDrl;
	trangThaiDanhGia?: ETrangThaiDanhGia;
	isView?: boolean;
	dangGuiNgay?: boolean;
	currentSteps?: number;
	disableKetThuc?: boolean;
	disabled?: boolean;
}

export const Footer = ({
	onGuiNgay,
	onLuuVaGuiSau,
	onKetThuc,
	nguoiTraLoi,
	trangThaiDanhGia,
	formSubmiting,
	isView,
	dangGuiNgay,
	currentSteps,
	disableKetThuc,
	disabled,
}: Props) => {
	const renderButtonGuiNgay = () => {
		return (
			<Button
				onClick={onGuiNgay}
				disabled={(formSubmiting && !dangGuiNgay) || disabled}
				loading={formSubmiting && dangGuiNgay}
				type='primary'
			>
				Gửi <SendOutlined style={{ transform: 'translate(1px, -1px) rotate(-45deg)' }} />
			</Button>
		);
	};

	const renderButtonLuuVaGuiSau = () => {
		// if (
		// 	(nguoiTraLoi === ENguoiTraLoi.CA_NHAN && canBoKhongTheSuaDanhGia) ||
		// 	(nguoiTraLoi === ENguoiTraLoi.LANH_DAO_PHONG_BAN && lanhDaoKhongTheSuaDanhGia) ||
		// 	isView
		// ) {
		// 	return null;
		// }
		return (
			<Button
				onClick={onLuuVaGuiSau}
				loading={formSubmiting && !dangGuiNgay}
				disabled={(formSubmiting && dangGuiNgay) || disabled}
			>
				Lưu & Gửi sau <SaveOutlined />
			</Button>
		);
	};

	return (
		<div className='form-footer'>
			{renderButtonGuiNgay()}
			{renderButtonLuuVaGuiSau()}
		</div>
	);
};
