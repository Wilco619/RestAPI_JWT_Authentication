import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const CustomerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    id_number: "",
    age:"",
    gender: "",
    branch: "",
    residence: "",
    residence_type: "",
    business_type: "",
    business_area: "",
    next_of_keen: "",
    guaranter_firstname: "",
    guaranter_lastname: "",
    guaranter_age: "",
    guaranter_business_type: "",
    guaranter_phone: "",
    guaranter_id: "",
    guaranter_gender: "",
  });

  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const isFormFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
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
      await api.post("/customers/", formData); // Adjust the endpoint as needed
      toast.success("Customer created successfully!");
      setFormData({
        firstname: "",
        lastname: "",
        age:"",
        gender: "",
        phone: "",
        email: "",
        id_number: "",
        branch: "",
        residence: "",
        residence_type: "",
        business_type: "",
        business_area: "",
        next_of_keen: "",
        guaranter_firstname: "",
        guaranter_lastname: "",
        guaranter_age: "",
        guaranter_business_type: "",
        guaranter_phone: "",
        guaranter_id: "",
        guaranter_gender: "",
      });
    } catch (err) {
      console.error("Error:", err); 
      toast.error(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div>
      <p className='form-function'>Customer Registration Form</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-section">
            <input type="text" name="firstname" value={formData.firstname} placeholder="First Name" onChange={handleChange} />
            <input type="text" name="lastname" value={formData.lastname} placeholder="Last Name" onChange={handleChange} />
            <input type="text" name="age" value={formData.age} placeholder="AGE" onChange={handleChange} />
            <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="" disabled >Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="text" name="phone" value={formData.phone} placeholder="Phone" onChange={handleChange} />
            <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
            <input type="text" name="id_number" value={formData.id_number} placeholder="ID Number" onChange={handleChange} />
        </div>
        <div className="form-section">
            <select placeholder="Select Branch" name="branch" value={formData.branch} onChange={handleChange}>
                <option value="" disabled>Select Branch</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Kisii">Kisii</option>
                <option value="Narok">Narok</option>
            </select>
            <input type="text" name="residence" value={formData.residence} placeholder="Residence" onChange={handleChange} />
            <select placeholder="Select Residence Type" name="residence_type" value={formData.residence_type} onChange={handleChange}>
                <option value="" disabled>Select Residence Type</option>
                <option value="Area1">Area1</option>
                <option value="Area2">Area2</option>
                <option value="Area3">Area3</option>
                <option value="Area4">Area4</option>
            </select>
            <select placeholder="Select Business Type" name="business_type" value={formData.business_type} onChange={handleChange}>
                <option value="" disabled>Select Business Type</option>
                <option value="Type1">Type1</option>
                <option value="Type2">Type2</option>
                <option value="Type3">Type3</option>
                <option value="Type4">Type4</option>
            </select>
        </div>
        <div className="form-section">
            <input type="text" name="business_area" value={formData.business_area} placeholder="Business Area" onChange={handleChange} />
            <input type="text" name="next_of_keen" value={formData.next_of_keen} placeholder="Next of Keen" onChange={handleChange} />
            <input type="text" name="guaranter_firstname" value={formData.guaranter_firstname} placeholder="Guaranter First Name" onChange={handleChange} />
            <input type="text" name="guaranter_lastname" value={formData.guaranter_lastname} placeholder="Guaranter Last Name" onChange={handleChange} />
            <input type="text" name="guaranter_age" value={formData.guaranter_age} placeholder="Guaranter Age" onChange={handleChange} />
        </div>
        <div className="form-section">
            <input type="text" name="guaranter_business_type" value={formData.guaranter_business_type} placeholder="Guaranter Business Type" onChange={handleChange} />
            <input type="text" name="guaranter_phone" value={formData.guaranter_phone} placeholder="Guaranter Phone" onChange={handleChange} />
            <input type="text" name="guaranter_id" value={formData.guaranter_id} placeholder="Guaranter ID" onChange={handleChange} />
            <select placeholder="guaranter_gender" name="guaranter_gender" value={formData.guaranter_gender} onChange={handleChange}>
                <option value="" disabled >Guaranter gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
          <button
            type="submit"
            style={{
              backgroundColor: isButtonActive ? "#135D66" : "#6c757da7",
              cursor: isButtonActive ? "pointer" : "not-allowed",
            }}
            disabled={!isButtonActive}
          >
            Create Customer
          </button>
        </div>                
      </form>
    </div>
  );
};

export default CustomerRegistrationForm;
