import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const apiClient = axios.create({
    baseURL: `https://frontend-test-api.aircall.io`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
});

export default {

    getCalls(params={}, token) {
        return apiClient.get('/calls', {'params':params, 'headers': { 'Authorization': `Bearer ${token} ` }});
    },

    getCall(id, token) {
        return apiClient.get(`/calls/${id}`, {'headers': { 'Authorization': `Bearer ${token} ` }});
    },

    getUser(token) {
        return apiClient.get(`/me`, {'headers': { 'Authorization': `Bearer ${token} ` }});
    },

    getAuthToken(data) {
        return apiClient.post('/auth/login', data)
    },

    refreshAuthToken(data) {
        return apiClient.post(`/auth/refresh-token`, data)
    },

    createCallNote(id, data, token) {
        return apiClient.post(`/calls/${id}/note`, data, {'headers': { 'Authorization': `Bearer ${token} ` }})
    },

    archiveCall(data, token) {
        return apiClient.put(`/calls/${data.id}/archive`,data, {'headers': { 'Authorization': `Bearer ${token} ` }})
    }

}
