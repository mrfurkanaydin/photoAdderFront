import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from "react-qr-code";
import axios from 'axios';

export default function Customer() {
    const [qr, setQr] = useState(false)
    const [link, setLink] = useState("")
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            // Token yoksa kullanıcıyı login sayfasına yönlendirin
            router.push('/customer/login');
        }
    }, [router]);

    const generateQR = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.get('http://localhost:8080/protected/generateQR', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('Başarılı:', response.data);
            setLink(response.data.link)
            setQr(true);
        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);
        }
    }
    return (
        <>
            <p>Fotoğrafları Yüklenmesi için Gereken QR kodu Oluştur</p>
            <button onClick={generateQR} className='bg-green-500 px-5 py-2 rounded-md text-white hover:bg-green-700'>Oluştur</button>
            {qr && <QRCode value={link} />}

        </>);
}
