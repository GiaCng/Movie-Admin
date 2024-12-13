import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';


ReactModal.setAppElement('#root');

function MovieUser(){
    const [users,setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({
        uid:'',
        email: '',
        user_name:''
    });

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

    const fetchUserDetails = (uid) => {
        axios.put(`http://localhost:8080/users/${uid}`)
            .then(response => {
                const data = response.data;

                setUserDetails({
                    data
                });
                setIsModalOpen(true);
            })
            .catch(error => console.error('Error fetching user details:', error));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserDetails({
            uid: '',
            email: '',
            user_name:''
        });
    };

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
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.userName}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        onClick={() => fetchUserDetails(user.uid)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        Edit
                                    </button>
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

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                    {
                        userDetails && (
                            <div className="relative bg-white max-h-full overflow-y-auto rounded shadow-lg p-6 w-full max-w-3xl">

                                <button 
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
                                    arial-label="Close"
                                >
                                     <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                                </button>

                                <h2 className="text-xl font-bold mb-4">
                                    Edit User
                                </h2>
                                <div className="space-y-4">

                                    <div>
                                        <label className="block font-semibold">Email:</label>
                                        <input 
                                            type="text"
                                            value={userDetails.email}
                                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />

                                    </div>
                                    <div>
                                        <label className="block font-semibold">User Name:</label>
                                        <input 
                                            type="text"
                                            value={userDetails.user_name}
                                            onChange={(e) => setUserDetails({ ...userDetails, user_name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />

                                        <button
                                            onClick={() => {
                                                return axios.post(
                                                    `http://localhost:8080/users/${userDetails.uid}`,
                                                    userDetails
                                                )
                                            }} 
                                        >

                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </ReactModal>
        </div>
    );

}

export default MovieUser;