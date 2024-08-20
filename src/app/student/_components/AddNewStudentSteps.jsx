import AddNewUser from '@/components/AddNewUser/AddNewUser';
import React, { useState, Fragment } from 'react';
import AddNewStudent from './AddNewStudent';
import GKStepper from './stepper/GKStepper';

const AddNewStudentSteps = ({ handleBackToStudentListClick, fetchStudents }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    gender: '',
    birthday: '',
    role_uuid: '',
    image: '',  // For storing image
    studentData: {
        enrollment_date: '',
        level_uuid: '',
        classe_uuid: ''
    }
});


const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData({
      ...formData,
      [name]: value
  });
};

const handleStudentChange = (event) => {
  const { name, value } = event.target;
  setFormData({
      ...formData,
      studentData: {
          ...formData.studentData,
          [name]: value
      }
  });
};


  const next = () => {
    setCurrentStep(currentStep === 2 ? 1 : currentStep + 1);
  };

  const previous = () => {
    setCurrentStep(currentStep === 1 ? 1 : currentStep - 1);
  };

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
      )
    },
    {
      id: 2,
      title: 'Create Student',
      content: (
        <AddNewStudent
          user={formData}
          data={formData.studentData}
          handleChange={handleStudentChange}
          next={next}
          previous={previous}
          handleBackToStudentListClick={handleBackToStudentListClick}
        />
      )
    }
  ];

  return (
    <Fragment>
      <GKStepper currentStep={currentStep} steps={steps} />
    </Fragment>
  );
};

export default AddNewStudentSteps;
