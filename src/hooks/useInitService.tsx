import axios from '@/utils/axios';
import { ipQldt } from '@/utils/ip';

const useInitService = (url: string, ip?: string) => {
  const getService = (payload: { page: number; limit: number; condition?: any }, path?: string) => {
    const finalPath = path ? `${ip ?? ipQldt}/${url}/${path}` : `${ip ?? ipQldt}/${url}`;
    return axios.get(finalPath, { params: payload });
  };

  const postService = (payload: any) => {
    return axios.post(`${ip ?? ipQldt}/${url}`, payload);
  };

  const putService = (id: string | number, payload: any) => {
    return axios.put(`${ip ?? ipQldt}/${url}/${id}`, payload);
  };

  const deleteService = (id: string | number) => {
    return axios.delete(`${ip ?? ipQldt}/${url}/${id}`);
  };

  const getAllService = (payload?: { condition?: any; sort?: any }) => {
    return axios.get(`${ip ?? ipQldt}/${url}/many`, { params: payload });
  };

  const getByIdService = (id: string | number) => {
    return axios.get(`${ip ?? ipQldt}/${url}/${id}`);
  };

  const getImportHeaders = () => {
    return axios.get(`${ip ?? ipQldt}/${url}/import-header`);
  };

  const postValidateImport = (payload: any) => {
    return axios.post(`${ip ?? ipQldt}/${url}/validate-import`, payload);
  };

  const postExecuteImport = (payload: any) => {
    return axios.post(`${ip ?? ipQldt}/${url}/execute-import`, payload);
  };

  return {
    getService,
    getByIdService,
    postService,
    putService,
    deleteService,
    getAllService,
    getImportHeaders,
    postValidateImport,
    postExecuteImport,
  };
};

export default useInitService;
