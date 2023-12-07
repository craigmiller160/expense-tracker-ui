declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: string;
		}
	}

	interface ImportMetaEnv {
		readonly VITE_KEYCLOAK_REALM: string;
	}
}
