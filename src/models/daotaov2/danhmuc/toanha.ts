import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<ToaNha.IRecord>('toa-nha');

	return {
		...objInit,
	};
};
