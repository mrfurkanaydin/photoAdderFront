"use client"
import { createAlbumImage, generateQR, getAlbum, getAllAlbumImages, getQR, upload } from '@/lib/actions/album.actions';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import ImageGallery from '@/components/imageGallery';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function page() {
    const [qr, setQr] = useState(false)
    const [link, setLink] = useState("")
    const [photos, setPhotos] = useState([])
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const token = session.accessToken;
    const user = session.user
    const params = useParams();
    const { id } = params;
    useEffect(() => {
        fetchDatas()
        setLoading(false)
    }, []);

    const fetchDatas = async () => {
        try {
            const { albums } = await getAlbum(id, token);
            // if (albums.id == 0) {
            //     router.push("/unauthorized")
            //     return <></>
            // }
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
        try {
            const photo = await getAllAlbumImages(id, token);
            setPhotos(photo.albumImages)
            console.log(photo.albumImages);
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
        try {
            const qr = await getQR(token);
            setLink(qr.link)
            setQr(true);
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }

    }
    if (loading) {
        return <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    }
    const generateQRsubmit = async () => {
        try {
            const response = await generateQR({ "album_id": id }, token);
            setLink(response.link)
            setQr(true);
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
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
            await createAlbumImage({ "album_id": Number(id), "image_url": response.image_url }, token)
            fetchDatas()
        } catch (error) {
            console.error('Error uploading the file:', error);
            alert('Yükleme sırasında hata oluştu.');
        }
    };

    return (
        <>
            <div>album {id}</div>
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
            <p>Fotoğrafları Yüklenmesi için Gereken QR kodu Oluştur</p>
            <Button disabled={link && true} onClick={generateQRsubmit}
            >Oluştur</Button>
            {qr && <QRCode value={link} />}

            <div className="p-10 text-center">
                <ImageGallery photos={photos} type="customer" />
            </div>
        </>
    )
}

export default page