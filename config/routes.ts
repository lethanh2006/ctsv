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
  {
    name: 'DanhMuc',
    path: '/danh-muc',
    icon: 'copy',
    routes: [
      {
        name: 'ChucVu',
        path: 'chuc-vu',
        component: './DanhMuc/ChucVu',
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
      {
        name: 'PhanHoiDonVi',
        path: './gui-den-toi',
        component: './PhanHoi/GuiDenToi.tsx',
      },
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
