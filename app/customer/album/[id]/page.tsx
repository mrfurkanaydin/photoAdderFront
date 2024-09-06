"use client"
import { createAlbumImage, generateQR, getAllAlbumImages, getQR, upload } from '@/lib/actions/album.actions';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion bileşenlerini ekliyoruz
import { FiArrowLeft, FiArrowRight, FiMinimize2 } from 'react-icons/fi';
import apiClient from '@/app/utils/api/ApiClient';

function page() {
    const [qr, setQr] = useState(false)
    const [link, setLink] = useState("")
    const [photos, setPhotos] = useState([])
    const { data: session } = useSession();
    const token = session.accessToken;
    const params = useParams();
    const { id } = params;
    useEffect(() => {
        fetchDatas()
    }, []);

    const fetchDatas = async () => {
        console.log("fetcing...");
        try {
            const qr = await getQR(token);
            console.log('BaşarılıGet:', qr);
            setLink(qr.link)
            setQr(true);
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
        try {
            const photo = await getAllAlbumImages(id, token);
            console.log('Başarılı:', photo.albumImages);
            setPhotos(photo.albumImages)
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
    }

    const generateQRsubmit = async () => {
        try {
            const response = await generateQR({ "album_id": id }, token);

            console.log('Başarılı:', response);
            setLink(response.link)
            setQr(true);
        } catch (error: any) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
    }

    const [isOpen, setIsOpen] = useState(false); // Modal açık mı kapalı mı
    const [currentIndex, setCurrentIndex] = useState(0); // Şu anda hangi resim gösteriliyor

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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
            console.log({ "album_id": id, "image_url": response.image_url });
            await createAlbumImage({ "album_id": Number(id), "image_url": response.image_url }, token)
            fetchDatas()
            // if (response.ok) {
            //     alert('Resim başarıyla yüklendi!');
            // } else {
            //     alert('Yükleme başarısız oldu!');
            // }
        } catch (error) {
            console.error('Error uploading the file:', error);
            alert('Yükleme sırasında hata oluştu.');
        }
    };

    return (
        <>
            <div>album {id}</div><form onSubmit={handleSubmit} className="flex flex-col items-center">
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Yükle
                </button>
            </form>
            <p>Fotoğrafları Yüklenmesi için Gereken QR kodu Oluştur</p>
            {link ? <button disabled onClick={generateQRsubmit} className='bg-gray-500 px-5 py-2 rounded-md text-white hover:bg-gray-700'>Oluştur</button> : <button onClick={generateQRsubmit} className='bg-green-500 px-5 py-2 rounded-md text-white hover:bg-green-700'>Oluştur</button>}
            {session.user.role}
            {qr && <QRCode value={link} />}

            <div className="p-10 text-center">
                <h1 className="text-3xl font-bold mb-8">Fotoğraf Galerisi</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {photos?.map((photo, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-lg border-2 border-gray-200 cursor-pointer"
                            onClick={() => openModal(index)}
                        >
                            <Image
                                src={photo.image_url}
                                alt={`Photo ${index + 1}`}
                                width={500}
                                height={300}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                            <div className="relative w-11/12 h-5/6">
                                {/* Kapatma Butonu */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 text-white text-2xl z-50"
                                >
                                    <FiMinimize2 />

                                </button>

                                {/* Sol Ok */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full text-black hover:bg-gray-300 z-50"
                                >
                                    <FiArrowLeft />
                                </button>

                                {/* Sağ Ok */}
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full text-black hover:bg-gray-300 z-50"
                                >
                                    <FiArrowRight />

                                </button>

                                {/* Seçili Resim */}
                                <Image
                                    src={photos[currentIndex].image_url}
                                    alt={`Photo ${currentIndex + 1}`}
                                    layout="fill"
                                    objectFit="contain" // Kenar boşlukları için contain kullanıyoruz
                                    className="rounded-lg"
                                />
                                {/* İndirme Butonu */}
                                {/* <button
                                onClick={() => downloadPhoto(photos[currentIndex].image_url)}
                                className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-md shadow-lg hover:bg-gray-300 z-50"
                            >
                                İndir
                            </button> */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <>

                {/* {photos.map(({ id, public_id, format, blurDataUrl, image_url }) => ( */}
                {/* {photos.map(({ id, image_url }) => (
                    <Link
                        key={id}
                        href={`/?photoId=${id}`}
                        as={`/p/${id}`}
                        // ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                        shallow
                        className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                    >
                        <Image
                            alt="Next.js Conf photo"
                            className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            // placeholder="blur"
                            // blurDataURL={blurDataUrl}
                            src={image_url}
                            width={720}
                            height={480}
                            sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                        />
                    </Link>
                ))} */}
            </>

        </>
    )
}

export default page