import { auth, firestore, provider } from "@/lib/firebase"
import { signInWithPopup, signOut } from "firebase/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";

export default function LoginPage({ }) {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    )
}

// Sign in with google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, provider);
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )

}

// Sign out button
function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign out</button>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, "users", user.uid)
        const usernameDocRef = doc(firestore, "usernames", formValue);
        batch.set(userDocRef, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDocRef, { uid: user.uid });
        await batch.commit();
    }

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const docRef = doc(firestore, "usernames", username);
                const docSnap = await getDoc(docRef);

                setIsValid(!docSnap.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>

                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        if (username.length > 3) {
            return <p className="text-danger">That username is taken!</p>;
        } else {
            return <p className="text-danger">Username is too short! Minimum 3 characters.</p>
        }
    } else {
        return <p></p>;
    }
}