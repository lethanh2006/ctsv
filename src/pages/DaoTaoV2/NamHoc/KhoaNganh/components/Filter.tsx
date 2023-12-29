import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import { initHinhThuc, initTrinhDo } from '@/utils/constants';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const FilterKhoaNganh = (props: { width?: number; children?: React.ReactNode; notDefault?: boolean }) => {
	const { record: recKhoa, setRecord: setKhoa, danhSach: danhSachKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh, setRecord: setNganh, danhSach: danhSachNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const [maTrinhDoDaoTao, setTrinhDoDaoTao] = useState<string>(initTrinhDo); // Đại học
	const [maHinhThucDaoTao, setHinhThucDaoTao] = useState<string>(initHinhThuc); // Chính quy
	const [expand, setExpand] = useState(false);
	const width = props.width ?? 250;

	return (
		<Space wrap style={{ marginBottom: 8 }}>
			<Button icon={expand ? <MinusOutlined /> : <PlusOutlined />} type='dashed' onClick={() => setExpand((e) => !e)} />
			{expand ? (
				<>
					<SelectTrinhDo
						value={maTrinhDoDaoTao}
						onChange={(val) => setTrinhDoDaoTao(val as string)}
						allowClear
						placeholder='Lọc theo trình độ đào tạo'
						style={{ width: 200 }}
						selectMa
					/>
					<SelectHinhThuc
						value={maHinhThucDaoTao}
						onChange={(val) => setHinhThucDaoTao(val as string)}
						allowClear
						placeholder='Lọc theo hình thức đào tạo'
						style={{ width: 200 }}
						selectMa
					/>
				</>
			) : null}

			<SelectKhoaSinhVien
				value={recKhoa?.ma}
				onChange={(val) => setKhoa(danhSachKhoa.find((item) => item.ma === val))}
				allowClear
				condition={{ maHinhThucDaoTao, maTrinhDoDaoTao }}
				style={{ width: 200 }}
				selectMa
				isSetRecord={!recKhoa?.ma && !props.notDefault}
			/>

			<SelectNganhCoSo
				value={recNganh?.ma}
				onChange={(val) => setNganh(danhSachNganh.find((item) => item.ma === val))}
				allowClear
				style={{ width }}
				selectMa
				maKhoaSinhVien={recKhoa?.ma}
				hasDefault={!props.notDefault}
			/>

			{props.children}
		</Space>
	);
};

export default FilterKhoaNganh;
