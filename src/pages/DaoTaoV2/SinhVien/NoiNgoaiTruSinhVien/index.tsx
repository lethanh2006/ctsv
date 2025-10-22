import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ENoiNgoaiTru } from '@/services/DaoTaoV2/SinhVien/constant';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const NoiNgoaiTruSinhVienPage = () => {
	const { getModel, page, limit } = useModel('daotaov2.sinhvien.noingoaitru');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<SinhVien.INoiTruSinhVien>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'maKyHoc',
			width: 90,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			width: 90,
			dataIndex: 'tinhTrang',
			filterType: 'select',
			filterData: Object.values(ENoiNgoaiTru),
			sortable: true,
		},
		{
			title: 'Thời gian',
			width: 100,
			dataIndex: 'thoiGianKhaiBao',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Địa chỉ',
			width: 200,
			dataIndex: 'diaChi',
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				getData={() =>
					getModel(undefined, undefined, undefined, undefined, undefined, `page/sso-id/${recSinhVien?.ssoId}`)
				}
				modelName='daotaov2.sinhvien.noingoaitru'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default NoiNgoaiTruSinhVienPage;
