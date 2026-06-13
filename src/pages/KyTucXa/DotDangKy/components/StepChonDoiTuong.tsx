import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import KhoaToaConfigTable from '@/pages/KyTucXa/DotDangKy/components/KhoaToaConfigTable';
import RoomTable from '@/pages/KyTucXa/DotDangKy/components/RoomTable';
import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import SinhVienDangKySection from '@/pages/KyTucXa/DotDangKy/components/SinhVienDangKySection';
import rules from '@/utils/rules';
import type { FormInstance } from 'antd';
import { Col, Form, Row } from 'antd';
import React from 'react';
import { useModel } from 'umi';

interface StepChonDoiTuongProps {
	form: FormInstance;
	loaiDot: string;
	selectedKhoaNganh: string[];
	setSelectedKhoaNganh: (value: string[]) => void;
	selectedKhoaRows: Array<{
		ma: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: { ten?: string };
	}>;
	khoaToaConfig: Record<string, string[]>;
	setKhoaToaConfig: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
	selectedToaNhaIds: string[];
	setSelectedToaNhaIds: (value: string[]) => void;
	selectedPhongIds: string[];
	setSelectedPhongIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const StepChonDoiTuong: React.FC<StepChonDoiTuongProps> = ({
	form,
	loaiDot,
	selectedKhoaNganh,
	setSelectedKhoaNganh,
	selectedKhoaRows,
	khoaToaConfig,
	setKhoaToaConfig,
	selectedToaNhaIds,
	setSelectedToaNhaIds,
	selectedPhongIds,
	setSelectedPhongIds,
}) => {
	const { record, visibleForm, edit } = useModel('kytucxa.dotdangky');
	const { danhSach: allPhong } = useModel('theodoitaisanvattu.phong');

	const selectedPhongRowKeys = allPhong
		.filter((phong: any) => selectedPhongIds.includes(phong.ma))
		.map((phong: any) => phong._id);

	return (
		<>
			<Row gutter={[12, 0]}>
				{loaiDot === 'Theo khoa' ? (
					<Col xs={24}>
						<Form.Item name='maKhoaNganh' label='Khóa sinh viên áp dụng' rules={[...rules.required]}>
							<SelectKhoaSinhVien
								multiple
								selectMa
								allowClear
								placeholder='Chọn khóa sinh viên'
								onChange={(value) => {
									const nextValue = Array.isArray(value) ? (value as string[]) : [];
									setSelectedKhoaNganh(nextValue);
									form.setFieldValue('maKhoaNganh', nextValue);
								}}
							/>
						</Form.Item>
						{selectedKhoaRows.length > 0 && (
							<KhoaToaConfigTable
								selectedKhoaNganh={selectedKhoaRows}
								value={khoaToaConfig}
								onChange={(nextValue) => setKhoaToaConfig(nextValue)}
							/>
						)}
					</Col>
				) : null}
				{loaiDot === 'Theo danh sách' ? (
					<Col xs={24} md={12}>
						<Form.Item name='danhSachToaNha' label='Tòa nhà' rules={[...rules.required]}>
							<SelectToaNha
								multiple
								selectMa
								allowClear
								onChange={(ids) => {
									const nextValue = Array.isArray(ids) ? ids : ids ? [ids] : [];
									setSelectedToaNhaIds(nextValue);
									form.setFieldValue('danhSachToaNha', nextValue);
									if (edit) {
										setSelectedPhongIds((prev) => {
											const filtered = prev.filter((phongMa) => {
												const phong = allPhong.find((p: any) => p.ma === phongMa);
												if (!phong) return true;
												const maToaNha = phong.maToaNha ?? phong.toaNha?.ma;
												return maToaNha && nextValue.includes(maToaNha);
											});
											if (JSON.stringify(filtered) === JSON.stringify(prev)) return prev;
											return filtered;
										});
									}
								}}
							/>
						</Form.Item>
					</Col>
				) : null}
			</Row>

			{loaiDot === 'Theo danh sách' && selectedToaNhaIds.length ? (
				<div style={{ marginTop: 12 }}>
					<RoomTable
						toaNhaIds={selectedToaNhaIds}
						selectedRowKeys={selectedPhongRowKeys}
						onChangeSelectedKeys={(keys) => {
							setSelectedPhongIds(
								keys
									.map((key) => allPhong.find((phong: any) => phong._id === key)?.ma)
									.filter((ma): ma is string => !!ma),
							);
						}}
					/>
				</div>
			) : null}
			{loaiDot === 'Theo danh sách' ? (
				<SinhVienDangKySection form={form} dotId={record?._id} visible={visibleForm} />
			) : null}
		</>
	);
};

export default StepChonDoiTuong;
