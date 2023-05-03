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
      // {
      //   name: 'settings',
      //   icon: 'smile',
      //   path: '/account/settings',
      //   component: './account/settings',
      // },
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

  // DANH MUC HE THONG
  // {
  //   name: 'DanhMuc',
  //   path: '/danh-muc',
  //   icon: 'copy',
  //   routes: [
  //     {
  //       name: 'ChucVu',
  //       path: 'chuc-vu',
  //       component: './DanhMuc/ChucVu',
  //     },
  //   ],
  // },

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
        name: 'ChuyenVienDieuPhoiQuanLyDon',
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
    ],
  },

  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './exception/404',
  },
];
