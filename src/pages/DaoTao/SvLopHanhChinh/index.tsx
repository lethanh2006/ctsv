import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const SinhVienLopHanhChinh = (props: { hideCard?: boolean }) => {
	const { getModel, page, limit, deleteModel } = useModel('daotao.sinhvienlophanhchinh');
	const { record: recLopHanhChinh } = useModel('daotao.lophanhchinh');
	const { handleView: handleViewSinhVien } = useModel('sinhvien.sinhvien');
	const { hideCard } = props;
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: LopHanhChinh.IRecordSinhVien) => ({
		onClick: () => {
			setSinhVienSsoId(rec.sinhVien?.ssoId);
			handleViewSinhVien();
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: 'Mã sinh viên',
			width: 100,
			render: (val, rec) => rec?.sinhVien?.ma,
			align: 'center',
			onCell,
		},
		{
			title: 'Họ tên',
			width: 150,
			dataIndex: 'sinhVienSsoId',
			render: (val, rec) => rec?.sinhVien?.ten,
			onCell,
		},
		{
			title: 'CCCD',
			width: 100,
			render: (val, rec) => rec?.sinhVien?.cccd,
			onCell,
		},
		{
			title: 'SĐT',
			width: 100,
			render: (val, rec) => rec?.sinhVien?.soDienThoai && formatPhoneNumber(rec?.sinhVien?.soDienThoai),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecordSinhVien) => (
				<>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ lopHanhChinhId: recLopHanhChinh?._id }))}
							title='Bạn có chắc chắn muốn xóa sinh viên khỏi lớp?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, recLopHanhChinh?._id]}
				params={{ lopHanhChinhId: recLopHanhChinh?._id }}
				modelName='daotao.sinhvienlophanhchinh'
				title='Sinh viên lớp hành chính'
				Form={Form}
				hideCard={hideCard}
			/>

			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} hasEdit />
		</>
	);
};

export default SinhVienLopHanhChinh;
