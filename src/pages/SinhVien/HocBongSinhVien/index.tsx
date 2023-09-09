import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { tienVietNam } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';

const HocBongSinhVienPage = () => {
	const { page, limit } = useModel('sinhvien.hocbong');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	const columns: IColumn<SinhVien.IHocBongSinhVien>[] = [
		{
			title: 'Tên học bổng',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Đơn vị tài trợ',
			width: 150,
			dataIndex: 'donViTaiTro',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Thời gian trao',
			width: 120,
			dataIndex: 'thoiGianTraoTangHocBong',
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Loại học bổng',
			width: 120,
			dataIndex: 'loaiHocBongId',
			render: (val, rec) => rec.loaiHocBong?.ten,
		},
		{
			title: 'Giá trị học bổng',
			width: 120,
			dataIndex: 'giaTriHocBong',
			filterType: 'number',
			sortable: true,
			render: (val) => val && tienVietNam(val),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				params={{ sinhVienSsoId: recSinhVien?.ssoId }}
				modelName='sinhvien.hocbong'
				hideCard
			/>
		</>
	);
};

export default HocBongSinhVienPage;
