import { ip3 } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';
import axios from 'axios';

export const getTemplateImportCheDoSinhVien = (idChinhSach: string) => {
	return axios.get(`${ip3}/che-do-sinh-vien/${idChinhSach}/import-template`, { responseType: 'arraybuffer' });
};

export const importCheDoSinhVien = (idCheDo: string, payload: { file: any }) => {
	const formData = buildFormData(payload);
	return axios.post(`${ip3}/quyet-dinh-cdsv/import/che-do-sinh-vien/${idCheDo}`, formData);
};
