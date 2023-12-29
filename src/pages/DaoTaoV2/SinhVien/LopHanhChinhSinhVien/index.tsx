import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { useModel } from 'umi';

const LopHanhChinhSinhVien = () => {
	const { page, limit } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: 'Mã lớp hành chính',
			width: 120,
			render: (_, rec) => rec.lopHanhChinh?.ten,
		},
		{
			title: 'Sĩ số',
			align: 'center',
			width: 80,
			render: (_, rec) => rec.lopHanhChinh?.siSo,
		},
		{
			title: 'Cố vấn học tập',
			width: 220,
			render: (_, rec) =>
				`${rec.lopHanhChinh?.nhanSu?.hoDem ?? ''} ${rec.lopHanhChinh?.nhanSu?.ten ?? ''} - ${
					rec.lopHanhChinh?.nhanSu?.maCanBo ?? ''
				}`,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ sinhVienSsoId: recSinhVien?.ssoId }}
				dependencies={[page, limit, recSinhVien?.ssoId]}
				modelName='namhoc.sinhvienlophanhchinh'
				buttons={{ create: false, reload: false }}
				hideTotal
				hideCard
			/>
		</>
	);
};

export default LopHanhChinhSinhVien;
