/// <reference types="vite/client" />
const API_BASE_URL = '/api/v1';

/**
 * @typedef {Object} EntityManager
 * @property {(sort?: string, limit?: number) => Promise<any[]>} list
 * @property {(query?: Record<string, any>, sort?: string, limit?: number) => Promise<any[]>} filter
 * @property {(id: string | number) => Promise<any>} get
 * @property {(data: any) => Promise<any>} create
 * @property {(id: string | number, data: any) => Promise<any>} update
 * @property {(id: string | number) => Promise<any>} delete
 */

/**
 * @typedef {Object} Base44Entities
 * @property {EntityManager} RepairRequest
 * @property {EntityManager} MaintenanceTask
 * @property {EntityManager} Asset
 * @property {EntityManager} School
 * @property {EntityManager} User
 */

/**
 * @typedef {Object} Base44Client
 * @property {Object} auth
 * @property {() => Promise<any>} auth.me
 * @property {() => void} auth.logout
 * @property {(callback: string) => void} auth.redirectToLogin
 * @property {Base44Entities} entities
 * @property {Object} integrations
 * @property {Object} integrations.Core
 * @property {(params: {file: File}) => Promise<{file_url: string}>} integrations.Core.UploadFile
 * @property {(params: {to: string, subject: string, body: string}) => Promise<{success: boolean}>} integrations.Core.SendEmail
 */

const createRealClient = () => {
    const request = async (path, options = {}) => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        // Defensive: Don't double-prefix if the path already contains it
        const fullPath = path.startsWith(API_BASE_URL) ? path : `${API_BASE_URL}${path}`;

        const response = await fetch(fullPath, {
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
            'School': '/schools',
            'User': '/users'
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
                    const uploadPath = `${API_BASE_URL}/photos/upload`;
                    const res = await fetch(uploadPath, {
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

/** @type {Base44Client} */
export const base44 = createRealClient();
