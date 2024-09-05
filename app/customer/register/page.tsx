// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const RegisterSchema = Yup.object().shape({
//     email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta gereklidir'),
//     password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gereklidir'),
// });

// const Register = () => {
//     // const router = useRouter();

//     const handleSubmit = async (values, { setSubmitting }) => {
//         //     try {
//         //         const response = await axios.post('http://localhost:8080/register', values);
//         //         console.log('Başarılı:', response.data);
//         //         const { token } = response.data
//         //         localStorage.setItem('jwtToken', token);
//         //         router.push('/customer');

//         //     } catch (error) {
//         //         console.error('Hata:', error.response ? error.response.data : error.message);
//         //     } finally {
//         //         setSubmitting(false);
//         //     }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
//                 <Formik
//                     initialValues={{ email: '', password: '' }}
//                     validationSchema={RegisterSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ isSubmitting }) => (
//                         <Form>
//                             <div className="mb-4">
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
//                                 <Field
//                                     type="email"
//                                     name="email"
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                                 <ErrorMessage
//                                     name="email"
//                                     component="div"
//                                     className="text-red-600 text-sm mt-1"
//                                 />
//                             </div>
//                             <div className="mb-6">
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
//                                 <Field
//                                     type="password"
//                                     name="password"
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                                 <ErrorMessage
//                                     name="password"
//                                     component="div"
//                                     className="text-red-600 text-sm mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                 >
//                                     {isSubmitting ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
//                                 </button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };

// export default Register;


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
import { useState } from "react"
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
    const router = useRouter();
    const defaultValues = {
        email: '',
        password: '',
        role: 'customer'
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
            router.push('/customer/signin');
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
