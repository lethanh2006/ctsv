import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ipRoot = 'https://ais.aisenote.com/'; // ip prod
const ipRoot = 'https://ais.aisenote.com/dev/'; // ip dev

const ip3 = ipRoot + 'slink'; // ip dev

const ipNotif = ipRoot + 'notification'; // ip dev
const ipDaoTao = ipRoot + 'qldt';
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh-api';
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.CTSV;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = ipRoot + 'keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint = ipRoot + 'keycloak/realms/vwa/protocol/openid-connect/token';
const sentryDSN = 'https://ed934e521d476c44a89a42aaa8a6993a@sentry.aisoftech.vn/3';

export {
	ipTaiChinh,
	ipNhanSu,
	ipDaoTao,
	ipCore,
	ip3,
	ipNotif,
	ipGlobal,
	currentRole,
	keycloakClientID,
	resourceServerClientId,
	keycloakTokenEndpoint,
	keycloakAuthority,
	sentryDSN,
};
