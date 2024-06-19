import React, { useState, useEffect } from "react";
import api from "../api";

function IncomeApp() {
    const [incomes, setIncomes] = useState([]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(3); // Default to "Other"
    const [description, setDescription] = useState("");
    const [repetitive, setRepetitive] = useState(false);
    const [repetitionInterval, setRepetitionInterval] = useState(5); // Default to "None"

    useEffect(() => {
        getIncomes();
    }, []);

    const getIncomes = () => {
        api
            .get("/api/incomes/")
            .then((res) => res.data)
            .then((data) => {
                setIncomes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteIncome = (id) => {
        api
            .delete(`/api/incomes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Income deleted");
                else alert("Failed to delete income.");
                getIncomes();
            })
            .catch((error) => alert(error));
    };

    const createIncome = (e) => {
        e.preventDefault();
        api
            .post("/api/incomes/", { amount, category, description, repetitive, repetition_interval: repetitionInterval })
            .then((res) => {
                if (res.status === 201) alert("Income created");
                else alert("Failed to create income.");
                getIncomes();
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
            <div>
                <h2>Incomes</h2>
                <ul>
                    {incomes.map((income) => (
                        <li key={income.id}>
                            <p>Amount: {income.amount}</p>
                            <p>Category: {income.category}</p>
                            <p>Description: {income.description}</p>
                            <p>Repetitive: {income.repetitive ? "Yes" : "No"}</p>
                            <p>Repetition Interval: {income.repetition_interval}</p>
                            <button onClick={() => deleteIncome(income.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <h2>Create an Income</h2>
            <form onSubmit={createIncome}>
                <label htmlFor="amount">Amount:</label>
                <br />
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                />
                <br />
                <label htmlFor="category">Category:</label>
                <br />
                <select
                    id="category"
                    name="category"
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                >
                    <option value={1}>Salary</option>
                    <option value={2}>Gift</option>
                    <option value={3}>Other</option>
                </select>
                <br />
                <label htmlFor="description">Description:</label>
                <br />
                <textarea
                    id="description"
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></textarea>
                <br />
                <label>
                    Repetitive:
                    <input
                        type="checkbox"
                        checked={repetitive}
                        onChange={(e) => setRepetitive(e.target.checked)}
                    />
                </label>
                <br />
                <label htmlFor="repetitionInterval">Repetition Interval:</label>
                <br />
                <select
                    id="repetitionInterval"
                    name="repetitionInterval"
                    onChange={(e) => setRepetitionInterval(e.target.value)}
                    value={repetitionInterval}
                    disabled={!repetitive}
                >
                    <option value={1}>Daily</option>
                    <option value={2}>Weekly</option>
                    <option value={3}>Monthly</option>
                    <option value={4}>Yearly</option>
                    <option value={5}>None</option>
                </select>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default IncomeApp;
