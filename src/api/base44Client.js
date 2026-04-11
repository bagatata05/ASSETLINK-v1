/// <reference types="vite/client" />

import { mockBase44 } from './mockBase44';

const useRealBackend = import.meta.env.VITE_BASE44_REAL_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_BASE44_APP_BASE_URL || 'http://localhost:8000/api/v1';

const createRealClient = () => {
    const request = async (path, options = {}) => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || 'Request failed',
                data: errorData
            };
        }

        return await response.json();
    };

    const createEntityManager = (entityName) => {
        const basePath = `/${entityName.toLowerCase()}s`; // Generic pluralization
        // Manual overrides for specific non-standard pluralizations
        const pathOverrides = {
            'RepairRequest': '/repairs',
            'MaintenanceTask': '/maintenance-tasks',
            'Asset': '/assets',
            'School': '/schools'
        };
        const path = pathOverrides[entityName] || basePath;

        return {
            list: (sort, limit) => {
                const params = new URLSearchParams();
                if (sort) params.append('sort', sort);
                if (limit) params.append('limit', limit);
                const query = params.toString();
                return request(`${path}${query ? `?${query}` : ''}`).then(res => res.data);
            },
            filter: (query, sort, limit) => {
                const params = new URLSearchParams();
                if (query) {
                    Object.entries(query).forEach(([k, v]) => {
                        if (v !== undefined && v !== null) params.append(k, v);
                    });
                }
                if (sort) params.append('sort', sort);
                if (limit) params.append('limit', limit);
                const queryString = params.toString();
                return request(`${path}${queryString ? `?${queryString}` : ''}`).then(res => res.data);
            },
            get: (id) => request(`${path}/${id}`).then(res => res.data),
            create: (data) => request(path, { method: 'POST', body: JSON.stringify(data) }).then(res => res.data),
            update: (id, data) => request(`${path}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }).then(res => res.data),
            delete: (id) => request(`${path}/${id}`, { method: 'DELETE' }).then(res => res.data),
        };
    };

    const entitiesProxy = new Proxy({}, {
        get(_target, entityName) {
            if (typeof entityName !== 'string' || entityName === 'then' || entityName.startsWith('_')) {
                return undefined;
            }
            return createEntityManager(entityName);
        },
    });

    return {
        auth: {
            me: () => request('/auth/me').then(res => res.data),
            logout: () => {
                localStorage.removeItem('auth_token');
            },
            redirectToLogin: (callback) => {
                window.location.href = `/login?callback=${encodeURIComponent(callback)}`;
            }
        },
        entities: entitiesProxy,
        integrations: {
            Core: {
                UploadFile: async ({ file }) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const token = localStorage.getItem('auth_token');
                    const res = await fetch(`${API_BASE_URL}/photos/upload`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            ...(token && { 'Authorization': `Bearer ${token}` }),
                        }
                    }).then(r => r.json());

                    return { file_url: res.data.photo_url };
                },
                SendEmail: async (params) => {
                    console.log('[RealClient] SendEmail mock:', params);
                    // For now, we'll just log this. In production, we'd add a /email endpoint.
                    return { success: true };
                }
            }
        }
    };
};

export const base44 = useRealBackend ? createRealClient() : mockBase44;
