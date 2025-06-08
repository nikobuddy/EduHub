import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase/firebase';

const exampleData: Record<string, any> = {
    courses: [
        {
            title: "Advanced Mathematics",
            students: 45,
            completion: 78,
            thumbnail: "https://example.com/math.jpg"
        }
    ],
    submissions: [
        {
            student: "Alice Johnson",
            assignment: "Calculus Problem Set 5",
            course: "Advanced Mathematics",
            submitted: "2 hours ago",
            status: "ungraded"
        }
    ],
    classes: [
        {
            course: "Advanced Mathematics",
            time: "10:00 AM",
            students: 45,
            room: "Room 101"
        }
    ]
};

const AdminUpload: React.FC = () => {
    const [jsonData, setJsonData] = useState('');
    const [collectionName, setCollectionName] = useState('courses');

    const handleUpload = async () => {
        try {
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data)) {
                alert('Data must be an array of objects');
                return;
            }
            const batchUpload = async () => {
                for (const item of data) {
                    await addDoc(collection(db, collectionName), item);
                }
            };
            await batchUpload();
            alert('Upload successful!');
        } catch (error) {
            console.error(error);
            alert('Invalid JSON or upload failed.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Admin Upload</h2>

            <label className="font-semibold block">Select Collection</label>
            <select
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="border p-2 rounded w-full"
            >
                <option value="courses">Courses</option>
                <option value="submissions">Submissions</option>
                <option value="classes">Classes</option>
            </select>

            <div className="bg-gray-100 p-3 rounded border text-sm text-gray-700 whitespace-pre overflow-auto">
                <p className="font-semibold mb-1">Example JSON:</p>
                <pre>{JSON.stringify(exampleData[collectionName], null, 2)}</pre>
            </div>

            <textarea
                className="w-full h-64 border p-2 rounded"
                placeholder="Paste your JSON here..."
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
            />

            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Upload to Firestore
            </button>
        </div>
    );
};

export default AdminUpload;