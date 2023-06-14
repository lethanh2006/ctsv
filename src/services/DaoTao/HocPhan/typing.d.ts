declare module HocPhan {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    tenTiengAnh?: string;
    donVi: string;
    createdAt?: string;
    updatedAt?: string;
    active: boolean;
  }
}
