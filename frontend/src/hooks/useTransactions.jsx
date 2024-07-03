import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleGetTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getTransactions();
            if (response.status === 200) {
                setTransactions(response.data);
            } else {
                alert("Failed to fetch transactions");
            }
        }
        catch (error) {
            setError(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (dataToSend) => {
        try {
          const response = await apiService.createTransaction(dataToSend);
          if (response.status === 201) {
            handleGetTransactions();
          } else {
            setError("Failed to create transaction");
          }
            return response;
        } catch (error) {
          setError(error.message);
        }
      };

    const handleDeleteTransaction = async (id) => {
        setLoading(true);
        try {
          const response = await apiService.deleteTransaction(id);
          if (response.status === 204) {
            setTransactions((prevTransactions) =>
              prevTransactions.filter((transaction) => transaction.id !== id)
            );
          } else {
            setError("Failed to delete transaction");
          }
        } catch (error) {
          setError(error);
        } finally {
            setLoading(false);
        }
        };

    const handleGetImportedTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getImportedTransactions();
            if (response.status === 200) {
                setTransactions(response.data);
            } else {
                alert("Failed to fetch imported transactions");
            }
        }
        catch (error) {
            setError(error);
        }
        finally {
            setLoading(false);
        }
      };

      const handleImportTransactions = async (formData) => {
        try {
          const response = await apiService.importTransactions(formData);
          if (response.status === 200) {
            handleGetTransactions();
            handleGetImportedTransactions();
          } else {
            setError("Failed to import transactions");
          }
          return response;
        } catch (error) {
          setError(error.message);
          throw error;
        }
      };

      useEffect(() => {
        handleGetTransactions();
      }, []);

        return { 
            transactions, 
            loading, 
            error, 
            handleGetTransactions, 
            handleDeleteTransaction, 
            handleGetImportedTransactions,
            handleCreateTransaction,
            handleImportTransactions
        };
};

export default useTransactions;