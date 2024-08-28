import { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

const CustomerRegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        gender: '',
        address: '',
        id_number: '',
        phone: '',
    });

    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {
        const isFormFilled = Object.values(formData).every(value => value.trim() !== '');
        setIsButtonActive(isFormFilled);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isButtonActive) return; // Prevent submission if button is inactive

        try {
            await api.post('/create-customer/', formData);
            toast.success('Customer created successfully!');
            setFormData({
                email: '',
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                gender: '',
                address: '',
                id_number: '',
                phone: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <div>
            <p className='form-function'>Customer Registration Form</p>
            <form className="flex form" onSubmit={handleSubmit}>
                <div className='form-section'>
                    <input 
                        type="text" 
                        name="firstname" 
                        value={formData.firstname} 
                        placeholder="Firstname" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="lastname" 
                        value={formData.lastname} 
                        placeholder="Lastname" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        placeholder="Username" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        placeholder="Email" 
                        onChange={handleChange} 
                    />
                </div>
                <div className='form-section'>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        placeholder="Phone" 
                        onChange={handleChange} 
                    />  
                    <input 
                        type="text" 
                        name="id_number" 
                        value={formData.id_number} 
                        placeholder="ID" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        placeholder="Address" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="gender" 
                        value={formData.gender} 
                        placeholder="Gender" 
                        onChange={handleChange} 
                    />
                </div>
                <div className='form-section'>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        placeholder="Password" 
                        onChange={handleChange} 
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            backgroundColor: isButtonActive ? '#135D66' : '#6c757da7',
                            cursor: isButtonActive ? 'pointer' : 'not-allowed'
                        }} 
                        disabled={!isButtonActive}
                    >
                        Register Customer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerRegistrationForm;
