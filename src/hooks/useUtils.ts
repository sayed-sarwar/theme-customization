import { useState, useCallback } from 'react';

export const useErpUtils = () => {
  const [loading, setLoading] = useState(false);

  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  const formatDate = useCallback((date: string | Date) => {
    return new Date(date).toLocaleDateString();
  }, []);

  const validateEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

 

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    loading,
    setLoading,
    formatCurrency,
    formatDate,
    validateEmail,
    generateId,
    copyToClipboard
  };
};