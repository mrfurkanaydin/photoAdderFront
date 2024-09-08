import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiMinimize2 } from 'react-icons/fi'
import { Button } from './ui/button';

type Photo = {
    id: string;
    image_url: string;
    user: {
        email: string;
        id: string;
        role: string;
    };
};

function ImageGallery({ photos, type }) {
    const [isOpen, setIsOpen] = useState(false); // Modal açık mı kapalı mı
    const [currentIndex, setCurrentIndex] = useState(0); // Şu anda hangi resim gösteriliyor
    const [filterType, setFilterType] = useState("all"); // Filtre tipi
    const [sortedPhotos, setSortedPhotos] = useState([...photos]); // Sıralanmış fotoğrafları tutuyoruz
    const [filterCol, setFilterCol] = useState(12); // Sıralanmış fotoğrafları tutuyoruz

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedPhotos.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sortedPhotos.length - 1 : prevIndex - 1
        );
    };

    // Fotoğrafları email'e göre sıralayan fonksiyon
    const sortByEmail = () => {
        setFilterType("email");
        const sorted = [...photos].sort((a, b) => {
            return a.user.email.localeCompare(b.user.email);
        });
        setSortedPhotos(sorted);
    };

    const groupByEmail = (photos) => {
        return photos.reduce((groups, photo) => {
            const email = photo.user.email;
            if (!groups[email]) {
                groups[email] = [];
            }
            groups[email].push(photo);
            return groups;
        }, {});
    };

    const groupedPhotos = groupByEmail(sortedPhotos); // Email'e göre gruplandır

    let displayedPhotos = []; // Modal için tüm fotoğrafların sıralı listesi
    Object.values(groupedPhotos).forEach((group: Photo[]) => {
        displayedPhotos = [...displayedPhotos, ...group];
    });

    return (
        <>
            <div className="grid grid-cols-3 gap-6 mt-3">
                <div></div>
                <div className="text-3xl font-bold">Fotoğraf Galerisi</div>
                {type === "customer" ? (
                    <div className='xl:flex gap-2 justify-center items-center hidden xl:show'>
                        <div>Filtreler:</div>
                        <Button onClick={() => setFilterCol(4)}>4 li</Button>
                        <Button onClick={() => setFilterCol(12)}>12 li</Button>||
                        <Button onClick={sortByEmail}>Emaile Göre</Button> {/* Email'e göre sıralama */}
                        <Button onClick={() => {
                            setSortedPhotos([...photos]);
                            setFilterType("all");
                        }}>Tümünü Göster</Button>
                    </div>
                ) : <div></div>}
            </div>

            <div className="mt-10">
                {filterType === "email" && type === "customer" ? (
                    <>
                        {Object.keys(groupedPhotos).map((email, emailGroupIndex) => (
                            <div key={email}>
                                <h2 className="text-xl font-bold mb-4">{email}</h2>
                                <div className={`grid grid-cols-1 sm:grid-cols-${filterCol} lg:grid-cols-${filterCol} gap-6`}>
                                    {groupedPhotos[email].map((photo, photoIndex) => (
                                        <div
                                            key={photo.id}
                                            className="overflow-hidden rounded-lg border-2 border-gray-200 cursor-pointer"
                                            onClick={() => openModal(displayedPhotos.findIndex(p => p.id === photo.id))} // Doğru indeksle açıyoruz
                                        >
                                            <Image
                                                src={photo.image_url}
                                                alt={`Photo ${photoIndex + 1}`}
                                                priority={photoIndex < 3}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className={`grid grid-cols-1 sm:grid-cols-${filterCol} lg:grid-cols-${filterCol} gap-6`}>
                            {photos?.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="overflow-hidden rounded-lg border-2 border-gray-200 cursor-pointer"
                                    onClick={() => openModal(index)}
                                >
                                    <Image
                                        src={photo.image_url}
                                        alt={`Photo ${index + 1}`}
                                        priority={index < 3}
                                        width={500}
                                        height={300}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
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
                                src={displayedPhotos[currentIndex].image_url}
                                alt={`Photo ${currentIndex + 1}`}
                                fill
                                className="rounded-lg object-contain"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ImageGallery;
