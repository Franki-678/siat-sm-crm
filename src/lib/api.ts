import axios, { AxiosError } from "axios";
import type { FormPayload, RiskResponse } from "@/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor() {
    super("La solicitud superó el tiempo de espera de 15 segundos");
    this.name = "TimeoutError";
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}

export async function calcularRiesgo(payload: FormPayload): Promise<RiskResponse> {
  try {
    const response = await apiClient.post<RiskResponse>("", payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new TimeoutError();
      }
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND" ||
        !error.response
      ) {
        throw new NetworkError(
          "No se puede conectar con el servidor en 192.168.0.92. Verifica que la Raspberry Pi esté encendida y n8n esté corriendo."
        );
      }
      throw new ServerError(
        error.response?.data?.message ||
          `Error del servidor: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw error;
  }
}
