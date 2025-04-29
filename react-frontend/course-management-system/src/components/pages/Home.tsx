import { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
    id: number;
    name: string;
    description: string;
}

interface HomeResponse {
    message: string;
    featured_courses: Course[];
}

export default function Home() {
    const [data, setData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get<HomeResponse>('http://localhost:5000/api/home')
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        })
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
          <h1 className="text-3xl font-bold">{data?.message}</h1>
          <h2 className="text-xl mt-4">Featured Courses</h2>
          <ul className="mt-4">
            {data?.featured_courses.map(course => (
              <li key={course.id} className="p-4 border-b">
                <h3 className="text-2xl font-semibold">{course.name}</h3>
                <p>{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
    );
}
