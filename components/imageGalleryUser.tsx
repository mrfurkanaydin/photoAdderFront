import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiMinimize2 } from 'react-icons/fi'
import { Button } from './ui/button';

function ImageGalleryUser({ photos }) {
    const [isOpen, setIsOpen] = useState(false); // Modal açık mı kapalı mı
    const [currentIndex, setCurrentIndex] = useState(0); // Şu anda hangi resim gösteriliyor
    const [filterCol, setFilterCol] = useState("12");

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
    return (
        <>
            <div className="grid grid-cols-3 gap-6 mt-3">
                <div></div>
                <div className="text-3xl font-bold">Fotoğraf Galerisi</div>
                <div className='lg:flex gap-2 justify-center items-center hidden lg:show'>
                    <div>Filtreler:</div>
                    <Button onClick={() => setFilterCol("4")}>4 li</Button>
                    <Button onClick={() => setFilterCol("12")}>12 li</Button>
                </div>

            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${filterCol} gap-6`}>
                {photos?.map((photo, index) => (
                    <div
                        key={index}
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
                                fill
                                className="rounded-lg object-contain"
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
        </>
    )
}

export default ImageGalleryUser