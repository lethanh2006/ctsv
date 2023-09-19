import { Descriptions } from 'antd';
import { useModel } from 'umi';

const ViewChiTiet = (props: { setVisible?: any }) => {
	const { record } = useModel('daotao.lophanhchinh');

	return (
		<>
			<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered>
				<Descriptions.Item label='Tên lớp hành chính'>{record?.ten ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Khóa sinh viên'>{record?.khoaSinhVien?.ten ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Ngành'>{record?.nganh?.ten ?? ''}</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewChiTiet;
