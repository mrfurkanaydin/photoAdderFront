"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
function uploads() {
    const router = useRouter();
    const [id, setId] = useState("")
    useEffect(() => {
        setId(localStorage.getItem("id"))
    }, []);
    const handleRegister = () => {
        router.push('/uploads/register')
    }
    const handleLogin = () => {
        router.push(`/customer/signin?callbackUrl=%2Falbum%2F${JSON.parse(id)}`)
    }

    const handleGuest = () => {
        router.push('/uploads/album/' + JSON.parse(id))
    }

    return (
        <div className='flex justify-center items-center h-screen shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]'>
            <Card className="w-[450px] flex flex-col sm:p-10 p-2 sm:m-0 m-4  gap-2">
                <Button onClick={handleRegister} variant="outline">Kayıt Ol</Button>
                {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                <p className='text-sm text-center opacity-50'>Yüklediğiniz Fotoğrafları Görmeniz İçindir</p>
                <Separator />
                <Button disabled onClick={handleGuest}>Misafir Olarak Devam Et</Button>
                <p className='text-sm text-center opacity-50'>Daha Sonra Kayıt Olma Adımına Dönebilirsiniz</p>
                <Separator />
                <Button onClick={handleLogin} variant="outline">Giriş Yap</Button>
                <p className='text-sm text-center opacity-50'>Giriş Yaparak Yüklemeye Başlayabilirsiniz</p>

            </Card>
        </div>
    )
}

export default uploads