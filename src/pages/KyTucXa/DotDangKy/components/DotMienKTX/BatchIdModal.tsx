import React from 'react';
import { Modal } from 'antd';

type Props = {
  open: boolean;
  id?: string;
  onClose: () => void;
};

const BatchIdModal: React.FC<Props> = ({ open, id, onClose }) => {
  return (
    <Modal title='ID Đợt' open={open} onOk={onClose} onCancel={onClose} okText='Đóng'>
      <div>{id ? `ID: ${id}` : 'Không có ID'}</div>
    </Modal>
  );
};

export default BatchIdModal;
