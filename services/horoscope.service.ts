import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export type HoroscopePeriod = "daily" | "weekly" | "monthly" | "yearly";

export class HoroscopeServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "HoroscopeServiceError";
    this.status = status;
  }
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;

  if (axiosError.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!axiosError.response) {
    return "Network error. Please check your connection and try again.";
  }

  const status = axiosError.response.status;
  const apiMessage =
    axiosError.response.data?.message || axiosError.response.data?.error;

  if (apiMessage) {
    return apiMessage;
  }

  switch (status) {
    case 400:
      return "Invalid zodiac sign. Please select a sign again.";
    case 401:
      return "Your session is not authorized for this horoscope.";
    case 404:
      return "Horoscope service was not found.";
    case 422:
      return "This horoscope request could not be processed.";
    case 500:
      return "Horoscope service is temporarily unavailable.";
    case 502:
      return "Horoscope service could not be reached. Please try again.";
    case 504:
      return "Request timed out. Please try again.";
    default:
      return "Unable to load horoscope right now.";
  }
}

function wrapError(error: unknown): HoroscopeServiceError {
  const axiosError = error as AxiosError;
  return new HoroscopeServiceError(
    getErrorMessage(error),
    axiosError.response?.status,
  );
}

async function getHoroscope(
  period: HoroscopePeriod,
  sign: string,
  config: AxiosRequestConfig = {},
) {
  try {
    const response = await axios.post(
      `/api/horoscope/${period}`,
      { sign },
      {
        ...config,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...config.headers,
        },
        timeout: 45000,
      },
    );

    return response.data;
  } catch (error) {
    throw wrapError(error);
  }
}

export const getDailyHoroscope = (sign: string, config?: AxiosRequestConfig) =>
  getHoroscope("daily", sign, config);

export const getWeeklyHoroscope = (sign: string, config?: AxiosRequestConfig) =>
  getHoroscope("weekly", sign, config);

export const getMonthlyHoroscope = (sign: string, config?: AxiosRequestConfig) =>
  getHoroscope("monthly", sign, config);

export const getYearlyHoroscope = (sign: string, config?: AxiosRequestConfig) =>
  getHoroscope("yearly", sign, config);

export function getHoroscopeByPeriod(
  period: HoroscopePeriod,
  sign: string,
  config?: AxiosRequestConfig,
) {
  const methods = {
    daily: getDailyHoroscope,
    weekly: getWeeklyHoroscope,
    monthly: getMonthlyHoroscope,
    yearly: getYearlyHoroscope,
  };

  return methods[period](sign, config);
}
