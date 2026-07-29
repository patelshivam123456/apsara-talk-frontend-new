import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import {
  searchLocation,
  type KundaliPlace,
} from "@/services/kundali.service";

export type KundaliMatchingPlace = KundaliPlace & {
  timezoneId?: string;
  countryName?: string;
  countryCode?: string;
};

export type MatchingGender = "male" | "female" | "others" | "";
export type ChartStyle =
  | "NORTH_INDIAN"
  | "SOUTH_INDIAN"
  | "EAST_INDIAN"
  | "WEST_INDIAN";
export type StringBoolean = "true" | "false";

export type PersonBirthDetails = {
  firstName: string;
  lastName: string;
  fullName: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  min: string;
  sec: string;
  lat: string;
  lon: string;
  gender: MatchingGender;
  place: string;
};

export type KundaliMatchingPayload = {
  p1: PersonBirthDetails;
  p2: PersonBirthDetails;
  options: {
    ashtakoot: StringBoolean;
    dashakoot: StringBoolean;
    papasamyam: StringBoolean;
  };
  branding: {
    chartStyle: ChartStyle;
  };
};

export type KundaliMatchingResponse = {
  status?: number;
  success?: boolean;
  message?: string;
  data?: {
    astrology?: unknown;
    divine?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export class KundaliMatchingServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "KundaliMatchingServiceError";
    this.status = status;
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isCancel(error)) {
    return "Request cancelled";
  }

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
      return "Invalid birth details. Please review the form.";
    case 401:
      return "Your session is not authorized for this request.";
    case 403:
      return "You do not have permission to generate this report.";
    case 404:
      return "Kundali matching service was not found.";
    case 422:
      return "Some birth details could not be processed.";
    case 500:
      return "Kundali matching service is temporarily unavailable.";
    case 502:
      return "Kundali matching service could not be reached. Please try again.";
    case 504:
      return "Request timed out. Please try again.";
    default:
      return "Unable to generate Kundali Matching report. Please check the details and try again.";
  }
}

function wrapError(error: unknown): KundaliMatchingServiceError {
  const axiosError = error as AxiosError;
  return new KundaliMatchingServiceError(
    getErrorMessage(error),
    axiosError.response?.status,
  );
}

export { searchLocation };

export async function generateKundaliMatching(
  payload: KundaliMatchingPayload,
  config: AxiosRequestConfig = {},
): Promise<KundaliMatchingResponse> {
  try {
    const response = await axios.post("/api/kundali-matching/generate", payload, {
      ...config,
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        ...config.headers,
      },
      timeout: 45000,
    });

    return response.data;
  } catch (error) {
    throw wrapError(error);
  }
}
