import { useState } from 'react';
import apiService from '../services/apiService';

const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetCurrentUser = async () => {
        try {
            const response = await apiService.getCurrentUser();
            if (response.status === 200) {
                return response.data.username;
            } else {
                alert("Failed to fetch current user");
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleGetTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getTransactions();
            if (response.status === 200) {
              const sortedTransactions = response.data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
                setTransactions(sortedTransactions);
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
            await handleGetTransactions();
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

    const handleUpdateTransaction = async (id, transactionData) => {
        try {
          const response = await apiService.updateTransaction(id, transactionData);
          if (response.status === 200) {
            await handleGetTransactions();
          } else {
            setError("Failed to update transaction");
          }
          return response;
        } catch (error) {
          setError(error.message);
        }
      }

    const handleGetImportedTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getImportedTransactions();
            if (response.status === 200) {
              const sortedTransactions = response.data.sort((a, b) => { 
                new Date(b.created_at) - new Date(a.created_at);
              });
              setTransactions(sortedTransactions);
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
            await handleGetTransactions();
            await handleGetImportedTransactions();
          } else {
            setError("Failed to import transactions");
          }
          return response;
        } catch (error) {
          setError(error.message);
          throw error;
        }
      };

        return { 
            transactions, 
            loading, 
            error, 
            handleGetTransactions, 
            handleDeleteTransaction, 
            handleGetImportedTransactions,
            handleCreateTransaction,
            handleImportTransactions,
            handleUpdateTransaction,
            handleGetCurrentUser
        };
};

export default useTransactions;