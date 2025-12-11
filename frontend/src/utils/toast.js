import { toast } from 'react-toastify';

/**
 * Toast notification utilities for consistent error/success messaging
 */

export const showToast = {
  /**
   * Show success toast notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  success: (message, options = {}) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show error toast notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  error: (message, options = {}) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show warning toast notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show info toast notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  info: (message, options = {}) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  /**
   * Show loading toast notification (promise-based)
   * @param {Promise} promise - Promise to wait for
   * @param {object} messages - Object with pending, success, error messages
   * @returns {Promise} Original promise
   */
  promise: (promise, messages) => {
    return toast.promise(promise, {
      pending: {
        render: messages.pending || 'Loading...',
        icon: '⏳',
      },
      success: {
        render: messages.success || 'Done!',
        icon: '✅',
      },
      error: {
        render({ data }) {
          return messages.error || data?.message || 'Error occurred';
        },
        icon: '❌',
      }
    });
  }
};

/**
 * Extract and format error message from various error types
 * @param {Error|object|string} error - Error object or message
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    return error.error;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handle API error with toast notification
 * @param {Error} error - Error from API
 * @param {string} defaultMessage - Default message if parsing fails
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = getErrorMessage(error) || defaultMessage;
  showToast.error(message);
  return message;
};

/**
 * Handle API success with toast notification
 * @param {string} message - Success message to display
 */
export const handleApiSuccess = (message) => {
  showToast.success(message);
};
