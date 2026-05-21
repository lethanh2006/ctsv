import React from 'react';
import { Upload, message } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import * as XLSX from 'xlsx';

interface IImportProps {
    onSuccessReload: () => void;
}

const ImportPhongKTX: React.FC<IImportProps> = ({ onSuccessReload }) => {
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
                            ma: row?.ma?.toString() || row?.['Mã phòng']?.toString() || row?.['Mã']?.toString() || '',
                            soLuongToiDa: Number(row?.soLuongToiDa ?? row?.['Sức chứa'] ?? 0),
                            cachBoTri: row?.cachBoTri?.toString() || row?.['Cách bố trí']?.toString() || '',
                            moTa: row?.moTa?.toString() || row?.['Mô tả']?.toString() || '',
                            maKhoanThuPhong: row?.maKhoanThuPhong?.toString() || row?.['Mã khoản thu phòng']?.toString() || '',
                            maKhoanThuCoc: row?.maKhoanThuCoc?.toString() || row?.['Mã khoản thu cọc']?.toString() || '',
                            gioiTinh: row?.gioiTinh?.toString() || row?.['Giới tính']?.toString() || 'Nam',
                            maxPerKhoa: Number(row?.maxPerKhoa ?? row?.['Số lượng tối đa mỗi khoa'] ?? 0),
                        })).filter((item: any) => item.ma);

                        await axios.post(`${ipCsvc}/phong/ktx/import`, payload);
                        onSuccess('Ok');
                        message.success('Nhập dữ liệu thành công');
                        
                        onSuccessReload();
                    } catch (err) {
                        onError(err);
                        message.error('Lỗi khi nhập dữ liệu');
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                onError(new Error('FileReader not supported'));
                message.error('Trình duyệt không hỗ trợ đọc file');
            }
        }
    };

    return (
        <Upload {...uploadProps}>
            <ButtonExtend className='btn-import' icon={<ImportOutlined />}>
                Nhập dữ liệu
            </ButtonExtend>
        </Upload>
    );
};

export default ImportPhongKTX;