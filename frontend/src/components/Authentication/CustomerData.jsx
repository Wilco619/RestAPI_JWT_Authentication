import React, { useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

const CustomerDataForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    id_number: '',
    branch: '------',
    gender: '',
    active: true,
  });

  const branchOptions = [
    "------",
    "Nairobi",
    "Nakuru",
    "Mombasa",
    "Eldoret",
    "Kisii",
    "Narok",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/customer-data/', formData);
      toast.success('Customer data created successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        phone: '',
        id_number: '',
        branch: '------',
        gender: '',
        active: true,
      });
    } catch (error) {
      toast.error('Error creating customer data. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Customer Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID Number:</label>
          <input
            type="text"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
          >
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Active:</label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={() => setFormData({ ...formData, active: !formData.active })}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomerDataForm;
