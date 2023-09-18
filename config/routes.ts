export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
			{
				component: '404',
			},
		],
	},
	{
		hideInMenu: true,
		name: 'account',
		icon: 'user',
		path: '/account',
		routes: [
			{
				name: 'center',
				icon: 'smile',
				path: '/account/center',
				component: './account/center',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// SINH VIEN
	{
		name: 'SinhVien',
		path: '/sinh-vien',
		icon: 'contacts',
		routes: [
			{
				name: 'DanhSachSinhVien',
				path: 'danh-sach-sinh-vien',
				component: './SinhVien',
			},
			// {
			//   name: 'LopHanhChinh',
			//   path: 'lop-hanh-chinh',
			//   component: './NamHoc/LopHanhChinh',
			// },
			// {
			//   name: 'DotNhapHoc',
			//   path: 'dot-nhap-hoc',
			//   component: './NamHoc/DotNhapHoc',
			// },
			// {
			//   name: 'ChuyenTruong',
			//   path: 'chuyen-truong',
			// },
			// {
			//   name: 'KhenThuong',
			//   path: 'khen-thuong',
			// },
			// {
			//   name: 'KyLuat',
			//   path: 'ky-luat',
			// },
		],
	},

	/////////////////////////////
	// DICH VU HANH CHINH
	{
		name: 'DichVuHanhChinh',
		icon: 'AuditOutlined',
		path: '/dich-vu-hanh-chinh',
		// access: 'nhanVien',
		routes: [
			{
				name: 'ThongTinTongHop',
				path: './thong-tin-tong-hop',
				component: './DichVuMotCuaV2/ThongTinTongHop',
				// access: 'accessFilter',
				// maChucNang: 'don-dvmc-thao-tac:read-all',
			},
			{
				name: 'QuanLyBieuMau',
				path: './bieu-mau',
				component: './DichVuMotCuaV2/QuanLyBieuMau',
				// access: 'admin',
				// maChucNang: 'dvmc-thao-tac:read',
			},
			{
				name: 'QuanLyDon',
				path: './don-vmc',
				component: './DichVuMotCuaV2/QuanLyDon',
				// access: 'admin',
				// maChucNang: 'don-dvmc-thao-tac:read-all',
			},
			// {
			//   name: 'ChuyenVienTiepNhanQuanLyDon',
			//   path: './chuyenvientiepnhan',
			//   component: './DichVuMotCuaV2/ChuyenVienXuLy',
			//   access: 'user',
			//   // maChucNang: 'don-dvmc-thao-tac:read-all',
			// },
			// {
			//   name: 'ChuyenVienDieuPhoiQuanLyDon',
			//   path: './quanlydondieuphoi',
			//   component: './DichVuMotCuaV2/ChuyenVienDieuPhoi',
			//   access: 'user',
			//   // maChucNang: 'don-dvmc-thao-tac:read-all',
			// },
			// {
			//   name: 'ChuyenVienTiepNhanQuanLyDon',
			//   path: './quanlydonchuyenvien',
			//   // component: './DichVuMotCuaV2/QuanLyDon',
			//   // access: 'accessFilter',
			//   maChucNang: 'don-dvmc-thao-tac:read-my',
			// },
		],
	},

	// TIN TUC
	// {
	//   name: 'TinTuc',
	//   path: 'tin-tuc',
	//   icon: 'global',
	//   routes: [
	//     {
	//       name: 'ChuDe',
	//       path: './chu-de',
	//       component: './TinTuc/ChuDe',
	//       // access: 'adminAccessFilter',
	//       // maChucNang: 'chu-de-chung:read',
	//     },
	//     {
	//       name: 'TinTuc',
	//       path: './tin-tuc',
	//       component: './TinTuc/TinTuc',
	//       // access: 'adminAccessFilter',
	//       // maChucNang: 'tin-tuc:read',
	//     },
	//   ],
	// },

	//////////////////////
	// SU KIEN
	{
		name: 'SuKien',
		icon: 'calendar',
		path: '/su-kien',
		routes: [
			{
				name: 'CacHoatDongChoSinhVien',
				icon: 'calendar',
				path: 'cac-hoat-dong-cho-sinh-vien',
				component: './SuKien',
			},
			{
				name: 'DaoTaoBoiDuong',
				icon: 'calendar',
				path: 'dao-tao-boi-duong',
				component: './SuKien',
			},
			{
				name: 'HopTacNghienCuuChuyenGiao',
				icon: 'calendar',
				path: 'hop-tac-nghien-cuu-chuyen-giao',
				component: './SuKien',
			},
			{
				name: 'ThucThiChinhSach',
				icon: 'calendar',
				path: 'thuc-thi-chinh-sach',
				component: './SuKien',
			},
			{
				name: 'HoatDongXaHoi',
				icon: 'calendar',
				path: 'hoat-dong-xa-hoi',
				component: './SuKien',
			},
			{
				name: 'Khac',
				icon: 'calendar',
				path: 'khac',
				component: './SuKien',
			},
		],
	},
	{
		path: `/qr-su-kien/:id`,
		component: './SuKien/QRCode',
		layout: false,
		hideInMenu: true,
	},

	//////////////////////
	// THONG BAO
	{
		name: 'ThongBao',
		icon: 'bell',
		path: '/thong-bao',
		component: './ThongBao',
	},

	// PHAN HOI
	{
		name: 'PhanHoi',
		path: './phan-hoi',
		icon: 'QuestionCircleOutlined',
		// maChucNang: 'phan-hoi:read',
		// access: 'routeFilter',
		routes: [
			{
				name: 'TatCaPhanHoi',
				path: './all',
				component: './TienIch/PhanHoi',
			},
			// {
			//   name: 'PhanHoiDonVi',
			//   path: './gui-den-toi',
			//   component: './PhanHoi/GuiDenToi.tsx',
			// },
		],
	},

	// TIEN ICH
	{
		name: 'KhaoSat',
		path: 'khao-sat',
		icon: 'form',
		routes: [
			{
				name: 'BieuMauKhaoSat',
				path: 'bieu-mau-khao-sat',
				component: './TienIch/KhaoSat',
			},
			{
				name: 'DotKhaoSat',
				path: 'dot-khao-sat',
				component: './TienIch/KhaoSat/DotKhaoSat',
			},
		],
	},
	// {
	//   name: 'TracNghiem',
	//   path: './tracnghiem',
	//   component: './BieuMau/TracNghiem',
	// },
	// {
	//   name: 'KhaiBaoSucKhoe',
	//   path: './khaibaosuckhoe',
	//   component: './BieuMau/KhaiBaoSucKhoe',
	// },
	{
		name: 'CauHoiThuongGap',
		path: 'cau-hoi-thuong-gap',
		icon: 'QuestionCircleOutlined',
		component: './TienIch/CauHoiThuongGap',
	},

	{
		name: 'VanBanHuongDan',
		path: 'van-ban-huong-dan',
		icon: 'FileTextOutlined',
		component: './TienIch/VanBanHuongDan',
	},

	// {
	//   name: 'TienIch',
	//   icon: 'form',
	//   path: '/tien-ich',
	//   routes: [
	//     {
	//       name: 'KhaoSat',
	//       path: 'khao-sat',
	//       routes: [
	//         {
	//           name: 'BieuMauKhaoSat',
	//           path: 'bieu-mau-khao-sat',
	//           component: './TienIch/KhaoSat',
	//         },
	//         {
	//           name: 'DotKhaoSat',
	//           path: 'dot-khao-sat',
	//           component: './TienIch/KhaoSat/DotKhaoSat',
	//         },
	//       ],
	//     },
	//     // {
	//     //   name: 'TracNghiem',
	//     //   path: './tracnghiem',
	//     //   component: './BieuMau/TracNghiem',
	//     // },
	//     // {
	//     //   name: 'KhaiBaoSucKhoe',
	//     //   path: './khaibaosuckhoe',
	//     //   component: './BieuMau/KhaiBaoSucKhoe',
	//     // },
	//     {
	//       name: 'CauHoiThuongGap',
	//       path: 'cau-hoi-thuong-gap',
	//       component: './TienIch/CauHoiThuongGap',
	//     },
	//
	//     {
	//       name: 'VanBanHuongDan',
	//       path: 'van-ban-huong-dan',
	//       component: './TienIch/VanBanHuongDan',
	//     },
	//   ],
	// },

	// DANH MUC HE THONG
	{
		name: 'DanhMuc',
		path: '/danh-muc',
		icon: 'copy',
		routes: [
			{
				name: 'LoaiDanhHieu',
				path: 'loai-danh-hieu',
				component: './DanhMuc/LoaiDanhHieu',
			},
			{
				name: 'DanhHieu',
				path: 'danh-hieu',
				component: './DanhMuc/DanhHieu',
			},
		],
	},

	{
		path: '/notification',
		component: './ThongBao/NotifOneSignal',
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
