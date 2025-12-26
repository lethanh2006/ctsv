import { Card } from 'antd';
import './components/style.less';

const TrangChu = () => {
	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>CO-CURRICULAR ACTIVITIES</h1>
				{/* <h2 className='sub-title'>HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH</h2> */}

				{/* <h1 className='title'>PHÂN HỆ CÔNG TÁC SINH VIÊN</h1>
				<h2 className='sub-title'>HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH - {unitName.toUpperCase()}</h2> */}
			</div>
		</Card>
	);
};

export default TrangChu;
