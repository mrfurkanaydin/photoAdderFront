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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateAlbum, getAlbums, UpdateAlbumName } from '@/lib/actions/album.actions'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FiEdit3, FiEye } from 'react-icons/fi'

function Albums() {
    const { data: session } = useSession();
    const token = session.accessToken;
    const [albums, setAlbums] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editId, setEditId] = useState('');
    const router = useRouter()
    useEffect(() => {
        fetchAlbums()
    }, []);

    const fetchAlbums = async () => {
        const data = await getAlbums(token)
        setAlbums(data.albums)
        console.log(data.albums);
    }

    // input değiştiğinde çalışacak fonksiyon
    const handleChange = (event) => {
        setInputValue(event.target.value);
        console.log(inputValue);
    };
    const handleSubmit = async () => {
        try {
            if (editId == "") {
                const response = await CreateAlbum({ name: inputValue }, token)
                console.log("createResponse", response);
            } else {
                const response = await UpdateAlbumName(editId, { name: inputValue }, token)
                console.log("updateResponse", response);
            }
            fetchAlbums()
        } catch (error) {
            console.log(error);
        }
    }
    console.log(albums);
    const handleEdit = (id, name) => {
        console.log("edit", id);
        setInputValue(name)
        setEditId(id)
    }
    const handleView = (id) => {
        router.push('/customer/album/' + id)
    }
    const cleanStates = () => {
        setInputValue("")
        setEditId("")
    }

    return (
        <div className='m-10'>
            <Dialog>
                <DialogTrigger asChild onClick={cleanStates}>
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
                    {
                        albums && albums.length > 0 ?
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Albüm Adı</TableHead>
                                            <TableHead className=" text-center">Fotoğraf Sayısı</TableHead>
                                            <TableHead className="text-center">Albüm Boyutu (MB)</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {albums?.map((album) => (
                                            <TableRow key={album.id} className=''>
                                                <TableCell className="font-medium w-[200px]">{album.name}</TableCell>
                                                <TableCell className="font-medium text-center">{album.image_count}</TableCell>
                                                <TableCell className="font-medium text-center">{album.total_size_mb.toFixed(1)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className='flex justify-end gap-4'>

                                                        <DialogTrigger asChild onClick={() => handleEdit(album.id, album.name)}><button><FiEdit3 /></button></DialogTrigger>
                                                        <button onClick={() => handleView(album.id)}><FiEye /></button>
                                                        {/* <FiTrash /> */}

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            : <>Henüz Albüm Oluşturmadınız</>
                    }
                </div>
            </Dialog>
        </div>
    )
}

export default Albums