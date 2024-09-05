"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
function uploads() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { status } = useSession()

    useEffect(() => {
        localStorage.setItem("id", JSON.stringify(id))
        if (status === "unauthenticated") {
            router.push('/uploads')
        }
    }, []);
    const handleRegister = () => {
        router.push('/uploads/register')
    }
    const handleLogin = () => {
        router.push('/uploads/signin')
    }

    return (
        <div className='flex justify-center items-center h-screen shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]'>
            <p>Upload</p>
            {/* <Card className="w-[450px] flex flex-col sm:p-10 p-2 sm:m-0 m-4  gap-2">
                <Button onClick={handleRegister} variant="outline">Kayıt Ol</Button>
                <p className='text-sm text-center opacity-50'>Yüklediğiniz Fotoğrafları Görmeniz İçindir</p>
                <Separator />
                <Button>Misafir Olarak Devam Et</Button>
                <p className='text-sm text-center opacity-50'>Daha Sonra Kayıt Olma Adımına Dönebilirsiniz</p>
                <Separator />
                <Button onClick={handleLogin} variant="outline">Giriş Yap</Button>
                <p className='text-sm text-center opacity-50'>Giriş Yaparak Yüklemeye Başlayabilirsiniz</p>

            </Card> */}
        </div>
    )
}

export default uploads