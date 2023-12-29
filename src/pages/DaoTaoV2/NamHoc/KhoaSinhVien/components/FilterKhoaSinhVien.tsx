import SelectHinhThuc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectTrinhDo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import { initHinhThuc, initTrinhDo } from '@/utils/constants';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectKhoaSinhVien from './Select';

const FilterKhoaSinhVien = (props: {
	width?: number;
	allowClear?: boolean;
	hideExpand?: boolean;
	hasSelectNganh?: boolean;
}) => {
	const { record: recKhoa, danhSach: danhSachKhoa, setRecord: setKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh, danhSach: danhSachNganh, setRecord: setNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const [maTrinhDoDaoTao, setTrinhDoDaoTao] = useState<string>(initTrinhDo); // Đại học
	const [maHinhThucDaoTao, setHinhThucDaoTao] = useState<string>(initHinhThuc); // Chính quy
	const [visibleOption, setVisibleOption] = useState(false);
	const width = props.width ?? 200;

	return (
		<Space wrap>
			{visibleOption ? (
				<>
					<Tooltip title='Ẩn bộ lọc'>
						<Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type='dashed' />
					</Tooltip>
					<SelectTrinhDo
						style={{ width }}
						allowClear
						value={maTrinhDoDaoTao}
						onChange={(val) => setTrinhDoDaoTao(val as string)}
						selectMa
					/>
					<SelectHinhThuc
						style={{ width }}
						allowClear
						value={maHinhThucDaoTao}
						onChange={(val) => setHinhThucDaoTao(val as string)}
						selectMa
					/>
				</>
			) : !props.hideExpand ? (
				<Tooltip title='Mở rộng bộ lọc'>
					<Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type='dashed' />
				</Tooltip>
			) : null}

			<SelectKhoaSinhVien
				style={{ width: 200 }}
				allowClear={props.allowClear}
				condition={{ maHinhThucDaoTao, maTrinhDoDaoTao }}
				value={recKhoa?.ma}
				onChange={(val) => setKhoa(danhSachKhoa.find((item) => item.ma === val))}
				isSetRecord={!!maHinhThucDaoTao || !!maTrinhDoDaoTao}
				selectMa
			/>

			{props.hasSelectNganh ? (
				<SelectNganhCoSo
					style={{ width: 250 }}
					allowClear={props.allowClear}
					maKhoaSinhVien={recKhoa?.ma}
					value={recNganh?.ma}
					selectMa
					onChange={(val) => setNganh(danhSachNganh.find((item) => item.ma === val))}
				/>
			) : null}
		</Space>
	);
};

export default FilterKhoaSinhVien;
