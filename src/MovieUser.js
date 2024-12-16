import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';


ReactModal.setAppElement('#root');

function MovieUser(){
    const [users,setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [userDetails, setUserDetails] = useState({
        uid:'',
        email:'',
        username:''
    });

    const handleEdit = (uid) => {
        const userToEdit = users.find(user => user.uid === uid);
        console.log(userToEdit.email)
        setUserDetails({
            uid: userToEdit.uid,
            email: userToEdit.email,
            username: userToEdit.userName
        });
        setEditingUserId(uid);
    };
    
    

    const handleSave = (uid) => {
        console.log("Saving user with UID:", uid);
        console.log("Updated user details:", userDetails); // Log để kiểm tra dữ liệu
    
        axios.put(
            `http://localhost:8080/users/${uid}`,
            null,
            {
                params: {
                    email: userDetails.email,
                    username: userDetails.username
                }
            }
        )
        .then(response => {
            const updatedUser = response.data;
            alert('User updated successfully!');
            setEditingUserId(null);
            setUsers(prevUsers => prevUsers.map(user =>
                user.uid === uid
                    ? { ...updatedUser } // Cập nhật người dùng với dữ liệu mới
                    : user
            ));
        })
        .catch(error => {
            console.error('There was an error updating the user!', error);
        });
    };
    
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value  // Cập nhật giá trị email hoặc username trong userDetails
        }));
        console.log("Updated user details: ", userDetails); 
    };
    
    
    
    // Fetch movies
    useEffect(() => {
        axios.get(`http://localhost:8080/users/all`)
            .then(response => {
                if (response.data) {
                    setUsers(response.data);
                    
                }
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:8080/users/${userId}`)
                .then(() => {
                    alert('Movie deleted successfully');
                    setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId));
                })
                .catch(error => console.error('Error deleting user:', error));
        }
    };

    
    return (
        <div className='p-4'>
            <h1 className="text-2xl font-bold text-center">User Information</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">User Name</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(user => (
                            <tr key={user.uid} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                {editingUserId === user.uid ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={userDetails.email} // Lấy giá trị trực tiếp từ user đang chỉnh sửa
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    user.email
                                )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                {editingUserId === user.uid ? (
                                    <input
                                        type="text"
                                        name="username" // Lưu ý tên trường phải trùng với key trong object
                                        value={userDetails.username} // Lấy giá trị từ user
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    user.userName
                                )}

                                    </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {/* <button
                                        onClick={() => fetchUserDetails(user.uid)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        Edit
                                    </button> */}
                                    {editingUserId === user.uid ? ( 
                                        <button 
                                        onClick={() => handleSave(user.uid)} 
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2" 
                                        >
                                             Save 
                                        </button> ) : ( <button
                                         onClick={() => handleEdit(user.uid)}
                                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" >
                                             Edit 
                                             </button>
                                        )}
                                    <button
                                        onClick={() => handleDeleteUser(user.uid)}
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


export default MovieUser;