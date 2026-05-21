import React, { useState } from 'react';
import { Button, Modal, Checkbox, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import * as XLSX from 'xlsx';

const EXPORT_OPTIONS = [
    { label: 'Mã phòng', value: 'ma' },
    { label: 'Tên phòng', value: 'ten' },
    { label: 'Mã tòa nhà', value: 'maToaNha' },
    { label: 'Sức chứa', value: 'soLuongToiDa' },
    { label: 'Đang ở', value: 'soLuongHienTai' },
    { label: 'Cách bố trí', value: 'cachBoTri' },
    { label: 'Mô tả', value: 'moTa' },
    { label: 'Mã khoản thu phòng', value: 'maKhoanThuPhong' },
    { label: 'Mã khoản thu cọc', value: 'maKhoanThuCoc' },
    { label: 'Giới tính', value: 'gioiTinh' },
    { label: 'Số lượng tối đa mỗi khoa', value: 'maxPerKhoa' },
    { label: 'Tiện ích', value: 'tienIch' },
];

interface IExportProps {
    getModel: (cond1?: any, cond2?: any, cond3?: any, page?: number, limit?: number) => Promise<any>;
    danhSachTienIchAll: any[];
}

const ExportPhongKTX: React.FC<IExportProps> = ({ getModel, danhSachTienIchAll }) => {
    const [exporting, setExporting] = useState(false);
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [selectedFields, setSelectedFields] = useState<string[]>(EXPORT_OPTIONS.map(opt => opt.value));

    const executeExport = async () => {
        if (selectedFields.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 trường dữ liệu để xuất');
            return;
        }

        setExporting(true);
        try {
            const allData = await getModel(undefined, undefined, undefined, 1, 10000);
            
            const exportData = allData.map((row: any) => {
                const baseRow: any = {};

                if (selectedFields.includes('ma')) baseRow['Mã phòng'] = row.ma;
                if (selectedFields.includes('ten')) baseRow['Tên phòng'] = row.ten;
                if (selectedFields.includes('maToaNha')) baseRow['Mã tòa nhà'] = row.maToaNha;
                if (selectedFields.includes('soLuongToiDa')) baseRow['Sức chứa'] = row.soLuongToiDa;
                if (selectedFields.includes('soLuongHienTai')) baseRow['Đang ở'] = row.soLuongHienTai;
                if (selectedFields.includes('cachBoTri')) baseRow['Cách bố trí'] = row.cachBoTri;
                if (selectedFields.includes('moTa')) baseRow['Mô tả'] = row.moTa;
                if (selectedFields.includes('maKhoanThuPhong')) baseRow['Mã khoản thu phòng'] = row.maKhoanThuPhong;
                if (selectedFields.includes('maKhoanThuCoc')) baseRow['Mã khoản thu cọc'] = row.maKhoanThuCoc;
                if (selectedFields.includes('gioiTinh')) baseRow['Giới tính'] = row?.dangKyKyTucXaRule?.gioiTinh || '';
                if (selectedFields.includes('maxPerKhoa')) baseRow['Số lượng tối đa mỗi khoa'] = row?.dangKyKyTucXaRule?.maxPerKhoa || '';

                if (selectedFields.includes('tienIch') && row.danhSachTienIch && Array.isArray(row.danhSachTienIch)) {
                    row.danhSachTienIch.forEach((tienIch: any, idx: number) => {
                        const fullTienIch = danhSachTienIchAll?.find((item: any) => item.ma === tienIch.maDanhMucTienIch);
                        baseRow[`Tiện ích ${idx + 1}`] = fullTienIch?.ten || '';
                    });
                }

                return baseRow;
            });

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'DanhSachPhong');
            XLSX.writeFile(wb, 'Danh sách phòng KTX.xlsx');
            
            message.success('Xuất dữ liệu thành công');
            setIsExportModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi xuất dữ liệu');
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <ButtonExtend
                className='btn-export'
                icon={<ExportOutlined />}
                onClick={() => setIsExportModalVisible(true)}
                loading={exporting}
            >
                Xuất dữ liệu
            </ButtonExtend>

            <Modal
                title="Tùy chọn trường xuất dữ liệu"
                open={isExportModalVisible}
                onCancel={() => !exporting && setIsExportModalVisible(false)}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={() => setIsExportModalVisible(false)} 
                        disabled={exporting}
                    >
                        Hủy
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        loading={exporting} 
                        onClick={executeExport}
                        icon={<ExportOutlined />}
                    >
                        Tải xuống dữ liệu
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: 12, color: '#888' }}>
                    Chọn các trường dữ liệu mà bạn muốn trích xuất:
                </div>
                <Checkbox.Group
                    options={EXPORT_OPTIONS}
                    value={selectedFields}
                    onChange={(checkedValues) => setSelectedFields(checkedValues as string[])}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
                />
            </Modal>
        </>
    );
};

export default ExportPhongKTX;