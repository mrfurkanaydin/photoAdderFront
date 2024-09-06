"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { postRegister } from "@/lib/actions/auth.actions"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    role: z.string(),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState("")
    const router = useRouter();

    useEffect(() => {
        setId(localStorage.getItem("id"))
    }, []);
    
    const defaultValues = {
        email: '',
        password: '',
        role: 'user'
    };
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        const data = await postRegister(values);
        console.log(data)
        if (data.status == 200) {
            router.push(`/customer/signin?callbackUrl=%2Falbum%2F${JSON.parse(id)}`);
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <Card className="w-[450px] flex flex-col sm:p-10 p-2 sm:m-0 m-4  gap-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email..."
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password..."
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={loading} className="ml-auto w-full" type="submit">
                            Kayıt Ol
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
