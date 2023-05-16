import { EModuleKey } from '@/services/ant-design-pro/constant';

// const ip3 = 'https://dhs.ptit.edu.vn/odoo-user-service'; // ip prod
// const ip = 'https://dhs.ptit.edu.vn'; // ip prod

// const ip3 = 'https://ais.aisenote.com/tcns'; // ip dev
const ip3 = 'http://192.168.1.71:3000'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev
// const ipQldt = 'https://ais.aisenote.com/qldt';
const ipQldt = 'http://192.168.1.71:3000';
const ipTcns = 'https://ais.aisenote.com/tcns';
const ipCore = 'https://ais.aisenote.com/core';
const currentRole = EModuleKey.TCNS;
const keycloakClientID = 'vwa-auth';
const keycloakAuthority = 'https://ais.aisenote.com/keycloak/realms/vwa';
// const keycloakClientID = 'vwa-auth';
const keycloakSecret = '7NlhgTsTHE37DWZa5IarN2nVE7qHniwC';
const keycloakTokenEndpoint =
  'https://ais.aisenote.com/keycloak/realms/vwa/protocol/openid-connect/token';

export {
  ipTcns,
  ipQldt,
  ipCore,
  ip3,
  ipGlobal,
  currentRole,
  keycloakClientID,
  keycloakSecret,
  keycloakTokenEndpoint,
  keycloakAuthority,
};
