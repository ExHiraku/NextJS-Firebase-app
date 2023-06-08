import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { auth } from '@/lib/firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            const docRef = doc(firestore, 'users', user.uid);
            unsubscribe = onSnapshot(docRef, (docData) => {
                setUsername(docData.data()?.username);
            })
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}