"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from "react-qr-code";
import { useSession } from 'next-auth/react';
import apiClient from '../utils/api/ApiClient'
export default function Customer() {
    // const [qr, setQr] = useState(false)
    // const [link, setLink] = useState("")
    // const [loading, setLoading] = useState(true);
    // const router = useRouter();
    // const { data: session, status } = useSession();    
    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         router.push('/customer/signin')
    //     }
    // }, []);
    // const getLink = async () => {
    //     try {
    //         const response = await apiClient.get("/protected/getQR");
    //         console.log('Başarılı:', response.data);
    //         setLink(response.data.link)
    //         setQr(true);
    //     } catch (error: any) {
    //         console.error('Hata:', error.response ? error.response.data : error.message);
    //     }
    // }

    // useEffect(() => {
    //     if (session && session.user.role == "customer") {
    //         getLink();
    //         setLoading(false)
    //     } else {
    //         if (session && session.user.role && session.user.role !== "customer") {
    //             setLoading(false)
    //             return router.push('/unauthorize');
    //         }
    //     }
    // }, [session]);

    // if (loading || !session.user.role) {
    //     return <>LOADİNGGGG......</>
    // }

    // const generateQR = async () => {
    //     try {
    //         const response = await apiClient.get("/protected/generateQR");

    //         console.log('Başarılı:', response.data);
    //         setLink(response.data.link)
    //         setQr(true);
    //     } catch (error: any) {
    //         console.error('Hata:', error.response ? error.response.data : error.message);
    //     }
    // }
    return (
        <>
            <p>Fotoğrafları Yüklenmesi için Gereken QR kodu Oluştur</p>
            {/* {link ? <button disabled onClick={generateQR} className='bg-gray-500 px-5 py-2 rounded-md text-white hover:bg-gray-700'>Oluştur</button> : <button onClick={generateQR} className='bg-green-500 px-5 py-2 rounded-md text-white hover:bg-green-700'>Oluştur</button>}
            {session.user.role}
            {qr && <QRCode value={link} />} */}

        </>);
}
