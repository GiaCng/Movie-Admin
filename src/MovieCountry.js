import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';



ReactModal.setAppElement('#root');

function MovieCountry(){
    const [countries,setCountries] = useState([]);
    const [editingCountryId, setEditingCountryId] = useState(null);
    const [countryDetails, setCountryDetails] = useState({
        id:'',
        name:'',
        slug:''
    });

    const handleEdit = (id) => {
        const CountryToEdit = countries.find(country => country.id === id);
        console.log(CountryToEdit.name)
        setCountryDetails({
            id: CountryToEdit.id,
            name: CountryToEdit.name,
            slug: CountryToEdit.slug
        });
        setEditingCountryId(id);
    };
    
    

    const handleSave = (id) => {
        console.log("Saving user with UID:", id);
        console.log("Updated user details:", countryDetails); // Log để kiểm tra dữ liệu
    
        axios.put(
            `http://localhost:8080/country/${id}`,
            {
                    name: countryDetails.name,
                    slug: countryDetails.slug
            },
            {
                headers: {
                    'Content-Type': 'application/json' // Đảm bảo gửi đúng Content-Type
                }
            }
        )
        .then(response => {
            const updatedCountry = response.data;
            alert('Country updated successfully!');
            setEditingCountryId(null);
            setCountries(prevCountries => prevCountries.map(country =>
                country.id === id
                    ? { ...updatedCountry } // Cập nhật người dùng với dữ liệu mới
                    : country
            ));
        })
        .catch(error => {
            console.error('There was an error updating the country!', error);
        });
    };
    
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCountryDetails(prevState => ({
            ...prevState,
            [name]: value  // Cập nhật giá trị email hoặc username trong userDetails
        }));
        console.log("Updated category details: ", countryDetails); 
    };
    
    
    
    // Fetch movies
    useEffect(() => {
        axios.get(`http://localhost:8080/country`)
            .then(response => {
                if (response.data) {
                    setCountries(response.data);
                    
                }
            })
            .catch(error => console.error('Error fetching Country:', error));
    }, []);

    const handleDeleteCountry = (countryId) => {
        if (window.confirm('Are you sure you want to delete this country?')) {
            axios.delete(`http://localhost:8080/country/${countryId}`)
                .then(() => {
                    alert('Movie deleted successfully');
                    setCountries(prevCountries => prevCountries.filter(countries => countries.id !== countryId));
                })
                .catch(error => console.error('Error deleting country:', error));
        }
    };

    
    return (
        <div className='p-4'>
            <h1 className="text-2xl font-bold text-center"> Country</h1>
            <div className="flex items-center mb-6">
           <Link 
                       to="/add-country" 
                       className="px-4 py-2 bg-blue-500 mr-6  text-white rounded hover:bg-blue-600 text-right"
                   >
                       Add Country
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
                        {countries?.map(country => (
                            <tr key={country.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                {editingCountryId === country.id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={countryDetails.name} // Lấy giá trị trực tiếp từ user đang chỉnh sửa
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    country.name
                                )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                {editingCountryId === country.id ? (
                                    <input
                                        type="text"
                                        name="slug" // Lưu ý tên trường phải trùng với key trong object
                                        value={countryDetails.slug} // Lấy giá trị từ user
                                        onChange={(e) => handleChange(e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                ) : (
                                    country.slug
                                )}

                                    </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {/* <button
                                        onClick={() => fetchUserDetails(user.uid)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        Edit
                                    </button> */}
                                    {editingCountryId === country.id ? ( 
                                        <button 
                                        onClick={() => handleSave(country.id)} 
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2" 
                                        >
                                             Save 
                                        </button> ) : ( <button
                                         onClick={() => handleEdit(country.id)}
                                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" >
                                             Edit 
                                             </button>
                                        )}
                                    <button
                                        onClick={() => handleDeleteCountry(country.id)}
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


export default MovieCountry;