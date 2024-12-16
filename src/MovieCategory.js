import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';



ReactModal.setAppElement('#root');

function MovieCategory(){
    const [categories,setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryDetails, setCategoryDetails] = useState({
        id:'',
        name:'',
        slug:''
    });

    const handleEdit = (id) => {
        const CategoryToEdit = categories.find(category => category.id === id);
        console.log(CategoryToEdit.name)
        setCategoryDetails({
            id: CategoryToEdit.id,
            name: CategoryToEdit.name,
            slug: CategoryToEdit.slug
        });
        setEditingCategoryId(id);
    };
    
    

    const handleSave = (id) => {
        console.log("Saving user with UID:", id);
        console.log("Updated user details:", categoryDetails); // Log để kiểm tra dữ liệu
    
        axios.put(
            `http://localhost:8080/categories/${id}`,
            {
                    name: categoryDetails.name,
                    slug: categoryDetails.slug
            },
            {
                headers: {
                    'Content-Type': 'application/json' // Đảm bảo gửi đúng Content-Type
                }
            }
        )
        .then(response => {
            const updatedCategory = response.data;
            alert('Category updated successfully!');
            setEditingCategoryId(null);
            setCategories(prevCategories => prevCategories.map(category =>
                category.id === id
                    ? { ...updatedCategory } // Cập nhật người dùng với dữ liệu mới
                    : category
            ));
        })
        .catch(error => {
            console.error('There was an error updating the category!', error);
        });
    };
    
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryDetails(prevState => ({
            ...prevState,
            [name]: value  // Cập nhật giá trị email hoặc username trong userDetails
        }));
        console.log("Updated category details: ", categoryDetails); 
    };
    
    
    
    // Fetch movies
    useEffect(() => {
        axios.get(`http://localhost:8080/categories`)
            .then(response => {
                if (response.data) {
                    setCategories(response.data);
                    
                }
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            axios.delete(`http://localhost:8080/categories/${categoryId}`)
                .then(() => {
                    alert('Movie deleted successfully');
                    setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
                })
                .catch(error => console.error('Error deleting category:', error));
        }
    };

    
    return (
        <div className='p-4'>
            <h1 className="text-2xl font-bold text-center"> Category</h1>
            <div className="flex items-center mb-6">
           <Link 
                       to="/add-category" 
                       className="px-4 py-2 bg-blue-500 mr-6  text-white rounded hover:bg-blue-600 text-right"
                   >
                       Add Category
                   </Link>
                   <Link 
                        to="/movie-admin" 
                        className="px-4 py-2 bg-blue-500 mr-6  text-white rounded hover:bg-blue-600 text-right"
                    >
                        Movie Admin
                    </Link>
        </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Slug</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map(category => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                {editingCategoryId === category.id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={categoryDetails.name} // Lấy giá trị trực tiếp từ user đang chỉnh sửa
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    category.name
                                )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                {editingCategoryId === category.id ? (
                                    <input
                                        type="text"
                                        name="slug" // Lưu ý tên trường phải trùng với key trong object
                                        value={categoryDetails.slug} // Lấy giá trị từ user
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    category.slug
                                )}

                                    </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {/* <button
                                        onClick={() => fetchUserDetails(user.uid)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        Edit
                                    </button> */}
                                    {editingCategoryId === category.id ? ( 
                                        <button 
                                        onClick={() => handleSave(category.id)} 
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2" 
                                        >
                                             Save 
                                        </button> ) : ( <button
                                         onClick={() => handleEdit(category.id)}
                                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" >
                                             Edit 
                                             </button>
                                        )}
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

           
        </div>
    );

}


export default MovieCategory;