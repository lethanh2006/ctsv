import { unitName } from '@/services/base/constant';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';
import './components/style.less';

const TrangChu = () => {
	const intl = useIntl();

	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>{intl.formatMessage({ id: 'trangchu.phanhe.congtacsinhvien' })}</h1>
				<h2 className='sub-title'>
					{intl.formatMessage({ id: 'trangchu.hethong.phanmem.chidaodieuhanh' }, { unitName: unitName.toUpperCase() })}
				</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
