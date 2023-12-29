import { Collapse } from 'antd';
import { useIntl } from 'umi';
import SinhVienCanhBaoTable from './Table';

const SinhVienHocVuPage = () => {
	const intl = useIntl();

	return (
		<Collapse>
			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.hoctap' })} key='1'>
				<SinhVienCanhBaoTable />
			</Collapse.Panel>

			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.thoihoc' })} key='2'>
				<SinhVienCanhBaoTable isThoiHoc />
			</Collapse.Panel>
		</Collapse>
	);
};

export default SinhVienHocVuPage;
