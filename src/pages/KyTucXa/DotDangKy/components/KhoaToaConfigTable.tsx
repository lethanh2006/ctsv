import SelectToaNha from '@/pages/KyTucXa/DotDangKy/components/SelectToaNha';
import { Table } from 'antd';

const KhoaToaConfigTable = (props: {
	selectedKhoaNganh: Array<{
		ma: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: {
			ten?: string;
		};
	}>;
	value?: Record<string, string[]>;
	onChange?: (nextValue: Record<string, string[]>) => void;
}) => {
	const { selectedKhoaNganh, value = {}, onChange } = props;

	const updateValue = (maKhoaSinhVien: string, danhSachToaNha: string[]) => {
		const nextValue = {
			...value,
			[maKhoaSinhVien]: danhSachToaNha,
		};
		onChange?.(nextValue);
	};

	return (
		<Table
			style={{ marginTop: 12 }}
			size='small'
			pagination={false}
			rowKey={(record) => record.maKhoaSinhVien ?? record.ma}
			dataSource={selectedKhoaNganh}
			columns={[
				{
					title: 'Khóa ngành',
					dataIndex: 'maKhoaSinhVien',
					width: 180,
					render: (_value, record) => record?.khoaSinhVien?.ten ?? record?.maKhoaSinhVien ?? record?.ma ?? '-',
				},
				{
					title: 'Tòa nhà áp dụng',
					dataIndex: 'danhSachToaNha',
					render: (_value, record: { maKhoaSinhVien?: string; ma?: string }) => {
						const maKhoaSinhVien = record?.maKhoaSinhVien ?? record?.ma ?? '';
						return (
							<SelectToaNha
								multiple
								selectMa
								allowClear
								value={value?.[maKhoaSinhVien] ?? []}
								onChange={(ids) => updateValue(maKhoaSinhVien, Array.isArray(ids) ? ids : ids ? [ids] : [])}
							/>
						);
					},
				},
			]}
		/>
	);
};

export default KhoaToaConfigTable;
