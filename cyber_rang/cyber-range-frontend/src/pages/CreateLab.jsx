import { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { labService } from '../services/lab.service';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const CreateLab = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        difficulty: 'easy',
        dockerImage: '',
        points: 100,
        category: ''
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await labService.getCategories();
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, category: data[0]._id }));
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await labService.createLab(formData);
            alert('Lab Created Successfully');
            navigate('/labs');
        } catch (error) {
            alert('Error creating lab: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-xl">
                <h1 className="text-2xl font-bold">Create New <span className="text-accent">Lab</span></h1>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <Input label="Lab Name" id="name" value={formData.name} onChange={handleChange} required />
                        <Input label="Description" id="description" value={formData.description} onChange={handleChange} required />

                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <select className="input" id="category" value={formData.category} onChange={handleChange} style={{ color: 'white' }}>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Difficulty</label>
                            <select className="input" id="difficulty" value={formData.difficulty} onChange={handleChange} style={{ color: 'white' }}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <Input label="Docker Image Tag" id="dockerImage" value={formData.dockerImage} onChange={handleChange} required placeholder="e.g. nginx:latest" />
                        <Input label="Points" type="number" id="points" value={formData.points} onChange={handleChange} required />

                        <Button type="submit" className="w-full mt-lg" disabled={loading}>
                            <PlusCircle size={20} /> {loading ? 'Creating...' : 'Create Lab'}
                        </Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateLab;
