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
			{
				name: 'HoSoTheoDoiSucKhoe',
				path: 'ho-so-theo-do-suc-kheo',
				icon: 'HeartOutlined',
				routes: [
					{
						name: 'DotKhamSucKhoe',
						path: 'dot-kham-suc-khoe',
						component: './HoSoTheoDoiSucKhoe/DotKhamSucKhoe',
					},
					{
						name: 'KetQuaKhamSucKhoe',
						path: 'ket-qua-kham-suc-khoe',
						component: './HoSoTheoDoiSucKhoe/KetQuaKhamSucKhoe',
					},
				],
			},
			{
				name: 'LopHanhChinh',
				icon: 'appstore',
				path: 'lop-hanh-chinh',
				component: './DaoTao/LopHanhChinh',
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

	//////////////////////
	// LỚP HÀNH CHÍNH

	//////////////////////
	// SU KIEN
	{
		name: 'SuKien',
		icon: 'calendar',
		path: '/su-kien',
		routes: [
			{
				name: 'TuanLeCongDan',
				path: 'tuan-le-cong-dan',
				component: './SuKien',
			},
			{
				name: 'CacHoatDongChoSinhVien',
				path: 'cac-hoat-dong-cho-sinh-vien',
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

	{
		name: 'HoatDongKetNoiVaPhucVuCongDong',
		path: 'hoat-dong-ket-noi-va-phuc-vu-cong-dong',
		icon: 'FileOutlined',
		routes: [
			{
				name: 'DaoTaoBoiDuong',
				path: 'dao-tao-boi-duong',
				component: './SuKien',
			},
			{
				name: 'HopTacNghienCuuChuyenGiao',
				path: 'hop-tac-nghien-cuu-chuyen-giao',
				component: './SuKien',
			},
			{
				name: 'ThucThiChinhSach',
				path: 'thuc-thi-chinh-sach',
				component: './SuKien',
			},
			{
				name: 'HoatDongXaHoi',
				path: 'hoat-dong-xa-hoi',
				component: './SuKien',
			},
			{
				name: 'Khac',
				path: 'khac',
				component: './SuKien',
			},
		],
	},

	{
		name: 'VanHoaVanNgheTheThao',
		path: 'van-hoa-van-nghe-the-thao',
		// component: './SuKien',
		icon: 'FileOutlined',
		routes: [
			{
				name: 'QuanLyCauLacBo',
				path: 'quan-ly-cau-lac-bo',
				component: './CauLacBo',
			},
			{
				name: 'HoatDongCauLacBo',
				path: 'hoat-dong-cau-lac-bo',
				component: './SuKien',
			},
			{
				name: 'SuKien',
				path: 'su-kien',
				component: './SuKien',
			},
		],
	},

	// Chế độ chính sách, học bổng
	{
		path: '/che-do-chinh-sach',
		name: 'CheDoChinhSach',
		icon: 'read',
		routes: [
			// DRL
			{
				name: 'DiemRenLuyen',
				path: '/diem-ren-luyen',
				icon: 'user',
				routes: [
					{
						name: 'DotChamDiem',
						path: 'dot-cham-diem',
						component: './DiemRenLuyen/DotChamDiem',
					},

					{
						name: 'QuanLyMinhChung',
						path: 'quan-ly-minh-chung',
						routes: [
							{
								name: 'NoiNgoaiTru',
								path: 'noi-ngoai-tru',
								component: './DiemRenLuyen/QuanLyMinhChung',
							},
							{
								name: 'ThamGiaCongTacXaHoi',
								path: 'tham-gia-cong-tac-xa-hoi',
								component: './DiemRenLuyen/QuanLyMinhChung',
							},
							{
								name: 'TuyenTruyen',
								path: 'tuyen-truyen',
								component: './DiemRenLuyen/QuanLyMinhChung',
							},
							{
								name: 'DacBiet',
								path: 'dac-biet',
								component: './DiemRenLuyen/QuanLyMinhChung',
							},
						],
					},

					{
						name: 'TongHopDuLieu',
						path: 'tong-hop-du-lieu',
						component: './DiemRenLuyen/TongHopDuLieu',
					},
				],
			},
			// Khen thưởng kỷ luật
			{
				name: 'KhenThuongKyLuat',
				path: 'khen-thuong-ky-luat',
				icon: 'trophy',
				routes: [
					{
						path: 'khen-thuong',
						name: 'KhenThuong',
						component: './KhenThuongKyLuat/KhenThuong',
					},
					// {
					// 	path: 'sang-kien',
					// 	name: 'SangKien',
					// 	component: './KhenThuongKyLuat/SangKienNew',
					// },
					{
						path: 'ky-luat',
						name: 'KyLuat',
						component: './KhenThuongKyLuat/KyLuat',
					},
				],
			},
			{
				name: 'CheDoChinhSach',
				component: './CheDoChinhSach',
				path: 'che-do-chinh-sach',
			},
		],
	},

	/////////////////////////////
	// DICH VU HANH CHINH
	// {
	// 	name: 'DichVuHanhChinh',
	// 	icon: 'AuditOutlined',
	// 	path: '/dich-vu-hanh-chinh',
	// 	// access: 'nhanVien',
	// 	routes: [
	// 		{
	// 			name: 'ThongTinTongHop',
	// 			path: './thong-tin-tong-hop',
	// 			component: './DichVuMotCuaV2/ThongTinTongHop',
	// 			// access: 'accessFilter',
	// 			// maChucNang: 'don-dvmc-thao-tac:read-all',
	// 		},
	// 		{
	// 			name: 'QuanLyBieuMau',
	// 			path: './bieu-mau',
	// 			component: './DichVuMotCuaV2/QuanLyBieuMau',
	// 			// access: 'admin',
	// 			// maChucNang: 'dvmc-thao-tac:read',
	// 		},
	// 		{
	// 			name: 'QuanLyDon',
	// 			path: './don-vmc',
	// 			component: './DichVuMotCuaV2/QuanLyDon',
	// 			// access: 'admin',
	// 			// maChucNang: 'don-dvmc-thao-tac:read-all',
	// 		},
	// 		// {
	// 		//   name: 'ChuyenVienTiepNhanQuanLyDon',
	// 		//   path: './chuyenvientiepnhan',
	// 		//   component: './DichVuMotCuaV2/ChuyenVienXuLy',
	// 		//   access: 'user',
	// 		//   // maChucNang: 'don-dvmc-thao-tac:read-all',
	// 		// },
	// 		// {
	// 		//   name: 'ChuyenVienDieuPhoiQuanLyDon',
	// 		//   path: './quanlydondieuphoi',
	// 		//   component: './DichVuMotCuaV2/ChuyenVienDieuPhoi',
	// 		//   access: 'user',
	// 		//   // maChucNang: 'don-dvmc-thao-tac:read-all',
	// 		// },
	// 		// {
	// 		//   name: 'ChuyenVienTiepNhanQuanLyDon',
	// 		//   path: './quanlydonchuyenvien',
	// 		//   // component: './DichVuMotCuaV2/QuanLyDon',
	// 		//   // access: 'accessFilter',
	// 		//   maChucNang: 'don-dvmc-thao-tac:read-my',
	// 		// },
	// 	],
	// },

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

	//Nội ngoại trú
	{
		name: 'NoiNgoaiTru',
		path: 'noi-ngoai-tru',
		icon: 'DeploymentUnitOutlined',
		routes: [
			{
				name: 'DotKhaiBaoNoiNgoaitru',
				path: 'dot-khai-bao-noi-ngoai-tru',
				component: './NoiNgoaiTru/QuanLyDot',
			},
		],
	},

	//Khai báo sức khỏe

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
				name: 'LoaiKhenThuong',
				path: 'loai-khen-thuong',
				component: './DanhMuc/LoaiKhenThuong',
			},
			{
				name: 'HinhThucKhenThuong',
				path: 'hinh-thuc-khen-thuong',
				component: './DanhMuc/HinhThucKhenThuong',
			},
			{
				name: 'CapKyLuat',
				path: 'cap-ky-luat',
				component: './DanhMuc/CapKyLuat',
			},
			{
				name: 'HinhThucKyLuat',
				path: 'hinh-thuc-ky-luat',
				component: './DanhMuc/HinhThucKyLuat',
			},

			// {
			// 	name: 'LoaiDanhHieu',
			// 	path: 'loai-danh-hieu',
			// 	component: './DanhMuc/LoaiDanhHieu',
			// },
			// {
			// 	name: 'DanhHieu',
			// 	path: 'danh-hieu',
			// 	component: './DanhMuc/DanhHieu',
			// },
			// {
			// 	name: 'ThamGiaCongTacXaHoi',
			// 	path: 'tham-gia-cong-tac-xa-hoi',
			// 	component: './DiemRenLuyen/DanhMuc',
			// },
			{
				name: 'CapDatGiai',
				path: 'cap-dat-giai',
				component: './DiemRenLuyen/DanhMuc',
			},
			{
				name: 'KyTucXa',
				path: 'ky-tuc-xa',
				component: './DiemRenLuyen/DanhMuc',
			},
			{
				name: 'PhongKyTucXa',
				path: 'phong-ky-tuc-xa',
				component: './DiemRenLuyen/DanhMuc',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
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
