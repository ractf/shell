import { http } from "ractf";

import { ENDPOINTS } from "./consts";

export const setConfigValue = (key, value) => http.post(ENDPOINTS.CONFIG + key, { value });
