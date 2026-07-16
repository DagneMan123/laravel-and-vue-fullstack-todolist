import { useNotification } from './useNotification'

export function useToast() {
  const { success, error, warning, info } = useNotification()

  /**
   * Show a success notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000)
   */
  const showSuccess = (message: string, duration: number = 5000) => {
    success(message, duration)
  }

  /**
   * Show an error notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 7000)
   */
  const showError = (message: string, duration: number = 7000) => {
    error(message, duration)
  }

  /**
   * Show a warning notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 6000)
   */
  const showWarning = (message: string, duration: number = 6000) => {
    warning(message, duration)
  }

  /**
   * Show an info notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000)
   */
  const showInfo = (message: string, duration: number = 5000) => {
    info(message, duration)
  }

  /**
   * Shorthand for success
   */
  const success_ = showSuccess

  /**
   * Shorthand for error
   */
  const error_ = showError

  /**
   * Shorthand for warning
   */
  const warning_ = showWarning

  /**
   * Shorthand for info
   */
  const info_ = showInfo

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    success: success_,
    error: error_,
    warning: warning_,
    info: info_,
  }
}
