"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postCreateAlbum } from '@/lib/actions/album.actions'
import apiClient from '@/app/utils/api/ApiClient'
import { useSession } from 'next-auth/react';

function createAlbum() {
    const { data: session } = useSession();
    const token = session.accessToken;

    const [inputValue, setInputValue] = useState('');

    // input değiştiğinde çalışacak fonksiyon
    const handleChange = (event) => {
        setInputValue(event.target.value);
        console.log(inputValue);

    };
    const handleSubmit = async () => {
        try {
            const response = await postCreateAlbum({ name: inputValue }, token)
            // const { data } = await apiClient.post("/protected/createAlbum", { name: inputValue })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='m-10'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button >Albüm Oluştur</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Albüm Oluştur</DialogTitle>
                        <DialogDescription>
                            Albümünüze bir isim verin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Albüm İsmi
                            </Label>
                            <Input id="name" type="text"
                                value={inputValue}
                                onChange={handleChange}
                                className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} type="submit">Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default createAlbum