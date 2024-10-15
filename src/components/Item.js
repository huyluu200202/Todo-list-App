import React, { useEffect, useState } from "react";
import axios from "axios";

function ItemList() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null);
    const [allChecked, setAllChecked] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        setAllChecked(items.every(item => item.completed));
    }, [items]);

    async function fetchItems() {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const res = await axios.get(`http://localhost:4001/api/items?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(res.data);
        } catch (error) {
            console.error('Error fetching items:', error.message);
        }
    }

    async function handleAddItem() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to use.');
            return;
        }

        if (name.trim() === '') {
            alert('Item name is required');
            return;
        }

        try {
            if (editId) {
                await axios.put(`http://localhost:4001/api/items/${editId}`, { name }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post('http://localhost:4001/api/items', { name }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setName('');
            setEditId(null);
            fetchItems();
        } catch (err) {
            console.log(err);
        }
    }

    function handleEdit(item) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to use.');
            return;
        }
        setName(item.name);
        setEditId(item._id);
    }

    async function handleDelete(id) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to use.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4001/api/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchItems();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleToggleComplete(item) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to use.');
            return;
        }

        try {
            await axios.put(`http://localhost:4001/api/items/${item._id}`, { completed: !item.completed }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchItems();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleCheckAll() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to use.');
            return;
        }

        const newCompletedStatus = !allChecked;
        try {
            await Promise.all(
                items.map(item =>
                    axios.put(`http://localhost:4001/api/items/${item._id}`, { completed: newCompletedStatus }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
            );
            fetchItems();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h2>Item List</h2>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
            />
            <button onClick={handleAddItem}>{editId ? 'Update' : 'Add'}</button>
            <input
                type="text"
                placeholder="Search task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleCheckAll}>
                {allChecked ? 'Uncheck All' : 'Check All'}
            </button>
            <ul>
                {items
                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item => (
                        <li key={item._id}>
                            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                                {item.name}
                            </span>
                            <button onClick={() => handleEdit(item)} disabled={allChecked || item.completed}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(item._id)} disabled={allChecked || item.completed}>
                                Delete
                            </button>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleComplete(item)}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default ItemList;
