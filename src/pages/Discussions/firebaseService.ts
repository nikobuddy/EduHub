import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

export const enrollInCourse = async (courseId: number) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        const enrolled = data.enrolledCourses || [];
        if (!enrolled.includes(courseId)) {
            await updateDoc(userDocRef, {
                enrolledCourses: [...enrolled, courseId],
            });
        }
    } else {
        await setDoc(userDocRef, {
            enrolledCourses: [courseId],
        });
    }
};

export const getUserEnrolledCourses = async (): Promise<number[]> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return [];

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        return data.enrolledCourses || [];
    } else {
        return [];
    }
};
