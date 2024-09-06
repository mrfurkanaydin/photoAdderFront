"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAlbums, postCreateAlbum } from '@/lib/actions/album.actions'
import { FiEdit3, FiEye, FiTrash } from "react-icons/fi";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

function Albums() {
    const { data: session } = useSession();
    const token = session.accessToken;
    const router = useRouter()
    const [inputValue, setInputValue] = useState('');
    const [albums, setAlbums] = useState([]);

    useEffect(() => {

        fetchAlbums()
    }, []);

    const fetchAlbums = async () => {
        const data = await getAlbums(token)
        setAlbums(data?.albums)
    }
    console.log(albums);


    // input değiştiğinde çalışacak fonksiyon
    const handleChange = (event) => {
        setInputValue(event.target.value);
        console.log(inputValue);

    };
    const handleSubmit = async () => {
        try {
            //create or update prefer
            const response = await postCreateAlbum({ name: inputValue }, token)
            // const { data } = await apiClient.post("/protected/createAlbum", { name: inputValue })
            console.log(response);
            fetchAlbums()
        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit = (id, name) => {
        console.log("edit", id);
        setInputValue(name)
    }
    const handleView = (id) => {
        router.push('/customer/album/' + id)
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
                        <DialogClose asChild>
                            <Button onClick={handleSubmit} type="submit">Kaydet</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>


                <div className='mt-10'>
                    {/* <div>Albümlerin</div> */}
                    <div>
                        {/* {albums && albums?.map((item) => (
                        <div key={item.ID}><Button></Button>{item.name}</div>
                    ))} */}


                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Albüm Adı</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {albums.map((album) => (
                                    <TableRow key={album.ID} className=''>
                                        <TableCell className="font-medium w-[200px]">{album.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className='flex justify-end gap-4'>

                                                <DialogTrigger asChild onClick={() => handleEdit(album.ID, album.name)}><button><FiEdit3 /></button></DialogTrigger>
                                                <button onClick={() => handleView(album.ID)}><FiEye /></button>
                                                {/* <FiTrash /> */}

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default Albums