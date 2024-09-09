"use client"
import { createAlbumImage, generateQR, getAlbum, getAllAlbumImages, getQR, upload } from '@/lib/actions/album.actions';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import ImageGallery from '@/components/imageGallery';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from "@/components/ui/progress"

function page() {
    const [qr, setQr] = useState(false)
    const [link, setLink] = useState("")
    const [photos, setPhotos] = useState([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0)
    const { data: session } = useSession();
    const router = useRouter();    
    const token = session.accessToken;
    const params = useParams();
    const { id } = params;
    useEffect(() => {
        fetchDatas()
        setLoading(false)
    }, []);

    const fetchDatas = async () => {
        try {
            const { albums } = await getAlbum(id, token);
            console.log(albums);

            if (albums.id == '00000000-0000-0000-0000-000000000000') {
                router.push("/unauthorized")
                return <></>
            }
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
        setProgress(1)
        var progressUpdate = 100 / selectedFiles.length
        try {
            // Her bir dosya için yükleme işlemini yap
            for (const file of selectedFiles) {
                console.log("progres", progress, "progresSUpdate", progressUpdate, "sum", progress + progressUpdate);

                const formData = new FormData();
                formData.append('image', file);

                // Dosyayı sunucuya yükle
                const response = await upload(formData, token);

                // Yüklenen dosyanın URL'sini albüme ekle
                await createAlbumImage({ album_id: id, image_url: response.image_url, file_size: response.size }, token);
                setProgress((prevProgress) => prevProgress + progressUpdate)
            }

            // Albüm resimlerini yenile
            fetchDatas();
            setPreviewUrls([])
            setSelectedFiles([])
            setProgress(0)
        } catch (error) {
            console.error('Error uploading the files:', error);
            alert('Yükleme sırasında hata oluştu.');
        }
    };

    return (
        <>
            <div>album {id} </div>
            <p>Fotoğrafları Yüklenmesi için Gereken QR kodu Oluştur</p>
            <Button disabled={link && true} onClick={generateQRsubmit}
            >Oluştur</Button>
            {qr && <QRCode value={link} />}
            <form onSubmit={handleSubmit} className="flex flex-col items-center p-10">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />
                {/* Çoklu önizleme gösterimi */}
                <div className="grid grid-cols-6 gap-4 mb-4">
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
                {
                    progress > 0 && <Progress value={progress} className="w-[60%] mt-5" />
                }

            </form>


            <div className="p-10 text-center">
                {photos?.length > 0 ? <ImageGallery photos={photos} /> : <> Henüz Hiç Fotoğraf Yüklenmedi</>}
            </div>
        </>
    )
}

export default page