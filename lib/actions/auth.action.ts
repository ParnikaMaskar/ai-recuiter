'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";



export async function signUp(params:SignUpParams) {
    const {uid, name, email} = params;
    try {
       const userRecord = await db.collection('users').doc(uid).get();
       if (userRecord.exists) {
           return {
               success: false,
               message: 'User already exists.'
           };
       }
       await db.collection('users').doc(uid).set({
           name,
           email,
       });
       return{
              success: true,
              message: 'Sign up successful.Please sign in to continue.'
       }
    } catch (error: any) {
        console.error('Error signing up:', error);
        if(error.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: 'Email already exists. Please use a different email.'
            }
        }
        return{
            success: false,
            message: error.message || 'An error occurred during sign up.'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found.'
            };
        }
        // Set session cookie
        await setSessionCookie(idToken);
        return {
            success: true,
            message: 'Sign in successful.'
        };
    } catch (error: any) {
        console.error('Error signing in:', error);
        return {
            success: false,
            message: error.message || 'An error occurred during sign in.'
        };
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn: 60 * 60 * 24 * 5 * 1000}); // 5 days
    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return { ...userRecord.data(), id: userRecord.id } as User;
    }
    catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user; 
}

