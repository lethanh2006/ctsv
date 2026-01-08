import login from './login';
import namhoc from './namhoc';
import sinhvien from './sinhvien';
import thongtinnguoihoc from './thongtinnguoihoc';

export default {
	...login,
	...sinhvien,
	...namhoc,
	...thongtinnguoihoc,
};
