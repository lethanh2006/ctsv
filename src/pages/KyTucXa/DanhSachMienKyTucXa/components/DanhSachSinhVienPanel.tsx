import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Empty, Tag, Popconfirm, Modal, Input, message, Alert, Tooltip, Form, Select, Space } from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    UploadOutlined,
    EditOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import TableStaticData from '@/components/Table/TableStaticData';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiMienDangKyKTX, transTrangThaiMienDangKyKTX } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';

interface DanhSachSinhVienPanelProps {
    activeSemester?: KyTucXa.IDanhSachMienKTX;
    danhSachHocKy: KyTucXa.IDanhSachMienKTX[];
    selectedSemesterId?: string;
    onSelectSemester: (id: string) => void;
    loadingSemesters?: boolean;
    onAddSemester: () => void;
    onEditSemester: (item: KyTucXa.IDanhSachMienKTX) => void;
    onDeleteSemester: (id: string) => void;
}

export const DanhSachSinhVienPanel: React.FC<DanhSachSinhVienPanelProps> = ({
    activeSemester,
    danhSachHocKy,
    selectedSemesterId,
    onSelectSemester,
    loadingSemesters,
    onAddSemester,
    onEditSemester,
    onDeleteSemester,
}) => {
    const {
        postMienDangKySinhVien,
        postDuyet,
        postTuChoi,
        deleteSinhVien,
        getSinhVien,
        putDonMienKTX
    } = useModel('kytucxa.danhsachmienkytucxa');
    const { getAllModel: getAllCanBo } = useModel('tochucnhansu.nhansu');

    const [students, setStudents] = useState<any[]>([]);
    const [approverNames, setApproverNames] = useState<Record<string, string>>({});
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [actionType, setActionType] = useState<'duyet' | 'tuchoi' | 'upload'>('duyet');
    const [ghiChuDuyet, setGhiChuDuyet] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [submittingUpload, setSubmittingUpload] = useState(false);
    const [uploadForm] = Form.useForm();

    const fetchStudents = async (id: string) => {
        setLoadingStudents(true);
        try {
            const res = await getSinhVien(id);
            const rawData = res?.data?.data?.result || res?.data?.data || res?.data || [];
            const data = Array.isArray(rawData) ? rawData : [];
            const list = data.map((item: any) => {
                let trangThaiMinhChung = item.trangThaiMinhChung;
                if (trangThaiMinhChung === 'Đã duyệt') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.DA_DUYET;
                } else if (trangThaiMinhChung === 'Chờ duyệt') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.CHO_DUYET;
                } else if (trangThaiMinhChung === 'Từ chối') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.TU_CHOI;
                }
                return {
                    _id: item._id,
                    code: item.maSinhVien,
                    username: item.maSinhVien,
                    fullname: item.hoTen || item.tenSinhVien || '',
                    khoaSinhVien: item.khoaSinhVien || '',
                    trangThaiMinhChung,
                    ghiChuDuyet: item.ghiChuDuyet || '',
                    urlMinhChung: item.urlMinhChung || '',
                    ssoId: item.ssoId || '',
                    nguoiDuyet: item.nguoiDuyet || '',
                };
            });
            setStudents(list);
            const ssoIds = Array.from(new Set(list.map((s) => s.nguoiDuyet).filter(Boolean))) as string[];
            if (ssoIds.length > 0) {
                getAllCanBo(
                    false,
                    undefined,
                    undefined,
                    [
                        {
                            field: 'ssoId',
                            operator: EOperatorType.INCLUDE,
                            values: ssoIds,
                        },
                    ],
                ).then((canBos) => {
                    const nameMap: Record<string, string> = {};
                    (canBos || []).forEach((cb: any) => {
                        if (cb.ssoId) {
                            nameMap[cb.ssoId] = `${cb.hoDem ?? ''} ${cb.ten ?? ''}`.trim() || cb.hoTen || '';
                        }
                    });
                    setApproverNames((prev) => ({ ...prev, ...nameMap }));
                }).catch((err) => {
                    console.error('Failed to fetch approver names:', err);
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (activeSemester?._id) {
            fetchStudents(activeSemester._id);
        } else {
            setStudents([]);
        }
    }, [activeSemester?._id]);

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
            const existing = students.find((su) => su.code === code);
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

    const handleAddStudentsDone = async (newStudents: { maSinhVien: string; hoTen: string; khoaSinhVien: string }[]) => {
        if (!activeSemester?._id) return;
        try {
            const existingList = students.map((s) => ({
                maSinhVien: s.code,
                hoTen: s.fullname || '',
                khoaSinhVien: s.khoaSinhVien || '',
            }));
            const existingCodes = new Set(existingList.map((item) => item.maSinhVien));
            const uniqueNewStudents = newStudents.filter((item) => !existingCodes.has(item.maSinhVien));
            const combinedList = [...existingList, ...uniqueNewStudents];
            await postMienDangKySinhVien(activeSemester._id, combinedList);
            message.success('Thêm sinh viên thành công');
            setVisibleSelect(false);
            fetchStudents(activeSemester._id);
        } catch (err) {
            console.error(err);
            message.error('Thêm sinh viên thất bại');
        }
    };

    const onDeleteStudent = async (recordId: string) => {
        if (!activeSemester?._id) return;
        try {
            await deleteSinhVien(recordId);
            message.success('Xóa sinh viên thành công');
            fetchStudents(activeSemester._id);
        } catch (err) {
            console.error(err);
            message.error('Không thể xóa sinh viên');
        }
    };

    const handleActionClick = (record: any, type: 'duyet' | 'tuchoi' | 'upload') => {
        setCurrentRecord(record);
        setActionType(type);
        if (type === 'upload') {
            uploadForm.setFieldsValue({
                urlMinhChung: record.urlMinhChung || undefined
            });
            setUploadModalVisible(true);
        } else {
            setGhiChuDuyet(record.ghiChuDuyet || '');
            setActionModalVisible(true);
        }
    };

    const handleUploadSubmit = async () => {
        if (!currentRecord?._id || !activeSemester?._id) return;
        try {
            const values = await uploadForm.validateFields();
            setSubmittingUpload(true);
            const fileUrl = await buildUpLoadFile(values, 'urlMinhChung');
            if (!fileUrl) {
                message.error('Tải file lên thất bại');
                setSubmittingUpload(false);
                return;
            }

            const payload = {
                danhSachId: activeSemester._id,
                maSinhVien: currentRecord.code,
                ssoId: currentRecord.ssoId,
                hoTen: currentRecord.fullname,
                khoaSinhVien: currentRecord.khoaSinhVien,
                urlMinhChung: fileUrl,
                trangThaiMinhChung: 'Chờ duyệt',
            };

            await putDonMienKTX(currentRecord._id, payload);

            message.success('Cập nhật minh chứng thành công');
            setUploadModalVisible(false);
            setCurrentRecord(null);
            uploadForm.resetFields();
            fetchStudents(activeSemester._id);
        } catch (err: any) {
            console.error(err);
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmittingUpload(false);
        }
    };

    const handleActionSubmit = async () => {
        if (!currentRecord?._id || !activeSemester?._id) return;
        setSubmittingAction(true);
        try {
            await postTuChoi(currentRecord._id, { ghiChuDuyet });
            message.success('Từ chối thành công');
            setActionModalVisible(false);
            setGhiChuDuyet('');
            setCurrentRecord(null);
            fetchStudents(activeSemester._id);
        } catch (err: any) {
            console.error(err);
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleApprove = async (record: any) => {
        if (!record?._id || !activeSemester?._id) return;
        try {
            await postDuyet(record._id);
            message.success('Duyệt thành công');
            fetchStudents(activeSemester._id);
        } catch (err: any) {
            console.error(err);
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const studentColumns = [
        {
            title: 'Mã SV',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullname',
            key: 'fullname',
            width: 180,
        },
        {
            title: 'Khoá SV',
            dataIndex: 'khoaSinhVien',
            key: 'khoaSinhVien',
            width: 100,
        },
        {
            title: 'Minh chứng',
            dataIndex: 'urlMinhChung',
            key: 'urlMinhChung',
            width: 180,
            render: (val: any) => {
                if (val) {
                    const filename = val.substring(val.lastIndexOf('/') + 1) || 'minh-chung.pdf';
                    return (
                        <a href={val} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#125195', fontWeight: 500 }}>
                            {filename}
                        </a>
                    );
                }
                return <span style={{ color: '#bfbfbf' }}>Chưa nộp</span>;
            },
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'trangThaiMinhChung',
        //     key: 'trangThaiMinhChung',
        //     width: 140,
        //     render: (val: any) => {
        //         switch (val) {
        //             case ETrangThaiMienDangKyKTX.CHO_DUYET:
        //                 return <Tag color="warning" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.CHO_DUYET]}</Tag>;
        //             case ETrangThaiMienDangKyKTX.DA_DUYET:
        //                 return <Tag color="success" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.DA_DUYET]}</Tag>;
        //             case ETrangThaiMienDangKyKTX.TU_CHOI:
        //                 return <Tag color="error" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.TU_CHOI]}</Tag>;
        //             default:
        //                 return <Tag color="default" style={{ borderRadius: 4, padding: '2px 8px' }}>Chưa nộp</Tag>;
        //         }
        //     },
        // },
        // {
        //     title: 'Người duyệt',
        //     key: 'nguoiDuyet',
        //     width: 200,
        //     render: (text: any, record: any) => {
        //         const displayName = approverNames[record.nguoiDuyet] || record.nguoiDuyet || 'Admin';
        //         if (record.trangThaiMinhChung === ETrangThaiMienDangKyKTX.DA_DUYET) {
        //             return (
        //                 <span style={{ color: '#262626', fontSize: '13px', fontWeight: 500 }}>
        //                     {displayName} {record.ssoId ? `(SSO: ${record.ssoId})` : ''}
        //                 </span>
        //             );
        //         }
        //         if (record.trangThaiMinhChung === ETrangThaiMienDangKyKTX.TU_CHOI) {
        //             return (
        //                 <span style={{ color: '#262626', fontSize: '13px', fontWeight: 500 }}>
        //                     {displayName} {record.ssoId ? `(SSO: ${record.ssoId})` : ''} {record.ghiChuDuyet ? ` - Lý do: ${record.ghiChuDuyet}` : ''}
        //                 </span>
        //             );
        //         }
        //         return null;
        //     },
        // },
        {
            title: 'Hành động',
            key: 'action',
            width: 80,
            render: (text: any, record: any) => {
                return (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* <Tooltip title="Duyệt">
                            <Popconfirm
                                title="Xác nhận duyệt miễn giảm KTX cho sinh viên này?"
                                onConfirm={() => handleApprove(record)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    style={{ color: '#52c41a' }}
                                    icon={<CheckOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                            <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => handleActionClick(record, 'tuchoi')}
                                icon={<CloseOutlined />}
                            />
                        </Tooltip> */}
                        <Tooltip title="Upload">
                            <Button
                                type="text"
                                size="small"
                                onClick={() => handleActionClick(record, 'upload')}
                                icon={<UploadOutlined />}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Xóa sinh viên này khỏi danh sách miễn?"
                            onConfirm={() => onDeleteStudent(record._id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} size="small" style={{ marginLeft: 'auto' }} />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <Card
            className="table-base-card"
            title="Danh sách miễn KTX"
            style={{
                height: '100%',
                boxShadow: 'none'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <style>{`
                .table-base .header {
                    flex-direction: row !important;
                }
                .table-base .header .extra {
                    order: 1 !important;
                    flex-direction: row !important;
                }
                .table-base .header .semester-selector-wrapper {
                    order: 2 !important;
                    margin-left: 16px !important;
                }
                .table-base .header .action {
                    order: 3 !important;
                    margin-left: auto !important;
                    flex-direction: row !important;
                }
            `}</style>

            <TableStaticData
                data={students}
                columns={studentColumns}
                loading={loadingStudents}
                addStt={true}
                hasTotal={true}
                hasCreate={false}
                onReload={() => activeSemester?._id && fetchStudents(activeSemester._id)}
                otherButtons={[
                    <Button
                        key="them-sinh-vien"
                        type="primary"
                        icon={<PlusOutlined />}
                        disabled={!activeSemester}
                        onClick={() => {
                            setSelectedUsers([]);
                            setVisibleSelect(true);
                        }}
                        style={{
                            borderRadius: 6,
                            backgroundColor: activeSemester ? '#125195' : undefined,
                            borderColor: activeSemester ? '#125195' : undefined,
                        }}
                    >
                        Thêm sinh viên
                    </Button>
                ]}
                otherProps={{
                    rowKey: "code",
                    pagination: { pageSize: 10, showSizeChanger: true },
                    locale: { emptyText: 'Chưa có sinh viên nào trong danh sách' }
                }}
            >
                <div className="semester-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#2e2e2e' }}>
                        Học kỳ:
                    </span>
                    <Select
                        loading={loadingSemesters}
                        value={selectedSemesterId}
                        onChange={onSelectSemester}
                        placeholder="Chọn học kỳ..."
                        style={{ width: 280 }}
                        optionFilterProp="label"
                        showSearch
                    >
                        {danhSachHocKy.map((item) => (
                            <Select.Option key={item._id} value={item._id} label={item.tenHocKy || `Học kỳ ${item.maHocKy}`}>
                                {item.tenHocKy || `Học kỳ ${item.maHocKy}`} (Mã HK: {item.maHocKy})
                            </Select.Option>
                        ))}
                    </Select>

                    {activeSemester && (
                        <Space size={4}>
                            <Tooltip title="Chỉnh sửa thông tin học kỳ">
                                <Button
                                    type="text"
                                    size="small"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, backgroundColor: 'var(--color-info-bg)' }}
                                    icon={<EditOutlined style={{ fontSize: 16, color: 'var(--color-primary)' }} />}
                                    onClick={() => onEditSemester(activeSemester)}
                                />
                            </Tooltip>
                            <Tooltip title="Xóa học kỳ">
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa học kỳ này?"
                                    onConfirm={() => onDeleteSemester(activeSemester._id)}
                                    okText="Có"
                                    cancelText="Không"
                                    placement="bottomLeft"
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
                                        icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )}

                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={onAddSemester}
                        style={{ borderRadius: 6 }}
                    >
                        Thêm học kỳ
                    </Button>
                </div>
            </TableStaticData>

            <Modal
                open={visibleSelect}
                onCancel={() => setVisibleSelect(false)}
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
                            onClick={() => {
                                const newStudents = (selectedUsers ?? []).map((u: any) => ({
                                    maSinhVien: u.code,
                                    hoTen: u.fullname || '',
                                    khoaSinhVien: u.khoaSinhVien || u.maKhoaSinhVien || u.tenKhoaSinhVien || '',
                                })).filter((item) => item.maSinhVien);
                                handleAddStudentsDone(newStudents);
                            }}
                            type="primary"
                            style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6, padding: '0 24px' }}
                        >
                            Chọn xong
                        </Button>
                    </div>
                </div>
            </Modal>


            <Modal
                open={actionModalVisible}
                title={
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                        Từ chối miễn giảm KTX
                    </span>
                }
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={submittingAction}
                onOk={handleActionSubmit}
                onCancel={() => {
                    setActionModalVisible(false);
                    setGhiChuDuyet('');
                    setCurrentRecord(null);
                }}
                okButtonProps={{
                    style: {
                        backgroundColor: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        borderRadius: 6
                    }
                }}
                cancelButtonProps={{
                    style: { borderRadius: 6 }
                }}
            >
                <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 12, fontSize: 14 }}>
                        Sinh viên: <strong>{currentRecord?.fullname || ''}</strong> ({currentRecord?.code || ''})
                    </div>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Lý do từ chối:</div>
                    <Input.TextArea
                        rows={4}
                        value={ghiChuDuyet}
                        onChange={(e) => setGhiChuDuyet(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        style={{ borderRadius: 6 }}
                    />
                </div>
            </Modal>

            <Modal
                open={uploadModalVisible}
                title={
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                        Cập nhật minh chứng miễn giảm KTX
                    </span>
                }
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={submittingUpload}
                onOk={handleUploadSubmit}
                onCancel={() => {
                    setUploadModalVisible(false);
                    setCurrentRecord(null);
                    uploadForm.resetFields();
                }}
                okButtonProps={{
                    style: {
                        backgroundColor: '#125195',
                        borderColor: '#125195',
                        borderRadius: 6
                    }
                }}
                cancelButtonProps={{
                    style: { borderRadius: 6 }
                }}
                destroyOnClose
            >
                <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 12, fontSize: 14 }}>
                        Sinh viên: <strong>{currentRecord?.fullname || ''}</strong> ({currentRecord?.code || ''})
                    </div>
                    <Form form={uploadForm} layout="vertical">
                        <Form.Item
                            name="urlMinhChung"
                            label={<strong>File minh chứng</strong>}
                            rules={[{ required: true, message: 'Vui lòng tải lên file minh chứng!' }]}
                        >
                            <UploadFile maxCount={1} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </Card>
    );
};
