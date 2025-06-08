import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase/firebase'; // ✅ Correct named import

const AdminUploads: React.FC = () => {
    const [jsonData, setJsonData] = useState('');
    const [type, setType] = useState<'courses' | 'assignments' | 'classes'>('courses');

    const handleUpload = async () => {
        try {
            const data = JSON.parse(jsonData);
            const colRef = collection(db, type);

            const promises = data.map((item: any) => addDoc(colRef, item));
            await Promise.all(promises);

            alert(`${type} uploaded successfully`);
            setJsonData('');
        } catch (err) {
            alert('Error uploading: ' + err);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upload {type}</h1>
            <select
                className="mb-4 p-2 border"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
            >
                <option value="courses">Courses</option>
                <option value="assignments">Assignments</option>
                <option value="classes">Classes</option>
            </select>
            <textarea
                className="w-full h-60 p-4 border mb-4"
                placeholder="Paste JSON here"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpload}
            >
                Upload
            </button>
        </div>
    );
};

export default AdminUploads;