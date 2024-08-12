import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import { thongKeLuotGiaiQuyetDon } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeDichVuHanhChinh = () => {
	const [data, setData] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');

	const getData = async () => {
		if (recHocKy?.ma) {
			const res = await thongKeLuotGiaiQuyetDon(recHocKy?.ma);
			debugger;
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	return (
		<Card>
			<Row gutter={[16, 8]}>
				<Col span={24}>
					<SelectHocKy
						style={{ width: 300, marginBottom: 8 }}
						value={recHocKy?._id}
						onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
						isSetRecord
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeDichVuHanhChinh;
