'use client'
import { useState, useEffect } from 'react'
import { Category, User } from '@/types'
import categoryService from '@/services/category.service'
import authService from '@/services/auth.service'
import { useRouter } from 'next/navigation'

export default function CategoryPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await categoryService.getAllCategories()
                // Check if response has the expected structure
                if (response && response.success) {
                    setCategories(response.data || [])
                    const authResponse = await authService.validateSession()
                    setUser(authResponse.user)
                } else {
                    throw new Error(response?.message || 'Failed to load categories')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setError('Failed to load categories')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateCategory = async () => {
        try {
            if (!formData.name) {
                setError('Category name is required')
                return
            }
            
            const response = await categoryService.createCategory(formData.name, formData.description)
            if (response.success) {
                setCategories([...categories, response.data])
                resetForm()
                setError(null)
            }
        } catch (error) {
            console.error('Error creating category:', error)
            setError('Failed to create category')
        }
    }

    const handleUpdateCategory = async () => {
        try {
            if (!selectedCategory || !formData.name) {
                setError('Category name is required')
                return
            }
            
            const response = await categoryService.updateCategory(
                selectedCategory.id,
                formData.name,
                formData.description
            )
            
            if (response.success) {
                setCategories(categories.map(category => 
                    category.id === selectedCategory.id ? response.data : category
                ))
                setSelectedCategory(null)
                resetForm()
                setError(null)
            }
        } catch (error) {
            console.error('Error updating category:', error)
            setError('Failed to update category')
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const response = await categoryService.deleteCategory(categoryId)
            if (response.success) {
                setCategories(categories.filter(category => category.id !== categoryId))
                setError(null)
            }
        } catch (error) {
            console.error('Error deleting category:', error)
            setError('Failed to delete category')
        }
    }

    const selectCategoryForEdit = (category: Category) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name,
            description: category.description || ''
        })
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: ''
        })
        setError(null)
    }

    const handleAddCourse = (categoryId: string) => {
        router.push(`/courses/create?categoryId=${categoryId}`)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Categories</h1>

            {/* Only show category management form for admins */}
            {(user as User)?.isAdmin && (
                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">
                        {selectedCategory ? 'Update Category' : 'Create New Category'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                                placeholder="Category name"
                            />
                        </div>
                        <div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                                placeholder="Category description (optional)"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={selectedCategory ? handleUpdateCategory : handleCreateCategory}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {selectedCategory ? 'Update Category' : 'Create Category'}
                            </button>
                            {selectedCategory && (
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                                {category.description && (
                                    <p className="text-gray-400 mt-2">{category.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {/* Only show edit/delete buttons for admins */}
                                {(user as User)?.isAdmin && (
                                    <>
                                        <button
                                            onClick={() => selectCategoryForEdit(category)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {/* Show add course button for educators */}
                                {user?.isEducator && (
                                    <button
                                        onClick={() => handleAddCourse(category.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Add Course
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="text-red-500 mt-4">
                    {error}
                </div>
            )}
        </div>
    );
}
