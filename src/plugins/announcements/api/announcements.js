import { store } from "store";
import { http } from "ractf";

import * as actions from "../actions/announcements";

import { api } from "ractf";
const ENDPOINTS = api.ENDPOINTS;

export const addAnnouncement = (title, body) => http.post(ENDPOINTS.ANNOUNCEMENTS, { title, body });

export const removeAnnouncement = ({ id }) => http.delete(ENDPOINTS.ANNOUNCEMENTS + id);

export const getAnnouncements = () => {
    http.get(ENDPOINTS.ANNOUNCEMENTS).then(data => {
        data.forEach(i => store.dispatch(actions.showAnnouncement(i)));
    }).catch(() => { });
};
