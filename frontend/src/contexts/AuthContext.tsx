import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, name: string, role: 'ADMIN' | 'STUDENT') => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        id: firebaseUser.uid,
                        name: userData.name || firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: userData.role || 'STUDENT',
                        photoURL: firebaseUser.photoURL || undefined,
                    });
                } else {
                    setUser({
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'STUDENT',
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signUp = async (email: string, pass: string, name: string, role: 'ADMIN' | 'STUDENT') => {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', res.user.uid), {
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
        });
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                signIn,
                signUp,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
