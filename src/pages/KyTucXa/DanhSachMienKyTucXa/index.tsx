import { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { useModel } from '@umijs/max';
import { DanhSachSinhVienPanel } from './components/DanhSachSinhVienPanel';
import FormHocKy from './FormHocKy';

const DanhSachMienKyTucXa = () => {
    const {
        danhSach,
        getAllModel,
        loading,
        deleteModel,
        visibleForm,
        setVisibleForm,
        setRecord,
        edit,
        setEdit,
        handleEdit,
    } = useModel('kytucxa.danhsachmienkytucxa');

    const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);

    useEffect(() => {
        getAllModel();
    }, []);

    useEffect(() => {
        if (danhSach.length > 0) {
            if (!selectedSemesterId || !danhSach.some((item) => item._id === selectedSemesterId)) {
                setSelectedSemesterId(danhSach[0]._id);
            }
        } else {
            setSelectedSemesterId(undefined);
        }
    }, [danhSach]);

    const activeSemester = danhSach.find((item) => item._id === selectedSemesterId);

    return (
        <>
            <DanhSachSinhVienPanel
                activeSemester={activeSemester}
                danhSachHocKy={danhSach}
                selectedSemesterId={selectedSemesterId}
                onSelectSemester={setSelectedSemesterId}
                loadingSemesters={loading}
                onAddSemester={() => {
                    setEdit(false);
                    setRecord(undefined);
                    setVisibleForm(true);
                }}
                onEditSemester={(item) => {
                    handleEdit(item);
                }}
                onDeleteSemester={(id) => {
                    deleteModel(id, getAllModel);
                }}
            />

            <Modal
                open={visibleForm}
                title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} học kỳ`}
                width={550}
                onCancel={() => setVisibleForm(false)}
                destroyOnClose
                footer={null}
            >
                <FormHocKy />
            </Modal>
        </>
    );
};

export default DanhSachMienKyTucXa;
