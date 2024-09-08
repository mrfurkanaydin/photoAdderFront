"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { createAlbumUser } from '@/lib/actions/uploads';
import { createAlbumImage, getAllAlbumImages, getAllUserImages, upload } from '@/lib/actions/album.actions';
import { Button } from '@/components/ui/button';
import ImageGallery from '@/components/imageGallery';
function uploads() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [photos, setPhotos] = useState([]);
    const { data: session, status } = useSession();
    const token = session?.accessToken;
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        localStorage.setItem("id", JSON.stringify(id))
        //!!!!!!
        if (status === "unauthenticated") {
            router.push('/uploads')
        }
        postAlbumUser()
        getAlbumImage()

    }, []);
    console.log(status);


    const postAlbumUser = async () => {
        const response = await createAlbumUser({ "album_id": id }, token)
        console.log("postAlbumUser", response);
    }
    const getAlbumImage = async () => {
        const response = await getAllUserImages(id, token)
        console.log("getAlbumImage", response.albumImages);
        setPhotos(response.albumImages)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Dosya seçildiğinde bir ön izleme gösteriyoruz
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Lütfen bir dosya seçin');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await upload(formData, token);
            await createAlbumImage({ "album_id": id, "image_url": response.image_url }, token)
            getAlbumImage()
        } catch (error) {
            console.error('Error uploading the file:', error);
            alert('Yükleme sırasında hata oluştu.');
        }
    };
    return (
        <div className="p-10 text-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4"
                />
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="mb-4 w-64 h-64 object-cover"
                    />
                )}
                <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Yükle
                </Button>
            </form>
            <ImageGallery photos={photos} type="user" />
        </div>
    )
}

export default uploads