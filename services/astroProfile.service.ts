import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export type AstroProfilePlace = {
  placeName: string;
  latitude: string;
  longitude: string;
  timezoneId?: string;
};

export type AstroProfileBirthDetails = {
  fullName: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  min: string;
  gender: "male" | "female" | "others" | "";
  place: string;
  lat: string;
  lon: string;
  timezoneId?: string;
};

export type AstroProfileRequest = {
  birth: AstroProfileBirthDetails;
};

export class AstroProfileServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AstroProfileServiceError";
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
      return "Invalid birth details. Please review the form.";
    case 401:
      return "Your session is not authorized for this request.";
    case 404:
      return "Astro profile service was not found.";
    case 422:
      return "Some birth details could not be processed.";
    case 500:
      return "Astro profile service is temporarily unavailable.";
    case 502:
      return "Astro profile service could not be reached. Please try again.";
    case 504:
      return "Request timed out. Please try again.";
    default:
      return "Unable to generate Astro Profile right now.";
  }
}

function wrapError(error: unknown): AstroProfileServiceError {
  const axiosError = error as AxiosError;
  return new AstroProfileServiceError(
    getErrorMessage(error),
    axiosError.response?.status,
  );
}

export async function searchLocation(
  birthPlace: string,
  config: AxiosRequestConfig = {},
): Promise<AstroProfilePlace[]> {
  try {
    const response = await axios.get("/api/astro-profile/search-location", {
      ...config,
      params: { birthPlace },
      headers: {
        accept: "*/*",
        ...config.headers,
      },
      timeout: 12000,
    });

    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    throw wrapError(error);
  }
}

export async function getBasicAstroDetails(
  payload: AstroProfileRequest,
  config: AxiosRequestConfig = {},
) {
  try {
    const response = await axios.post(
      "/api/astro-profile/basic-details",
      payload,
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
