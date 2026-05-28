import React from 'react';
import { Upload, message } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import * as XLSX from 'xlsx';
import { useIntl } from 'umi';

interface IImportProps {
    onSuccessReload: () => void;
}

const ImportPhongKTX: React.FC<IImportProps> = ({ onSuccessReload }) => {
    const intl = useIntl();
    
    const uploadProps = {
        name: 'file',
        showUploadList: false,
        customRequest: async (options: any) => {
            const { file, onSuccess, onError } = options;
            
            if (typeof FileReader !== 'undefined') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = e.target?.result;
                        const workbook = XLSX.read(data, { type: 'array' });
                        const ws = workbook.Sheets[workbook.SheetNames[0]];
                        const sheetData = XLSX.utils.sheet_to_json(ws);
                        
                        const payload = sheetData.map((row: any) => ({
                            ma: row?.ma?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.maPhong' })]?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.ma' })]?.toString() || '',
                            soLuongToiDa: Number(row?.soLuongToiDa ?? row?.[intl.formatMessage({ id: 'kytucxa.phong.sucChua' })] ?? 0),
                            cachBoTri: row?.cachBoTri?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.cachBoTri' })]?.toString() || '',
                            moTa: row?.moTa?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.moTa' })]?.toString() || '',
                            maKhoanThuPhong: row?.maKhoanThuPhong?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.maKhoanThuPhong' })]?.toString() || '',
                            maKhoanThuCoc: row?.maKhoanThuCoc?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.maKhoanThuCoc' })]?.toString() || '',
                            gioiTinh: row?.gioiTinh?.toString() || row?.[intl.formatMessage({ id: 'kytucxa.phong.gioiTinh' })]?.toString() || 'Nam',
                            maxPerKhoa: Number(row?.maxPerKhoa ?? row?.[intl.formatMessage({ id: 'kytucxa.phong.soLuongToiDaMoiKhoa' })] ?? 0),
                        })).filter((item: any) => item.ma);

                        await axios.post(`${ipCsvc}/phong/ktx/import`, payload);
                        onSuccess('Ok');
                        message.success(intl.formatMessage({ id: 'kytucxa.phong.nhapDuLieu.thanhCong' }));
                        
                        onSuccessReload();
                    } catch (err) {
                        onError(err);
                        message.error(intl.formatMessage({ id: 'kytucxa.phong.nhapDuLieu.thatBai' }));
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                onError(new Error('FileReader not supported'));
                message.error(intl.formatMessage({ id: 'kytucxa.phong.nhapDuLieu.trinhDuyetKhongHoTro' }));
            }
        }
    };

    return (
        <Upload {...uploadProps}>
            <ButtonExtend className='btn-import' icon={<ImportOutlined />}>
                {intl.formatMessage({ id: 'kytucxa.phong.nhapDuLieu' })}
            </ButtonExtend>
        </Upload>
    );
};

export default ImportPhongKTX;