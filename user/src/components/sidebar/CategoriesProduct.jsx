import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoriesProduct = () => {
    const { categoryId } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}`);
                console.log(response);
                
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{height: '100vh', background: 'black', position:'fixed'}}>
            <h2>Products in Category {categoryId}</h2>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available in this category.</p>
            )}
        </div>
    );
};

export default CategoriesProduct;
