import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';

interface StudentSelectModalProps {
    open: boolean;
    onCancel: () => void;
    activeSemester?: KyTucXa.IDanhSachMienKTX;
    existingStudents: any[];
    onOk: (newStudents: { maSinhVien: string; hoTen: string; khoaSinhVien: string }[]) => Promise<void>;
}

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
    open,
    onCancel,
    activeSemester,
    existingStudents,
    onOk,
}) => {
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedUsers([]);
        }
    }, [open]);

    const customImportConfig = {
        onDownloadTemplate: () => {
            const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên']];
            const worksheet = XLSX.utils.aoa_to_sheet(headers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fileDownload(blob, 'Mẫu nhập danh sách sinh viên miễn KTX.xlsx');
        },
        onImport: (file: File): Promise<any[]> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = e.target?.result;
                        const workbook = XLSX.read(data, { type: 'array' });
                        const ws = workbook.Sheets[workbook.SheetNames[0]];
                        const sheetData: any[] = XLSX.utils.sheet_to_json(ws);
                        const parsed = sheetData
                            .map((row: any) => {
                                const code = row['Mã sinh viên']?.toString()?.trim() || '';
                                const fullname = row['Họ tên']?.toString()?.trim() || '';
                                const khoa = row['Khoá sinh viên']?.toString()?.trim() || '';
                                return {
                                    code,
                                    username: code,
                                    fullname,
                                    khoaSinhVien: khoa,
                                    vaiTro: EVaiTroKhaoSat.SINH_VIEN,
                                };
                            })
                            .filter((item) => item.code);
                        resolve(parsed);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = (err) => reject(err);
                reader.readAsArrayBuffer(file);
            });
        },
    };

    const handleSetSelectedUsers = (val: any[]) => {
        const list = (val || []).map((u) => {
            const code = u.code || u.username;
            const existing = existingStudents.find((su) => su.code === code);
            return {
                ...u,
                code,
                username: code,
                fullname: u.fullname || u.hoTen || existing?.fullname || '',
                khoaSinhVien: u.khoaSinhVien || u.maKhoaSinhVien || u.tenKhoaSinhVien || existing?.khoaSinhVien || '',
                _id: existing?._id,
                trangThaiMinhChung: existing?.trangThaiMinhChung,
                ghiChuDuyet: existing?.ghiChuDuyet || '',
                urlMinhChung: existing?.urlMinhChung || '',
            };
        });
        setSelectedUsers(list);
    };

    const handleConfirm = async () => {
        const newStudents = (selectedUsers ?? [])
            .map((u: any) => ({
                maSinhVien: u.code,
                hoTen: u.fullname || '',
                khoaSinhVien: u.khoaSinhVien || u.maKhoaSinhVien || u.tenKhoaSinhVien || '',
            }))
            .filter((item) => item.maSinhVien);

        setSubmitting(true);
        try {
            await onOk(newStudents);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title={
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                    Chọn/nhập danh sách sinh viên miễn KTX – HK {activeSemester?.maHocKy || ''}
                </span>
            }
            width={950}
            footer={null}
            destroyOnClose
        >
            <div style={{ padding: '8px 0' }}>
                <TableSelectUser
                    type={EVaiTroKhaoSat.SINH_VIEN}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={handleSetSelectedUsers}
                    customImport={customImportConfig}
                    customStudentColumn={{
                        title: 'Khoá sinh viên',
                        dataIndex: 'khoaSinhVien',
                    }}
                    singleTable={true}
                />
                <div style={{ textAlign: 'right', marginTop: 20 }}>
                    <Button
                        onClick={handleConfirm}
                        loading={submitting}
                        type="primary"
                        style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6, padding: '0 24px' }}
                    >
                        Chọn xong
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
