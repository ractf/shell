import { http } from "ractf";

import { ENDPOINTS } from "./consts";


export const modifyUser = (userId, data) => http.patch(ENDPOINTS.USER + userId, data);
