import TableBase from '@/components/Table';
import { type ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ThongTinThanhToan from './components/ThongTinThanhToan';
import columns from './components/columns';

const CongNoSinhVienPage = (props: { sinhVienSsoId?: string }) => {
	const { setRecord, getModel, record, page, limit } = useModel('taichinh.chitietthu');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { sinhVienSsoId } = props;

	const getData = () =>
		sinhVienSsoId && getModel(undefined, undefined, undefined, undefined, undefined, `admin/cong-no/${sinhVienSsoId}`);

	const handleDetail = (rec: ChiTietThu.Record) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	return (
		<>
			<TableBase
				columns={[
					...columns,
					{
						title: 'Thao tác',
						align: 'center',
						width: 60,
						fixed: 'right',
						render: (val, rec) => (
							<>
								<Tooltip title='Thông tin thanh toán'>
									<Button onClick={() => handleDetail(rec)} type='link'>
										<EyeOutlined />
									</Button>
								</Tooltip>
							</>
						),
					},
				]}
				getData={getData}
				buttons={{ create: false }}
				dependencies={[page, limit, sinhVienSsoId]}
				modelName='taichinh.chitietthu'
				hideCard
			/>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
		</>
	);
};

export default CongNoSinhVienPage;
