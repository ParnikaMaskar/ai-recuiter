"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3, "Name is required") : z.string().optional(),
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        password: z.string().min(3, "Password must be at least 3 characters"),
    });
} 



const AuthForm = ({ type}: {type: FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },  
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
   try{
        if (type === 'sign-up') {
            const { name, email, password } = values;

            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const result = await signUp({
                uid: userCredentials.user.uid,
                name: name!,
                email,
                password,
            })
            if (!result ?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success("Sign up successful!");
            router.push("/sign-in"); // Redirect to sign-in page after successful sign-up
        }
        else {
            const { email, password } = values;
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredentials.user.getIdToken();
            if(!idToken) {
                toast.error("Failed to get user token. Please try again");
            }
            await signIn({
                email,idToken});

            toast.success("Sign in successful!");
            router.push("/"); // Redirect to dashboard after successful sign-in
        }
   }
   catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form. Please try again.");
    }
}

  const isSignin = type ==='sign-in'

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="Logo" width={38} height={32} />
                <h2 className="text-primary">PrepWise</h2>
            </div>
             <h3> Practice Job Interview With AI </h3>
        
       
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full space-y-6 mt-4 form">
            {!isSignin && (
                <FormField 
                control={form.control} 
                name="name" 
                label="Name" 
                placeholder="Enter your name" />
            )}
             <FormField 
                control={form.control} 
                name="email" 
                label="Email" 
                placeholder="Enter your email address"
                type="email" />

             <FormField 
                control={form.control} 
                name="password" 
                label="Password" 
                placeholder="Enter your password" 
                type="password"/>

            <Button className="btn" type="submit">{isSignin ? 'Sign in' : 'Create an account'}</Button>
        </form>
        </Form>
        <p className="text-center">
            {isSignin ? "No account yet?" : "Already have an account?"} 
            <Link href={!isSignin ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">
                {!isSignin ? "Sign in" : "Sign up"}
            </Link>
            
        </p>

    </div>
    </div> 
  )
}

export default AuthForm