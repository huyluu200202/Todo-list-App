import React, { useState } from 'react';

const UploadAvatar = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const userId = localStorage.getItem('userId');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await fetch('http://localhost:4001/api/upload-avatar', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                alert('Avatar uploaded successfully!');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    return (
        <div>
            <h1>Upload Avatar</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadAvatar;
