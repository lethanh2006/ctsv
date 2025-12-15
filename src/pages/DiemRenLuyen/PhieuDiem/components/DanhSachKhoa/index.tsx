import { useModel } from 'umi';
import { useEffect } from 'react';
import { IColumn } from '@/components/Table/typing';
import TableStaticData from '@/components/Table/TableStaticData';

const DanhSachKhoa = () => {
	const { getAllModel, danhSach, setRecord, record } = useModel('daotaov2.khoasinhvien.khoasinhvien');

	useEffect(() => {
		getAllModel(true);
	}, []);

	const onCell = (recordVal: KhoaSinhVien.IRecord) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal?._id === record?._id ? 700 : 600,
			color: recordVal?._id === record?._id ? '#1890ff' : undefined,
			backgroundColor: recordVal?._id === record?._id ? '#f0f0f0' : undefined,
		},
	});

	const columns: IColumn<KhoaSinhVien.IRecord>[] = [
		{
			title: `Tên khoá sinh viên`,
			dataIndex: 'ten',
			width: 200,
			onCell,
		},
	];

	return (
		<div style={{ paddingTop: 3 }}>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ scrol: { x: 350 }, pagination: false }} />
		</div>
	);
};
export default DanhSachKhoa;
