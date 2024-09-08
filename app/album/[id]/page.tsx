"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { createAlbumUser } from '@/lib/actions/uploads';
import { createAlbumImage, getAllAlbumImages, getAllUserImages, upload } from '@/lib/actions/album.actions';
import { Button } from '@/components/ui/button';
import ImageGallery from '@/components/imageGallery';
import ImageGalleryUser from '@/components/imageGalleryUser';
function uploads() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Çoklu dosyalar
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
    console.log(photos);


    const postAlbumUser = async () => {
        const response = await createAlbumUser({ "album_id": id }, token)
        console.log("postAlbumUser", response);
    }
    const getAlbumImage = async () => {
        const response = await getAllUserImages(id, token)
        console.log("getAlbumImage", response);
        setPhotos(response?.albumImages)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []); // Çoklu dosyalar alınıyor
        setSelectedFiles(files); // Dosyalar state'e ekleniyor

        // Her bir dosya için önizleme URL'si oluştur
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews); // Önizleme URL'leri state'e ekleniyor
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles?.length === 0) {
            alert('Lütfen bir veya daha fazla dosya seçin');
            return;
        }

        try {
            // Her bir dosya için yükleme işlemini yap
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('image', file);

                // Dosyayı sunucuya yükle
                const response = await upload(formData, token);

                // Yüklenen dosyanın URL'sini albüme ekle
                await createAlbumImage({ album_id: id, image_url: response.image_url }, token);
            }

            // Albüm resimlerini yenile
            getAlbumImage();
            setPreviewUrls([])
            setSelectedFiles([])
        } catch (error) {
            console.error('Error uploading the files:', error);
            alert('Yükleme sırasında hata oluştu.');
        }
    };
    return (
        <div className="p-10 text-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />
                {/* Çoklu önizleme gösterimi */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {previewUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-64 h-64 object-cover"
                        />
                    ))}
                </div>
                <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Yükle
                </Button>
            </form>

            {photos?.length > 0 ? <ImageGalleryUser photos={photos} /> : <> Henüz Hiç Fotoğraf Yüklenmedi</>}
        </div>
    )
}

export default uploads