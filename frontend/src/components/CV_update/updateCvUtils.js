const trimFormData = (formData) => {
    const trimmedFormData = {};
   
    const trimData = (key, value) => {
      const trimmedValue = value.trim(); 
      trimFormData[key] = trimmedValue;
    };
   
    trimData('title', formData.title || "Untitled");
    trimData('firstName', formData.firstName);
    trimData('lastName', formData.lastName);
    trimData('phoneNumber', formData.phoneNumber);
    trimData('address', formData.address);
    trimData('email', formData.email);
    trimData('github', formData.github);
    trimData('linkedin', formData.linkedin); 

    return trimmedFormData;
};

export default {
    trimFormData,
}