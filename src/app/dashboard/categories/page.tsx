'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Section, Typography, useToast } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to load categories',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load categories',
        type: 'error',
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      addToast({
        title: 'Error',
        description: 'Category name is required',
        type: 'error',
        duration: 4000
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim()
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCategoryName('');
        addToast({
          title: 'Success!',
          description: 'Category created successfully!',
          type: 'success',
          duration: 4000
        });
      } else {
        const error = await response.json();
        addToast({
          title: 'Error',
          description: error.error || 'Failed to create category',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
        duration: 6000
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editName.trim()) {
      addToast({
        title: 'Error',
        description: 'Category name is required',
        type: 'error',
        duration: 4000
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editName.trim()
        }),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(prev => 
          prev.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ).sort((a, b) => a.name.localeCompare(b.name))
        );
        setEditingCategory(null);
        setEditName('');
        addToast({
          title: 'Success!',
          description: 'Category updated successfully!',
          type: 'success',
          duration: 4000
        });
      } else {
        const error = await response.json();
        addToast({
          title: 'Error',
          description: error.error || 'Failed to update category',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
        duration: 6000
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        addToast({
          title: 'Success!',
          description: 'Category deleted successfully!',
          type: 'success',
          duration: 4000
        });
      } else {
        const error = await response.json();
        addToast({
          title: 'Error',
          description: error.error || 'Failed to delete category',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
        duration: 6000
      });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <Section padding="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Typography variant="h1" className="mb-4">
                Categories Management
              </Typography>
              <Typography variant="p" className="text-gray-600 dark:text-gray-300">
                Add, edit, or delete earning categories
              </Typography>
            </div>

            {/* Add New Category */}
            <Card className="p-6 mb-6">
              <Typography variant="h3" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Add New Category
              </Typography>
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateCategory}
                  disabled={saving || !newCategoryName.trim()}
                  className="px-6"
                >
                  {saving ? 'Adding...' : 'Add Category'}
                </Button>
              </div>
            </Card>

            {/* Categories List */}
            <Card className="p-6">
              <Typography variant="h3" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Existing Categories
              </Typography>
              
              {loading ? (
                <div className="text-center py-8">
                  <Typography variant="p">Loading categories...</Typography>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <Typography variant="p" className="text-gray-500 dark:text-gray-400">
                    No categories found. Add your first category above.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {editingCategory?.id === category.id ? (
                        <div className="flex items-center gap-4 flex-1">
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleEditCategory()}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleEditCategory}
                            disabled={saving || !editName.trim()}
                            size="sm"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Typography variant="p" className="text-gray-800 dark:text-gray-200 font-medium">
                            {category.name}
                          </Typography>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEdit(category)}
                              variant="outline"
                              size="sm"
                              disabled={saving}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              variant="outline"
                              size="sm"
                              disabled={saving}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
