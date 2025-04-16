import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CategoryService {
    private getHeaders() {
        const token = authService.getAccessToken();
        return token ? {
            'Authorization': `Bearer ${token}`
        } : {};
    }

    // Get all categories - public endpoint
    async getAllCategories() {
        try {
            const response = await axios.get(`${API_URL}/content/getAllCategories`);
            if (response.data) {
                return {
                    success: true,
                    message: 'Categories fetched successfully',
                    data: response.data.data || []
                };
            }
            return {
                success: false,
                message: 'No categories found',
                data: []
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return {
                success: false,
                message: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to load categories',
                data: []
            };
        }
    }

    // Admin endpoints - these will fail if user is not admin
    async createCategory(name: string, description: string) {
        try {
            const response = await axios.post(`${API_URL}/content/createCategory`, {
                name,
                description
            }, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async updateCategory(categoryId: string, name: string, description: string) {
        try {
            const response = await axios.put(`${API_URL}/content/updateCategory/${categoryId}`, {
                name,
                description
            }, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async deleteCategory(categoryId: string) {
        try {
            const response = await axios.delete(`${API_URL}/content/deleteCategory/${categoryId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    // Educator endpoint - for adding course to category
    async addCourseToCategory(courseId: string, categoryId: string) {
        try {
            const response = await axios.post(`${API_URL}/course/addCategory`, {
                courseId,
                categoryId
            }, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding course to category:', error);
            throw error;
        }
    }

    async searchCategories(query: string) {
        try {
            const response = await axios.get(`${API_URL}/content/searchCategory?query=${encodeURIComponent(query)}`, {
                headers: this.getHeaders()
            });
            return {
                success: true,
                message: 'Categories searched successfully',
                data: response.data.data || []
            };
        } catch (error) {
            console.error('Error searching categories:', error);
            return {
                success: false,
                message: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to searchcategories',
                data: []
            };
        }
    }
}

    export default new CategoryService();
