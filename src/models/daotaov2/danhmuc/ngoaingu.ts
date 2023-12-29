import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<NgoaiNgu.IRecord>('ngon-ngu');

	return {
		...objInit,
	};
};
