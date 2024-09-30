import React, { useState, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axiosInstance from '../../Axiosconfig/Axiosconfig'; 

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (editedData: FormData,type:any) => void;
    data: any
    type: string;
}

const MAX_IMAGES = 3;

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, data, type }) => {
    const [editedData, setEditedData] = useState(data);
    //@ts-ignore
    const [newImages, setNewImages] = useState<File[]>([]);
    const [croppedImages, setCroppedImages] = useState<string[]>([]);
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);

    useEffect(() => {
        if (type === 'post') {
            const post = editedData ;
            setCroppedImages(post.images?.map((img:any) => `https://hasth.mooo.com/src/uploads/${img}`) || []);
            setVideoPreview(post.video ? `https://hasth.mooo.com/src/uploads/${post.video}` : null);
        }else{
            const post = editedData ;
            setCroppedImages(post.images?.map((img:any) => `https://hasth.mooo.com/src/uploads/${img}`) || []);
            
        }
    }, [editedData, type]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validExtensions = ['jpeg', 'jpg', 'png', 'gif'];

        for (let file of selectedFiles) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!validExtensions.includes(fileExtension || '')) {
                setError('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.');
                return;
            }
        }

        if (selectedFiles.length + croppedImages.length > MAX_IMAGES) {
            setError(`You can only upload up to ${MAX_IMAGES} images in total.`);
            return;
        }

        setNewImages(selectedFiles);
        const newUncroppedImages = selectedFiles.map(file => URL.createObjectURL(file));
        setCroppedImages(prevImages => [...prevImages, ...newUncroppedImages]);
        setError(null);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const validExtensions = ['mp4', 'mov'];

            if (!validExtensions.includes(fileExtension || '')) {
                setError('Invalid file type. Only MP4 and MOV are allowed.');
                return;
            }

            if (file.size > 100 * 1024 * 1024) { 
                setError('Video size should not exceed 100MB.');
                return;
            }

            setNewVideo(file);
            setVideoPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleCrop = () => {
        if (cropper && selectedImageIndex !== null) {
            const croppedImageData = cropper.getCroppedCanvas().toDataURL('image/png');
            setCroppedImages(prevCroppedImages => {
                const newCroppedImages = [...prevCroppedImages];
                newCroppedImages[selectedImageIndex] = croppedImageData;
                return newCroppedImages;
            });
            setSelectedImageIndex(null);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        const formData = new FormData();
    
        Object.entries(editedData).forEach(([key, value]) => {
            if (key !== 'images' && key !== 'video') {
                formData.append(key, value as string);
            }
        });
        
        croppedImages.forEach((img, index) => {
            // Check if the image has been cropped or not
            if (img.startsWith('data:image')) {
                // Process cropped image (as in the original code)
                const base64Image = img.split(',')[1];
                if (base64Image) {
                    try {
                        const blobBin = atob(base64Image);
                        const array = [];
                        for (let i = 0; i < blobBin.length; i++) {
                            array.push(blobBin.charCodeAt(i));
                        }
                        const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
                        formData.append('images', file, `image${index}.png`);
                    } catch (e) {
                        console.error("Failed to process image:", e);
                        setError('Failed to process image.');
                        return;
                    }
                }
            } else {
                // If not cropped, append the original file from newImages array
                const originalFile = newImages[index];
                if (originalFile) {
                    formData.append('images', originalFile);
                } else {
                    formData.append('existingImages', img.split('/').pop() || '');
                }
            }
        });
    
        if (newVideo) {
            formData.append('video', newVideo);
        } else if (videoPreview && type === 'post') {
            formData.append('existingVideo', editedData.video || '');
        }
    
        if (type === 'post') {
            if (!formData.get('caption')) {
                setError('Please describe your idea.');
                return;
            }
            if (!formData.get('tags')) {
                setError('Please enter tags for better reach.');
                return;
            }
        } else {
            if (!formData.get('name') || !formData.get('price') || !formData.get('description') || !formData.get('brand') || !formData.get('countInStock')) {
                setError('Please fill all required fields.');
                return;
            }
        }
    
        if (croppedImages.length === 0 && !newVideo && !videoPreview) {
            setError('Please upload at least one image or video.');
            return;
        }
       
    
        try {
            const endpoint = type === 'post' ? '/api/auth/editIdea' : '/api/auth/editProduct';
            const response = await axiosInstance.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
    
            if (response.data.status) {
                const updatedItem = response.data.data;
                onSave(updatedItem, type);
                onClose();
            } else {
                setError('Failed to save. Please try again.');
            }
        } catch (error) {
            console.error("Failed to submit data:", error);
            setError('An error occurred while saving the data.');
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit {type === 'post' ? 'Post' : 'Product'}</h2>
                {error && <p className="text-red-500 mb-2 p-2 bg-red-100 rounded-lg text-sm">{error}</p>}
                {type === 'post' ? (
                    <>
                        <textarea
                            name="caption"
                            value={(editedData ).caption}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            rows={4}
                            placeholder="What's on your mind?"
                        />
                        <input
                            name="tags"
                            value={(editedData ).tags}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Tags (comma-separated)"
                        />
                    </>
                ) : (
                    <>
                        <input
                            name="name"
                            value={(editedData ).name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Product Name"
                        />
                        <input
                            name="price"
                            type="number"
                            value={(editedData ).price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Price"
                        />
                        <textarea
                            name="description"
                            value={(editedData ).description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            rows={3}
                            placeholder="Description"
                        />
  

                        <input
                            name="brand"
                            value={(editedData).brand}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Brand"
                        />
                        <input
                            name="countInStock"
                            type="number"
                            value={(editedData).countInStock}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Stock Quantity"
                        />
                    </>
                )}
                <div className="mb-4">
                    <label htmlFor="images" className="block font-medium">Images:</label>
                    <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full p-2 border rounded"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {croppedImages.map((img, index) => (
                            <div key={index}>
                                <img
                                    src={img}
                                    alt={`cropped-img-${index}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className="cursor-pointer w-full h-auto"
                                />
                            </div>
                        ))}
                    </div>
                    {selectedImageIndex !== null && (
                        <div className="mt-4">
                            <Cropper
                                src={croppedImages[selectedImageIndex]}
                                style={{ height: 300, width: '100%' }}
                                initialAspectRatio={1}
                                aspectRatio={1}
                                guides={false}
                                viewMode={1}
                                autoCropArea={1}
                                background={false}
                                responsive={true}
                                checkOrientation={false}
                                onInitialized={instance => setCropper(instance)}
                            />
                            <button
                                onClick={handleCrop}
                                className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Crop Image
                            </button>
                        </div>
                    )}
                </div>
                {type === 'post' &&<div className="mb-4">
                    <label htmlFor="video" className="block font-medium">Video:</label>
                    <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="block w-full p-2 border rounded"
                    />
                    {videoPreview && (
                        <div className="mt-2">
                            <video src={videoPreview} controls className="w-full h-auto"></video>
                        </div>
                    )}
                </div>}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="p-2 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
