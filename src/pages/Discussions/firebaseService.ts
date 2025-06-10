import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

const db = getFirestore();

export interface UserCourseProgress {
    progress: number;
    completedLessons: number;
    hoursStudied: number;
    completed: boolean;
    score: number;
    lastAccessed: string;
    enrolledAt: string;
}

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

    // Initialize user's course progress
    const userCourseRef = doc(db, `users/${user.uid}/courses`, courseId.toString());
    await setDoc(userCourseRef, {
        progress: 0,
        completedLessons: 0,
        hoursStudied: 0,
        completed: false,
        score: 0,
        lastAccessed: new Date().toISOString(),
        enrolledAt: new Date().toISOString()
    });
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

export const getUserCourseProgress = async (courseId: number) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;

    const userCourseRef = doc(db, `users/${user.uid}/courses`, courseId.toString());
    const userCourseSnap = await getDoc(userCourseRef);

    if (userCourseSnap.exists()) {
        return userCourseSnap.data();
    }
    return null;
};

export const updateUserCourseProgress = async (courseId: number, progress: number, completedLessons: number, hoursStudied: number) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userCourseRef = doc(db, `users/${user.uid}/courses`, courseId.toString());
    const isCompleted = progress >= 100;

    await updateDoc(userCourseRef, {
        progress,
        completedLessons,
        hoursStudied,
        completed: isCompleted,
        lastAccessed: new Date().toISOString()
    });

    return isCompleted;
};

export const getAllUserCourses = async (): Promise<(UserCourseProgress & { courseId: string })[]> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return [];

    const userCoursesRef = collection(db, `users/${user.uid}/courses`);
    const userCoursesSnap = await getDocs(userCoursesRef);
    
    return userCoursesSnap.docs.map(doc => ({
        courseId: doc.id,
        ...doc.data()
    } as UserCourseProgress & { courseId: string }));
};
