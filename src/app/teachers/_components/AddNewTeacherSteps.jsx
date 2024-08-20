import React, { useState } from 'react';
import AddNewUser from '@/components/AddNewUser/AddNewUser';
import AddNewTeacher from './AddNewTeacher';
import GKStepper from './stepper/GKStepper';
import axiosInstance from '../../../../api/axiosConfig';
import { toast } from 'react-toastify';

const AddNewTeacherSteps = ({ handleBackToTeacherListClick, fetchTeachers }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    gender: '',
    birthday: '',
    role_uuid: '',
    teacherData: {
      specialization: '',
      salary: '',
      bio: '',
      experience_years: '',
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeacherChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      teacherData: {
        ...formData.teacherData,
        [name]: value,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      // Create the User
      const userResponse = await axiosInstance.post('/user', formData);
      const userUuid = userResponse.data.uuid;

      // Create the Teacher
      const teacherData = {
        user_uuid: userUuid,
        ...formData.teacherData,
      };
      await axiosInstance.post('/teacher', teacherData);

      toast.success('Teacher created successfully');
      handleBackToTeacherListClick();
      fetchTeachers();
    } catch (error) {
      toast.error('Error creating teacher');
      console.error('Error creating teacher:', error);
    }
  };

  const next = () => setCurrentStep((prevStep) => prevStep + 1);
  const previous = () => setCurrentStep((prevStep) => prevStep - 1);

  const steps = [
    {
      id: 1,
      title: 'Create User',
      content: (
        <AddNewUser
          data={formData}
          handleChange={handleChange}
          next={next}
        />
      ),
    },
    {
      id: 2,
      title: 'Create Teacher',
      content: (
        <AddNewTeacher
          user={formData}
          data={formData.teacherData}
          handleChange={handleTeacherChange}
          next={handleSubmit}
          previous={previous}
          handleBackToTeacherListClick={handleBackToTeacherListClick}
        />
      ),
    },
  ];

  return <GKStepper currentStep={currentStep} steps={steps} />;
};

export default AddNewTeacherSteps;
