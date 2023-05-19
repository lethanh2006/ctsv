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

  // DICH VU MOT CUA

  /////////////////////////////
  // DICH VU MOT CUA
  // {
  //   name: 'DichVuMotCua',
  //   icon: 'AuditOutlined',
  //   path: '/dichvumotcua',
  //   // access: 'adminVaQuanTri',
  //   routes: [
  //     // {
  //     //   name: 'ThongTinTongHop',
  //     //   path: './thongtintonghop',
  //     //   component: './DichVuMotCuaV2/ThongTinTongHop/Admin.tsx',
  //     //   // access: 'adminAccessFilter',
  //     //   maChucNang: 'don-dvmc-thao-tac:read-all',
  //     // },
  //     {
  //       name: 'QuanLyBieuMau',
  //       path: './quanlybieumau',
  //       component: './DichVuMotCuaV2/QuanLyBieuMau',
  //       // access: 'adminAccessFilter',
  //       maChucNang: 'dvmc-thao-tac:read',
  //     },
  //     {
  //       name: 'QuanLyDon',
  //       path: './quanlydonadmin',
  //       component: './DichVuMotCuaV2/QuanLyDon/admin',
  //       // access: 'adminAccessFilter',
  //       maChucNang: 'don-dvmc-thao-tac:read-all',
  //     },
  //   ],
  // },
  {
    name: 'DichVuMotCua',
    icon: 'AuditOutlined',
    path: '/dichvumotcua',
    // access: 'nhanVien',
    routes: [
      // {
      //   name: 'ThongTinTongHop',
      //   path: './thongtintonghop/quanlydondieuphoi',
      //   // component: './DichVuMotCuaV2/ThongTinTongHop',
      //   // access: 'accessFilter',
      //   maChucNang: 'don-dvmc-thao-tac:read-all',
      // },
      {
        name: 'QuanLyBieuMau',
        path: './quanlybieumau',
        component: './DichVuMotCuaV2/QuanLyBieuMau',
        // access: 'accessFilter',
        maChucNang: 'dvmc-thao-tac:read',
      },
      {
        name: 'QuanLyDon',
        path: './quanlydondieuphoi',
        component: './DichVuMotCuaV2/QuanLyDon',
        // access: 'accessFilter',
        maChucNang: 'don-dvmc-thao-tac:read-all',
      },
      // {
      //   name: 'ChuyenVienTiepNhanQuanLyDon',
      //   path: './quanlydonchuyenvien',
      //   // component: './DichVuMotCuaV2/QuanLyDon',
      //   // access: 'accessFilter',
      //   maChucNang: 'don-dvmc-thao-tac:read-my',
      // },

      {
        name: 'PhanHoi',
        path: './phanhoi',
        component: './PhanHoi',
      },
    ],
  },
  {
    icon: 'QuestionOutlined',
    name: 'CauHoiThuongGap',
    path: '/cau-hoi-thuong-gap',
    component: './CauHoiThuongGap',
  },
  {
    name: 'VanBanHuongDan',
    path: '/van-ban-huong-dan',
    component: './VanBanHuongDan',
    icon: 'FileOutlined',
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
    name: 'QuanTriPhanHoi',
    path: './quan-ly-phan-hoi/hoi-dap',
    // maChucNang: 'phan-hoi:read',
    // access: 'routeFilter',
    routes: [
      {
        name: 'TatCaPhanHoi',
        path: './all',
        component: './PhanHoi/Admin.tsx',
      },
      // {
      //   name: 'PhanHoiDonVi',
      //   path: './gui-den-toi',
      //   component: './PhanHoi/GuiDenToi.tsx',
      // },
    ],
  },
  {
    name: 'TinTuc',
    path: 'quantritintuc',
    routes: [
      {
        name: 'ChuDeChung',
        path: './chude',
        component: './ChuDeVaTinTuc/ChuDe',
        // access: 'adminAccessFilter',
        // maChucNang: 'chu-de-chung:read',
      },
      {
        name: 'TinTuc',
        path: './tintuc',
        component: './ChuDeVaTinTuc/TinTuc',
        // access: 'adminAccessFilter',
        // maChucNang: 'tin-tuc:read',
      },
    ],
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
