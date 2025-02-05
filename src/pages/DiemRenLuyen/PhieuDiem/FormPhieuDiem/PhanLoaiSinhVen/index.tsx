import {
	EPhanLoaiTrongFormDanhGia,
	PhanLoaiTrongFormDanhGiaMappingtoLabel,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { Form, Radio } from 'antd';
import { FieldWithTitle } from '../FieldWithTitle';
import './styles.less';

interface Props {
	phanLoai?: EPhanLoaiTrongFormDanhGia;
}

export const PhanLoaiSinhVien = ({ phanLoai }: Props) => {
	return (
		<Form.Item name='phanLoai' dependencies={['phanLoai']}>
			<FieldWithTitle title='II. TỰ PHÂN LOẠI CỦA SINH VIÊN'>
				<Radio.Group value={phanLoai}>
					{Object.values(EPhanLoaiTrongFormDanhGia).map((item) => {
						return (
							<div key={item}>
								<Radio className='PhanLoaiVienChuc__item' value={item}>
									{PhanLoaiTrongFormDanhGiaMappingtoLabel[item]}
								</Radio>
							</div>
						);
					})}
				</Radio.Group>
			</FieldWithTitle>
		</Form.Item>
	);
};
